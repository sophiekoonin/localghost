---
title: Everything I googled in a week as a professional software engineer
date: 2019-09-02
tags: ['engineering', 'work']
summary: "In an attempt to dispel the idea that if you have to google stuff you're not a proper engineer, this is a list of nearly everything I googled in a week at work, where I'm a software engineer with several years' experience."
---

In an attempt to dispel the idea that if you have to google stuff you're not a proper engineer, this is a list of nearly everything I googled in a week at work, where I'm a software engineer with several years' experience.

{{< img src="*/ground.png" alt="Threw it on the ground." >}}

Obviously these weren't all googled in a row (although you can probably spot that a few were), but throughout the day. I can't remember the context of everything I was googling, but hopefully it'll make you feel a little better next time you have to google something.

## Monday

`npm react-testing-library` - during a React upgrade, looking at dependencies to see latest versions and checking for breaking changes.

`Expecting a parsed GraphQL document. Perhaps you need to wrap the query string in a "gql" tag?` - said React upgrade then started causing some super fun errors.

`react-apollo release notes`

`react-apollo/test-utils` - tests were throwing some odd errors with our graphQL components.

`undo a rebase` - oops.

`react testing library apollo "invariant violation"` - package upgrades are so much fun!

`jest silence warnings` - don't judge me, ok?

`semantic HTML contact details` - wanted to check if the `<address>` tag was relevant here

`aa contrast checker`

`temporary visual impairment` - fact checking for an accessibility talk I was giving that week

`dominos accessibility` - popcorn.gif

`shame gif` - an important part of any presentation

## Tuesday

`javascript get array of unique dates` - if I have an array of `Date`s, how can I filter them so they are unique? (`reduce`, naturally, but I can rarely use that without googling it first)

`date to locale string`

`js date to locale string` - after I got a load of Java results

`alternatives to Moment.js` - it's large

`group array items by date` - more `reduce` fun

`sort object keys javascript`

`react fragment keys`

`next link` - needed a reminder of how to use the Link component in Next.JS

`React.Children.only expected to receive a single React element child.`

`visual studio code disable autocomplete html` - it keeps autoclosing HTML elements on the same line, and I still can't switch it off

`dt dd dl` - couldn't remember what the example use for these was.

`html nested sections` - is it ok to have `<section>` inside `<section>`?

`display dl in pairs`

`veggie ipsum` - the best lorem ipsum generator

`css keyframes`

`css animate underline text`

`dl vs ul`

`react generating keys` - should I use some kind of hash, or should I use data in the props? (I ended up constructing a string with unique timestamp data)

`css checkbox` - can we style checkboxes yet? (no)

`flexbox center span` - it was 17:24 and I was tired by this point

`grid minmax`

`flexible grid row` - I don't have a whole lot of CSS Grid experience, so I always end up googling a ton with this.

`grid row height auto`

`cauliflower shortage` - someone told me about this and I panicked

`next.js hooks` - we can use them, right? (we can, and I did)

## Wednesday

`cors` - today is going to be bleak

`the corrs` - once I hit some CORS errors I decided I needed to make a meme, and I needed to find the perfect image. It took a surprisingly long time.

{{< img src="*/thecorrs-search.png" alt="Image of many many Google search results for The Corrs">}}

{{< img src="*/thecors.jpg" alt="The CORS." caption="Worth it" >}}

`git patch trailing whitespace` - I was sent a git patch with some whitespace that prevented it from actually patching

`jsx annotation`

`web api fetch preflight` - in my CORS adventures I wanted to read up a bit more about preflight requests.

`web api fetch origin header`

`discriminated union flow` - trying to diagnose problems with my Flow types.

`whitespace regex` - is it `\w`? (no, that's a word - it's `\s`)

`regex not letter`

`pat butcher emoji` - what can I say, I google important things

`woman shouting at cat`

`google oauth`

`next.js authentication` - sometimes it's helpful to google stuff to see if anyone has written examples of how to do common flows in the framework or tool that you're using

`component displayname` - do I need to do this with my higher-order components?

`nextCookie` - starting to mess around with oauth cookies

`reading cookies in react` - there must be a better way than `document.cookie`

`js-cookie npm`

`cookies-js`

`npm cookie`

`universal-cookie`

`google oauth cookie`

🍪

## Thursday

`"log in with google" localhost` - was having all sorts of problems getting this to work

`httpserverrequest javascript` - I have a feeling this was something to do with Flow types

`nextjs flowtypes` - yep, there you go

`"python-social-auth" react` - trying to figure out if the django backend I was working with would play nicely with my React frontend

`google social login`

`vary header`

`get cookie from 302`

`google social login cookies` - I was having a really fun time with this as you can tell

`google oauth cookie`

`python-social-auth set-cookie`

`python-social-auth site:stackoverflow.com`

`python-social-auth react site:stackoverflow.com`

`django` - I think I gave up at this point and just googled Django because I have literally never used it

`fetch send cookies`

`testing same origin credentials locally`

`cross origin cookies` - spoiler alert: not a thing

`useState default value`

`"The value of the 'Access-Control-Allow-Origin' header in the response must not be the wildcard '*' when when the request's credentials mode is 'include'.` - googling error messages is only second to console.log() as a debugging method

`useState with empty array`

`react hooks initial state empty array`

`"Provisional headers are shown"` - this is where the requests weren't going through and I couldn't see what the actual headers being sent were

`fetch send cookies`

`how to see request headers in chrome`

`fetch not sending cookies`

Thursday was a whole lot of fun D:

## Friday

`provisional headers are shown` - still at it.

`sending cookies from localhost` - have I mentioned that I hate cookies?

`editing host file` - desperate times (and it didn't even work)

`sending cookies with different domain`

`next cookie`

`getinitialprops functional component`

`getting cookies from document`

`js find` - to check the usage and return types

`string contains`

`string methods js` - I can't keep any of these in my head

`js string methods` - 20 mins later

`js fetch manual cookie`

`django react cookies localhost`

`django react cookies localhost site:stackoverflow.com`

`httponly cookie`

`django httponly`

`async await promise.all`

`nextjs port`

`google appengine node ports`

`next rename static`

`install gcloud cli`

`method patch` - couldn't remember what the HTTP method `PATCH` does.

`nextjs env`

`next.js environment variables`

`next js docs`

`editing data with hooks` - literally no idea what I was trying to google here but this was past 5pm so I was evidently quite tired

`react form submit`

`dayjs` - I needed the documentation again.

What I'm trying to show with all this is that you can do something 100 times but still not remember how to do it off the top of your head. Never be ashamed of googling, even if it seems like the most basic thing you're looking up. I can never remember how `Date` works.
I've built plenty of forms in React but couldn't remember how `onSubmit` worked on the Friday evening at 5:30pm. I constantly have to google JS string methods. Cookies are terrible. (Incidentally, we fixed the cookie issue by running everything in a docker container and tunneling with `ngrok`, so everything's on the same domain.)
