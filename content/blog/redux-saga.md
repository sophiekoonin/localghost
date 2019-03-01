---
title: "redux-saga: an introduction"
date: 2018-03-15T15:00:00Z
tags: ['redux', 'react', 'javascript']
---

I recently gave my first ever conference talk at ReactFest, woohoo! (Greatly helped by the excellent tips I got from the Twitter tech community — check out my previous post to see them: Things Experienced Speakers Wish They’d Known: Tips For First-Time Conference Speakers). I thought I’d share what I talked about — a brief overview of the redux-saga side effect management middleware for Redux — in the form of a blog post to help anyone who’s desperately Googling redux-saga in the hope of understanding what function* actually means. I was in your place once, friend. Don’t worry, soon all will become clear and you’ll be evangelising to anyone who will listen (and some who won’t) about the healing properties of the yield keyword.

Redux-sagas are great for many reasons but I think the biggest advantage is how easy they are to test, and you’ll see why.

I’ve included some dog-related examples to help you on your way, because [dogs are so good](http://hotcomicsforcoolpeople.tumblr.com/post/123990818632).

### Very Important Caveat

I don’t subscribe to the attitude of “my library is better than your library and you should be using it”. I like redux-saga, but if you like something else more, that’s fine, I won’t berate you. In return, don’t tell me I’m wrong for using redux-saga or that redux is dead etc etc. — in the end, it all comes down to what’s suitable for your project.

### Wait. Redux?

I’m going to assume you know what Redux is. I’m not sure why you’d be looking into Redux middleware if you didn’t, but hey, you’ve got to start somewhere. If you’re not sure where to start with Redux, check out [A Dummy’s Guide to Redux](https://medium.com/@stowball/a-dummys-guide-to-redux-and-thunk-in-react-d8904a7005d3) by [Matt Stow](undefined) — I found this a really easy-to-understand guide, especially as the official docs can often be quite daunting.

### The only list you’ll ever need

![A web page featuring a list of “Dogs of the Week” , with pictures of four dogs accompanied by their name, age, breed and favourite toy.](/img/redux-saga/dogsoftheweek.png)

Here’s my example React application: a list of dogs with vital information. All the dogs are based on real dogs I have known and loved, but I did pinch the pictures from the internet so please let me know if I need to credit anyone.

In the real world, I probably wouldn’t need redux-saga for this application, but I’m using it as an illustration.

### What exactly is a `side effect`?

In the world of programming, a {{< bold >}}side effect{{< /bold >}} is something that changes the application’s state — or the state of something outside of the application. This could include changing the value of external variables, disk I/O, or — in the case of the examples I’m going to use here — API calls. Despite the somewhat misleading name, side effects aren’t bad or accidental— in many cases they are necessary and useful.

Here’s a diagram with a basic example of an application without side effects. In React, this could be a container (controller) passing a hard-coded image URL to the component (view). Or this all might just happen inside the component itself. The important thing is that the image URL is hard-coded and not fetched from anywhere. The whole thing is synchronous: that is, code is executed line by line and happens in order.

![The image shows a controller talking to a view. The controller is instructing the view to display a picture of a dog. The view displays the picture of the dog.](/img/redux-saga/view-controller.png)

In an application with side effects, this would be a little different. Imagine our dog picture is fetched from an API somewhere. Before the view can display the image, the controller needs to talk to the API to get the image.

![The image shows a controller talking to a view. The controller says “wait, let me go and get this picture”. The controller then fetches the picture from the API and tells the view to display the picture it has just fetched. The view displays the picture of the dog.](/img/redux-saga/fetch.png)

Things just got asynchronous: so that we don’t block the flow of the application, the API fetch needs to happen outside of the main flow of the application and return its result when it can. We want the application to continue executing while this happens.

So how are we going to handle these async side effects in our React program? Before we get into the detail of redux-saga, let’s look at two other possibilities.

### Side effects in lifecycle methods

A really simple way of fetching data from an API in a React component is to call it in a lifecycle method. By performing an API call in `componentDidMount`, you’ll only call it after the first render has completed.

{{< highlight javascript >}}
export default class DogList extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      dogs: []
    }
  }

componentDidMount() {
    api.fetchDogs()
        .then(response => this.setState({ dogs: response.dogs }))
  }
  ...
}
{{< /highlight >}}

This works, but things get a bit more complicated when you want to reuse components or keep the business logic out of your components. And if you’re using Redux, it makes little sense to be using component states on top of the application state. Besides, if your side effects go beyond anything more than a simple API call, things can get complicated fast and you’ll end up with a ton of code in your lifecycle components.

### Side effects with redux-thunk

Arguably the most common side effect management middleware for redux is redux-thunk.

A thunk is a function returned by another function in order to delay execution until it is needed. In the case of redux-thunk, you can trigger functions when the middleware receives certain actions.

