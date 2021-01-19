---
title: "Building interactive Slack apps in Node.JS with App Home and Block Kit"
date: '2020-01-01'
summary: "Slack apps have come a long way from simple webhooks and slash commands. In this post, you'll learn how to set up a Slack app and use Block Kit with App Home to create an interactive dashboard that shows stats about your Slack workspace. "
draft: true
tags: ['tutorial', 'node', 'slack']
---

Slack apps have come a long way from simple webhooks and slash commands. These days, you can build apps with interactive components and dynamic views. The new App Home beta opens up a lot of opportunities for displaying information or inviting the user to perform actions relating to your app.

Thankfully, Slack provides a helpful framework it calls the Block Kit to enable us to build smart-looking interactive components. In this post, you'll learn how to set up a Slack app and use Block Kit with App Home to create an interactive dashboard that shows stats about your Slack workspace. 

The completed app code is available on [GitHub](https://github.com/sophiekoonin/slack-app-tutorial/tree/app).

## Step 0: Before you start
Before you start coding, you'll need to set up a Slack workspace where you can test your app. Create a new workspace on the [Slack website](https://slack.com/create) and sign in. 

You'll also need [`ngrok`](https://ngrok.io/download) to test the app locally with Slack - this is a little CLI app that creates a tunnel to a local port on your computer, making it available on the internet via a randomised URL (or a static one, if you're a pro user). 

You'll then need to register a new app with Slack by going to [Your Apps](https://api.slack.com/apps) and clicking "Create new app". Give it a name, and select your test workspace from the dropdown.

{{< img class="inset-image" src="*/slack-create.png" alt="The Slack create app dialog" >}}

Once you've done this, you'll be taken to the configuration for your app - leave this open, we'll come back to it shortly.

## Step 1: Set up the app
If you'd like to download a ready-made base for the app, clone the [repo for the Slack App Tutorial](https://github.com/sophiekoonin/slack-app-tutorial). 

We're going to create a Node.JS app, so the first step is to initialise the project. I'm going to use `yarn` for these examples, but `npm` is fine too. Use `yarn init` or `npm init` to create your project. I'm using *Node.JS version 12*.

The npm packages you'll need are:

* `express` - to create a web server
* `@slack/web-api` - official Slack SDK for the [Slack Web API](https://api.slack.com/web)
* `dotenv` - to manage environment variables
* `nodemon` for local hot reloading (optional, but makes life easier)

In the app base I've included two scripts in `package.json` - a `dev` script that runs `nodemon` with `dotenv` config, and a basic `start` script. I'll be referring to these scripts in the tutorial.

{{< highlight javascript >}}
  "scripts": {
    "dev": "nodemon -r dotenv/config src/server.js",
    "start": "node src/server.js"
  },
{{< /highlight >}} 

## Step 2: Create the web server
We're going to create a basic web server that will allow our app to communicate with Slack. Open up `src/server.js`, then import and initialise Express.

We'll need to configure a body parser as well, because the requests and responses will have content types of `application/json` and `application/x-www-form-urlencoded`. Luckily this is included with Express.


{{< highlight javascript >}}
const express = require('express')
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
{{</ highlight >}}

For now, we'll define one GET endpoint at the app root, so we can make sure everything's working.

{{< highlight javascript >}}
app.get('/', (req, res) => {
  res.send('Hello world!')
})
{{< /highlight >}}

Finally we'll define a port (hardcoded for now) and get the server running with `app.listen`.

{{< highlight javascript >}}
const port = 6060
app.listen(port, () => {
  console.log(`App listening on port ${port}`)
  console.log('Press Ctrl+C to quit.')
})
{{< /highlight >}}

Run your app with `yarn dev` and open `localhost:6060` in your browser. You should see "Hello world!". If you don't, check your terminal console to see if anything's gone wrong.

## Step 3: Authenticate with Slack
Before you can post to Slack from the app, you'll need to authenticate with Slack via OAuth. On the dashboard for your Slack app that you created earlier, go to the "OAuth and Permissions" tab. Scroll down to the "Scopes" section.

**Scopes** are specific permissions that your app has which dictate exactly what it can do on Slack. For example, the `chat:write` scope allows the app to post a message. You can see the full list of scopes on the [API documentation](https://api.slack.com/scopes).

At the time of writing, the "new" more granular scopes are in beta, but we're going to use them because they ask for less information outright. Click the "Update scopes" button - this will take you to a page where you can select the scopes you want.

In this "new scopes" world, scopes are split into two categories - **bot token scopes** and **user token scopes**. You

You can change these scopes and add new ones at any time, but for now, choose these **bot token scopes**, as we'll be interacting with the Slack workspace as a bot, not as a user.