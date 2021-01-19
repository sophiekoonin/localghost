---
title: "SHEBot: automating the stuff I'm too lazy to do for SHE Choir London"
date: '2099-12-29'
draft: true
tags: ['slack', 'automation']
---

Like many developers, if I have to do a manual task more than a couple of times, I start to wonder how I can automate it. A colleague once referred to this as being "Developer Lazy" - spending an exorbitant amount of time building some kind of automated solution because you can't be bothered to do something over and over.

Around 2015, [SHE Choir London](https://shechoir.com/london) experienced a lot of growth - suddenly, we had lots of members, and they kept coming back! We were forced to start a waiting list (at the time of writing, it's over 300 people, which is both exciting and frustrating) and we began taking attendance every week to track who was still coming, as sometimes we'd just find that someone had apparently vanished. I found a template on the internet, and created a spreadsheet. (The choir gave me a "Spreadsheet Queen" mug for Christmas one year.)

Our choir ethos states that it's fine if you can't come every week - we know people work irregular shifts, and sometimes life happens. But when people stop coming altogether and disengage from the choir we need to know, so that we can keep track of spaces for new members. If I could see at a glance who had vanished, I could get in touch with them and find out if they were coming back.

So when I found myself printing off attendance sheets and then manually typing in the data into a Google Sheet after each rehearsal (or, more often than not, forgetting to do that at all), I started to wonder if there was a better way. We were already heavy users of Slack, so that was an obvious starting point.

## Introducing the SHEBot

SHEBot posts in Slack every week on rehearsal day, inviting all our members to emoji react with whether they are coming or not. It also gives people an opportunity to volunteer to run a warmup or facilitate the rehearsal, and shows information about what songs we'll be doing.

{{< img class="inset-image" src="*/post-1.png" alt="A Slack post with a message inviting people to RSVP to rehearsal."  >}}

As well as posting on the day, the bot posts reminders four days before rehearsal, with info about what's coming up and a reminder to listen to recordings of the songs to get them fresh in your mind.

{{< img class="inset-image" src="*/rehearsal-msg.png" alt="A message reminding people about what's coming up next week"  >}}

The reactions from each attendance post are collected and displayed in a report alongside some stats about attendance in the last four weeks. This tells me who I need to get in touch with!

{{< img class="inset-image" src="*/attendance-report.png" alt="A report showing who hasn't been responding to the attendance posts"  >}}

## How it works

SHEBot is a Slack app running on Google AppEngine, built in Typescript/Node.JS using the [Slack SDK](https://slack.dev/node-slack-sdk/). The app itself is an [Express](https://expressjs.com) server with endpoints that receive Slack interaction and event payloads, as well as an endpoint for the GAE [cron service](https://cloud.google.com/appengine/docs/standard/nodejs/scheduling-jobs-with-cron-yaml) to hit.

Post data and Slack team-specific configuration is stored in a Cloud Firestore, a NoSQL database that stores data as "documents" (the equivalent of a row in an SQL database, but more like an object with fields). This suits the use case perfectly, as each rehearsal has its own document with all the data relating to that date, such as who said they're attending and what the timestamp of the post is. There's a collection (the equivalent of a table) for each team's attendance data, and a collection for each team's configuration - things like what day the rehearsals are and what channel the bot should post in.

When the cron endpoint is hit, the app checks the database to see if there are any Slack teams with rehearsals on that day. If so, it'll post an attendance message to those Slack teams in the specified channel.

The message itself is made up of blocks from Slack's [Block Kit UI framework](https://api.slack.com/block-kit/building), composable parts that make up a Slack message. These blocks can contain anything from text to interactive components. In the case of the attendance message, the blocks are all text.

{{< highlight javascript >}}
  export const attendanceEmojiBlock: SectionBlock = {
    type: 'section',
    block_id: 'thumbs',
    text: {
      type: 'mrkdwn',
      text:
        '<!channel> Please indicate whether or not you can attend tonight by reacting to this message with :thumbsup: (present) or :thumbsdown: (absent).'
    }
  };
{{< /highlight >}}

Song data comes from Google Sheets, where we have a spreadsheet for our choir's schedule. In an ideal world we wouldn't have a dependency on a spreadsheet, because it's so easy to break if anyone moves a column or accidentally changes anything. But for now, it'll have to do, and our schedule team are spreadsheet queens as well. The app pulls the data via the Google Sheets API and the `googleapis` package. 

Rows on the schedule are indexed by the rehearsal date, and contain the song titles as well as links to the recordings in Google Drive. We've also got a space for additional notes. 

Every Sunday, the app will query the Firestore for the most recent attendance documents, and then get the reactions for each of the posts by the timestamp stored in the document. It'll then store the user IDs of each member that reacted in the document.

### Public holidays 
Since we don't rehearse on public holidays, I needed to find a way to prevent the bot from posting on days it shouldn't. Something fun I discovered during development of the app is that the Government Digital Service has a [Bank Holidays API](https://www.gov.uk/bank-holidays.json), which returns dates for all upcoming UK bank holidays (public holidays) - as well as whether or not [bunting](https://en.wikipedia.org/wiki/Bunting_(textile)) is appropriate. I built an in-memory cache to store the result of an API call to the Bank Holidays API, which is invalidated every month (this data doesn't change very often) - this prevents unnecessary requests to the API. Each day, the bot will check the current date against the list of holidays, and if there's a match it'll return early without posting.

## Configuring SHEBot

Earlier versions of the app had the configuration hardcoded, but the Slack [App Home beta](https://api.slack.com/surfaces/tabs) enabled me to build an actual UI for configuration. This allows me to distribute the app to other SHE Choirs (and we have quite a few now!) and make the setup less complex than slash commands would've been.

{{< img class="inset-image" src="*/app-home.png" alt="A configuration dashboard built on Slack's App Home beta"  >}}

When a user opens the App Home for an application, Slack sends a payload to the app's Event Subscriptions request URL. 

The App Home is also built using the Block Kit UI - this time, using section blocks with text and accessories - buttons, radio buttons and dropdowns. Some of these are buttons that trigger modals, and some make changes directly when you click on them. Whenever the user interacts with any of these inputs, Slack sends a payload to the app  that contains the ID of the action in question. This is used to determine what should happen next - e.g. whether it should push a new view onto the view stack or update a value in config.

{{< highlight javascript >}}
    switch (action_id) {
      case Actions.SET_CHANNEL:
        const id = action.selected_channels[0]
        try {
          const channelInfo = (await SlackClient.channels.info({
            token,
            channel: id
          })) as ChannelInfoResponse
          if (channelInfo.ok) {
            db.updateDbValue('teams', team.id, {
              channel: channelInfo.channel.name,
              channel_id: id
            })
            await joinChannel(team.id, channelInfo.channel.name, token)
          }
        } catch (err) {
          console.error(err)
        }
        break
      case Actions.SHOW_SHEET_MODAL:
        SlackClient.views.open({ view: setSheetIdView, token, trigger_id })
        break
      case Actions.SET_ATTENDANCE_BLOCKS:
        const view = await chooseAttendancePostBlocks(team.id)
        SlackClient.views.open({
          view,
          token,
          trigger_id
        })
        break
      case Actions.VIEW_REPORT:
        const repView = await reportView(team.id, token)
        SlackClient.views.open({
          view: repView,
          token,
          trigger_id
        })
        break
    default:
      break
  }
{{< /highlight >}}

The attendance posts are customisable - you can choose which blocks you want, and in which order. The Block Kit provides a multi-select input which was perfect for this. 

{{< img class="inset-image" src="*/att-blocks-1.png" alt="Preview of attendance messages"  >}}
{{< img class="inset-image" src="*/att-blocks-2.png" alt="Multi-select list to choose blocks for attendance messages"  >}}

The block IDs are stored in an array in the database, and then when it's time to post a message, the app checks the team's config and only posts the blocks in that array. 

## Check it out on GitHub
The source is on GitHub: [shebot](https://github.com/sophiekoonin/shebot)

If there's anything you want to know more about, let me know via [Twitter](https://twitter.com/type__error) and I'll do my best! 