{{< highlight javascript >}}
const fetchDogs = dispatch => 
  api.fetchDogs()
    .then(({dogs}) => dispatch(fetchDogsSucceeded(dogs)))
{{< /highlight >}}

Thunks are fine, but the more complicated your data fetches get, the more of a tangle you find yourself in. What if the dogs’ favourite toys were stored in a separate resource requiring a separate API call?

{{< highlight javascript >}}
const fetchDogs = dispatch => {
  dispatch(fetchDogsRequested())
  api.fetchDogs()
      .then(({dogs}) => Promise.all(dogs.map(dog =>
  fetchFavouriteToy(dog)(dispatch))))
      .then(dogs => dispatch(fetchDogsSucceeded(dogs)))
}

const fetchFavouriteToy = dog => dispatch => {
  dispatch(fetchToysRequested(dog))
  return api.fetchToy(dog).then(({toy}) => ({...dog, toy}))
}
{{< /highlight >}}

This code will call `api.fetchDogs`, then map across the resulting array of dogs, fetching the favourite toy for each dog in a similar way. Then it dispatches a `fetchDogsSucceeded` action with the resulting collection of dogs and toys.

This is fine, it does what it needs to do, except you can end up with some very confusing promise chains which sometimes have a tendency to swallow errors.

Let’s write some tests.

{{< highlight javascript >}}
jest.mock('../fetch-toys');
jest.mock('../fetch-dogs-succeeded')
jest.mock(api.fetchDogs, () => jest.fn(() => ({
  ok: true,
  body: {
    dogs: [ 'Gandalf', 'Pepsi']
  }
})));

test('calls fetchDogs API', () => {
  const dispatch = jest.fn()
  fetchDogs(dispatch)
  expect(dispatch).toHaveBeenCalledWith(fetchDogs)
  expect(api.fetchDogs).toHaveBeenCalled
})

test('dispatches fetchFavouriteToysRequested with the fetched dogs if response is ok', () => {
  const dispatch = jest.fn()
  fetchDogs(dispatch)
  expect(dispatch).toHaveBeenCalledWith(fetchFavouriteToy)
})
{{< /highlight >}}

Oh right, this is why I don’t like thunks. You have to mock EVERYTHING. You end up with test setups that are twice as long as the actual code. On a previous project I worked on, we had a thunk which performed a fetch and then dispatched two subsequent thunks with the data it received. We got into quite a mess mocking it and testing all the calls.

![A dog tangled up in some window blinds.](/img/redux-saga/window-blinds.jpeg)

### Introducing redux-saga

