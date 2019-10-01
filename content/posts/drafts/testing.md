---
title: "Testing interactive applications with React Testing Library"
date: "2019-09-12"
draft: true
# hide: true
tags: ['react', 'javascript', 'testing', 'code']
---

Testing is one of those things that, unless it's ingrained into your way of working, is easy to neglect. It's also very easy to overdo. You can find yourself testing the most miniscule implementation details just because you feel like you _should_. I've written hundreds of unit tests in the past that really weren't telling me much other than "this component is doing what React components are supposed to do".

I can't claim to know the "correct" way to test applications, by any means. But what works for me is writing decent functional tests that cover a range of behaviours representing things that users might do on your app, without coupling it too tightly to the way things are built. 

In my book, that means:

* not shallow-mounting components (not rendering child components - this would never happen in reality so the testing isn't realistic)
* not accessing `instance()`s of mounted components to manipulate the state or call class functions directly (again, not realistic)
* not unit-testing things that aren't logic (so, not testing the components in isolation just to make sure they render stuff - that's what React is supposed to do, so why test it?)
* not testing the behaviour of third-party libraries
* not snapshot testing (the UI isn't going to stay the same forever, and it's too easy to blindly update the snapshots)

[React Testing Library](https://testing-library.com/docs/react-testing-library/intro) helps us achieve more realistic testing by allowing us to test the app functionality without worrying too much about what happens if we refactor something or move some logic to a different component. As the official docs say: "The more your tests resemble the way your software is used, the more confidence they can give you.".

So, how can you use it in your app? In order to write a suite of tests for the app I'm working on, I did an awful lot of googling, so I've collated all my findings in one place in the hope it'll get you started a bit quicker. 

Spotted something off? Please let me know via [Twitter](https://twitter.com/type__error).


***

## Our application
For the purpose of this article, I'll demonstrate with an entirely fictional application for a choir. It's a React app hooked up to a backend with a database, and we'll use it to store information about upcoming performances. The backend is irrelevant for this article as we'll be mocking out all the API calls. 

TODO picture of frontend

It's a pretty small application, so no Redux or Context. I've used React Hooks as they're tidier, so I've got a functional component calling the backend API in the `useEffect` hook instead of `componentDidMount`. 

The application lets you read information about gigs, edit this information, create todo items for each gig and edit/delete those todo items. 

Here's our `Gig` component. It's basically functioning as a wrapper for smaller components - `GigDetails` and `GigTodos`. It handles all the data fetching and is also where the functions to update/delete things are defined and passed into the child components. 

```
export default function Gig({ id }) {
  const [loading, setLoading] = useState(true)
  const [gig, setGig] = useState()
  const [users, setUsers] = useState([])
  const [isEditing, setIsEditing] = useState(false)
  const [error, setError] = useState()

  useEffect(
    () => {
      async function initialFetch() {
        try {
          const [fetchedUsers, gig] = await Promise.all([
            getUsers(),
            getGigData(id),
          ])
          setUsers(fetchedUsers)
          setGig(gig)
        } catch (error) {
          setError(error)
        }
      }
      initialFetch()
      setLoading(false)
    },
    [id],
  )

  function onCloseEdit() {
    setError()
    setIsEditing(false)
  }

  async function onEdit(updatedGig) {
    try {
      await editGig(updatedGig)
    } catch (error) {
      setError(error.message)
      return
    }
    onCloseEdit()
    setGig(updatedGig)
  }

  if (error != null && isEditing === false) {
    return <ErrorPage errorCode={error.code} message={error.message} />
  }

  if (loading === true) return <LoadingSpinner />
  if (incident == null) {
    return null
  }

  const {
    title,
    summary,
    slackChannel,
    todos,
    confirmed,
  } = gig

  return isEditing ? (
    <EditGig
      gig={gig}
      users={users}
      onDismiss={onCloseEdit}
      onSubmit={onEdit}
      error={error}
    />
  ) : (
    <section styleName="detail">
      <h1 data-testid="heading">{title}</h1>
      <div styleName="status">
        <span styleName="status-indicator">
          {confirmed ? 'confirmed' : 'potential'}
        </span>
        {slackChannel != null && (
          <>
            <span>・</span>
            <a
              href={`${env.slackURL}/messages/${slackChannel.channel_id}`}
              target="_blank"
              rel="noopener noreferrer"
              styleName="slack-link"
              title="Link to Slack channel for this gig"
            >
              #{slackChannel.channel_name}
            </a>
          </>
        )}
      </div>

      <section>
        <div styleName="summary-heading">
          <h2>Details</h2>{' '}
          <button onClick={() => setIsEditing(true)} styleName="edit-button">
            <EditIcon />
            Edit
          </button>
        </div>
        <p styleName="summary">
          {summary}
        </p>
        <GigDetails gig={gig} />
      </section>
      <GigTodos todos={todoItems || []} gigId={id} users={users} />
    </section>
  )
}
```



I've moved all the actual `fetch` calls to API helper functions - the nice thing about this is that I won't need to worry about mocking `fetch` itself, but I can easily write some mock functions for my API helpers. 


## Installation

NB. You'll need a test runner in addition to the `@testing-library/react` package: I tend to use [Jest](https://jestjs.io), but you could use Enzyme or similar if you want. This article will use Jest examples - if you aren't familiar with Jest, I recommend looking through the [docs](https://jestjs.io/docs/en/getting-started) for some helpful information about getting started. I won't go into the details of installing and setting up Jest here.

### Adding the packages
Install all the packages as `devDependencies`.

`yarn add --dev @testing-library/react @testing-library/jest-dom`

or

`npm i --save-dev @testing-library/react @testing-library/jest-dom`

We add these as `devDependencies` so they aren't installed with production deployments. 

Lucky for us, React Testing Library doesn't need any further setup, so we can get straight in to writing tests.

*** 

## Writing the first test

The difference between something like Enzyme and React Testing Library is that, rather than mounting a component in isolation, we are rendering the whole component tree. This lets us test how it would behave in the real world. 

React Testing Library gives us a function called `render` which will handle that  for us, and provide us with an object that contains a load of useful testing functions. 