According to the [docs](https://redux-saga.js.org/docs/introduction/BeginnerTutorial.html), “redux-saga is a library that aims to make application side effects … easier to manage, more efficient to execute, simple to test, and better at handling failures.”

Here’s getDog in saga form:

{{< highlight javascript >}}
function* getDog = () => {
  try {
    const res = yield call(api.fetchDogs)
    const dogsWithToys = yield all(res.dogs.map(dog => fetchFavouriteToy(dog)))
    yield put(fetchDogsSucceeded(dogsWithToys))
  } catch (error) {
    yield put(fetchDogsFailed(error))
  }
}

function* fetchFavouriteToy({ dog }) {
  try {
    const response = yield call(api.fetchFavouriteToy, dog)
    return {...dog, favouriteToy: response.toy}
  } catch (error) {
    yield put(fetchFavouriteToyFailed(error))
  }
}
{{< /highlight >}}

This code does the same thing as the thunk example above, but if for any reason the API call fails, the catch block will dispatch a `fetchDogsFailed` action with the error.

Sagas are kept in separate files, away from your actions (which are plain Javascript objects) and your components. The middleware handles the execution: you can find more information on how to plug in the saga middleware in the [official docs](https://redux-saga.js.org/docs/introduction/BeginnerTutorial.html).

One thing you might notice is that it looks… synchronous. We’ve got a try/catch block with a series of statements, not a promise in sight. How is code like this executing asynchronously when it looks like this?

The answer is something called a {{< bold >}}generator{{< /bold >}}.

### ES6 Generators

A generator is a function which, when invoked, returns an Iterator. So, when you invoke the saga functions above, rather than immediately executing the code inside, they return an Iterator with a series of steps.

A generator is defined with the function keyword followed by an asterisk:

{{< highlight javascript >}}
function* getDog = () => {
    try {
      const res = yield call(api.fetchDogs)
      const dogsWithToys = yield all(res.dogs.map(dog => fetchFavouriteToy(dog)))
      yield put(fetchDogsSuccessful(dogsWithToys))
    } catch (error) {
      yield put(fetchDogsFailed(error))
    }
}
{{< /highlight >}}

Each step in the generator is defined with the yield keyword. It’s a bit like await if you’ve ever used that — basically, the generator will block until the result of the yield is returned. But what’s cool is that while the generator is blocked, the rest of the application can continue executing as normal.

Generators can be paused and resumed at any time, and their states are saved while paused. This makes them ideal for asynchronous tasks that might take a while.

### Triggering sagas

Sagas are triggered using special watcher functions, which plug into the middleware and listen for particular actions being dispatched.

{{< imgcaption src="/img/redux-saga/watch.jpeg" title="Dog watching TV" caption="This dog is watching for patDogRequested, obviously.">}}

{{< highlight javascript >}}
function* watchForFetchDogsRequested() {
  yield takeLatest('FETCH_DOGS_REQUESTED', fetchDogs)
}
{{< /highlight >}}


When the action is dispatched, the saga middleware will execute the `fetchDogs` saga. takeLatest means that only the most recent action is used; if the `fetchDogs` saga has been kicked off, and a new `fetchDogsRequested` action is dispatched, the previous task will be cancelled and a new one started. This is useful for fetching the most up-to-date information.

You can also use takeEvery, which is similar except it triggers the saga for every action it receives rather than just the latest. For example, with the action `patDogRequested`, you’d probably want to use `takeEvery` because you want to give those dogs every single head pat that is coming to them.

### Function call… objects?

It gets even cooler, though: each step of the saga returns an object describing the code in that step. For example, the API call fetchDogs might return an object as follows:

{{< highlight javascript >}}
const res = yield call(api.fetchDogs)

// return value
{
  CALL: {
    context: null,
    fn: [Function: api.fetchDogs],
    args: []
  }
}
{{< /highlight >}}


The key here is the `call` function. It’s part of the redux-saga library of {{< bold >}}effects{{< /bold >}}, and all behave the same way, returning objects with descriptions of code. In this case, `call` is an instruction to call a function. These objects are like instructions for the saga middleware, which will execute them step-by-step in the saga.

### redux-saga effects

As well as `call`, here are some other handy effects you can use to tame your wild async code:

* `race` allows you to trigger two asynchronous tasks at the same time, and whichever one finishes first 'wins’, causing the other one to be cancelled. For example, if you’re making an api call that doesn’t have a timeout on it, you might want to impose one this way.

{{< highlight javascript >}}
const { response, timeout } = yield race({
  response: call(api.patDog, dogId),
  timeout: delay(1000, 'oh no')
})
{{< /highlight >}}


* `put` dispatches an action to the store
* `select` calls a selector to get a value from the state
* `fork` triggers a task in a separate thread
* `cancel` allows you to cancel a previously triggered saga
* `all` allows you to trigger several tasks in parallel and won't return until they have all finished (a bit like `Promise.all`) which is particularly useful for calling several selectors:

{{< highlight javascript >}}
const [
    favouriteFood,
    favouriteToy
] = yield all([
    select(getFavouriteFood),
    select(getFavouriteToy)
])
{{< /highlight >}}

### Testing sagas

This, in my opinion, is where sagas really shine. If you're doing TDD, having a library which is easy to test is a godsend.

Since each step of the saga returns an object, and the saga itself is a generator, we can simply invoke the saga to get an `Iterator` object and call its `next()` function to access each step. Then we can assert on the value of the object that each step returns.

Here, we are checking the value of the first step of the saga to make sure its value is equal to the object returned by `call(api.fetchDogs)`:

{{< highlight javascript >}}
import { call } from 'redux-saga/effects'
test('calls fetchDogs API', () => {
    const iterator = fetchDogs()
    expect(iterator.next().value).toEqual(call(api.fetchDogs))
})
{{< /highlight >}}


Or, if you are using Jest, you could use snapshot testing to match the value of the iterator step which is even easier. And no mocking required!

You can also test branching logic. In a saga with a `try/catch` block, you can call `iterator.throw()` and make sure that it's doing the right thing when an error occurs:

{{< highlight javascript >}}
test('dispatches fetchDogsFailed if the call fails', () => {
    const iterator = fetchDogs()
    iterator.next()
    expect(iterator.throw('oh no').value)
        .toEqual(call(fetchDogsFailed('oh no')))
})
{{< /highlight >}}

You can also pass different values into `iterator.next()` to influence conditional logic such as if statements. It's all very clever.

### Conclusion

You probably {{< bold >}}don't{{< /bold >}} need redux-saga if:

* Your application is really small and has few side effects
* You don't have complex data fetches
* You are using thunks or observables or something similar and you are perfectly happy with these things

You might want to try redux-saga if:

* You are making data fetches which then do other fetches/complicated things with the fetched data
* You are doing test-driven development and/or writing unit tests
* You want to keep your actions pure and your components free of business logic
* You've had enough of Promises

Happy iterating!
