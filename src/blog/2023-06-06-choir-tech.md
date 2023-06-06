---
title: What happens when a software developer takes over a community choir
date: '2023-06-06'
draft: true
excerptText: Meet the choir with its own Slack app!
tags: ['projects']
---

Some may call it "over-engineering"; I see it as automating the jobs I never liked doing. That's what we call "developer lazy". 

I've been a part of [SHE Choir](https://shechoir.com) since 2012, when I joined what was  then a small, student-run choir at the University of Manchester. The founders graduated, moved down to London and started a second SHE Choir there. When I graduated and moved back to London in 2013, I joined straight away. 

Eventually in 2014 it was time for the founders to move on to other things - including starting new choirs in Berlin and Newcastle! - and I took over as co-organiser, along with another member (who also happens to be a web dev now! It must be contagious). 

Let me tell you: it's a lot of work. I can see how people make it their full-time job and charge for membership, because there is just so much for one or two people to do. We had to make sure we knew what we were teaching and when, what was coming up, who was coming, organise gigs and make sure we had enough singers for each part, and so on.

Nowadays we've moved to more of a collective structure, with teams who look after each function of the choir: music, gigs, facilitation, admin (it me!) etc. Anyone can join those teams to help out with running the choir. It's certainly taken the pressure off!

Around the time I took over, there were a few problems we needed to solve:
- trying to organise anything in a Facebook group was chaos
- nobody knew we existed. There were about 12 of us. 
- Of the few attendees we had, they didn't come regularly. We'd frequently have completely different singers from one week to the next which made it really hard to learn anything 

I'll take you through some of the technological solutions we ended up with &ndash; some which worked better than others. 

## Communication & coordination: Slack
This was 2014, and Slack was this newish communication tool that people were starting to use. I think my husband told me about it and had tried to get his company to use it without much success.  It seemed like it'd be a good match for us, though, so I spun up a workspace and announced we were moving over.

It was definitely hard to get people on board: nobody really knew what Slack was, and it can be frustrating for people to have to learn how to use a new platform. At this time, everyone was on Facebook, so that was just the thing you used, but Slack offered us channels to keep things organised, and better media sharing. 

9 years later, we're still using it and it's been great. We've got channels for each team and each section, we have `#important-announcements` for, well, that, and we spin up a new channel for each gig so that everyone isn't spammed with comms about gigs they're not doing. Party Parrot became an unofficial choir mascot for a time.

As many of you will know, Slack's free tier is pretty restrictive, but we certainly can't afford to pay for it so it's what we have. We could really benefit from the user groups for the different sections of the choir, for example, and it's a massive pain losing our workspace history all the time. Another of our choirs is trying out Discord as an alternative, but the prospect of losing animated emoji is just too much for us...

## Documentation: Notion
Since free Slack hides our posts after 90 days, we need somewhere to keep track of upcoming gigs and all our important documents. Notion seemed like a good choice when we first started using it in 2017, and the Notion team very kindly gave us a Team plan for free as we're a community choir. We've got a homepage with links to everything you might need, plus a template button that generates a page for a new gig with all the sections predefined. 

<figure>
<a href="/img/blog/choir-tech/notion.png" target="_blank"><img src="/img/blog/choir-tech/notion.png" alt="The SHE Choir London Notion homepage with links to all our important documents. There's a section called About SHE, with links to our ethos and history; Teams and Organising, with links to pa page about the teams and a guide to gig planning; Day to day docs, such as FAQ about rehearsals and gigs and warmups; and a list of upcoming gigs."></a>
<figcaption>Those loading spinners bode well</figcaption>
</figure>


The biggest problem with Notion is that it's *so* bloated. It loads so much Javascript that you end up waiting ages for the content to show up, and for our members with older phones sometimes it doesn't work at all. I'm writing this blog post on a train, and as you can see in the photo some of the links are just showing a loading spinner. It's also relatively poor for accessibility &ndash; those "markdown" headers are just styled spans! &ndash; and it's another thing people have to log in to. While it's nice to have everything in one place, I'm keen to find a more lightweight solution.

## The website
In order to solve the problem of "nobody knows we exist", I used my extremely rudimentary knowledge of SEO circa 2012 and built us a keyword-optimised (but not *stuffed*!) website using Wordpress. We registered shechoirlondon.co.uk and I set up a mailbox. I also got us listed on various London events pages and choir directories.

It definitely helped! We started to get enquiries coming through from people who either wanted to join or book us for an event (!) because they'd found us via Google. We were ranking pretty high on Google for "women's choir London" (though these days we no longer call ourselves a women's choir specifically). 

We used Wordpress Networks for a while to support multiple sites, and that worked fairly well, but my web skills at the time were a bit rusty (this was before I got into web development professionally). 

The advantage of Wordpress is that it presents a fairly easy-to-use interface for non-techies to use. But a few years down the line I was fed up with wrestling with FTP clients, and as I started experimenting with newer web technologies and build tools I wanted to try something new. 

I moved us to a Hugo site built on Netlify, with multilingual support for our German choirs. This worked really well, but I kept finding that whenever I came back to the repo to make changes I'd forgotten how Hugo worked. 

It also made it very difficult for non-technical folks to make changes as the site was written in Markdown. In retrospect, this is probably my first encounter with a developer experience decision having a negative impact on user experience...! 

### Now: a multi-choir setup with Contentful
We use Contentful to manage a lot of our content in Monzo, so I figured it'd be a good choice for the choirs. I replatformed the site onto Eleventy and built a series of reusable "components" (JS functions that return HTML strings) which receive data from the Contentful API and render the content in a nice way.

At build time, we get a list of all `Choir` content types from the API, and then create a dataset from those. Each choir then has a page generated with its associated content blocks. 

Using [Every Layout](https://every-layout.dev) as guidance, and inspiration from Andy Bell's talk [Be the browser's mentor, not its micromanager](https://www.youtube.com/watch?v=5uhIiI9Ld5M), I built a brand new site which has a different colour theme for each choir and works effortlessly across different sized screens. Only a couple of breakpoints across the whole application.

![A screenshot of the SHE Choir London website. The title says 'We are SHE Choir London: a collaborative pop choir in the heart of the capital' and then the body text says: 'We're a volunteer-run choir for women, non-binary and genderqueer people based in London. Singing original arrangements of pop, rock, R&B and more, we put our unique spin on favourites from Destiny’s Child to Carly Simon (with a bit of Human League along the way)! If you can sing in the shower, you can sing in SHE Choir.'](/img/blog/choir-tech/shechoircom.png)

While Contentful is definitely easier to make changes to than code for non-devs, it's still a bit confusing how the whole content model works, and I had to write quite a lot of guidance. People have successfully changed stuff without my help, though, so it seems to be working. 

<div class="two-col">

<img alt="Screenshot of the Choir content model in Contentful. It has fields for different bits of information that we use to generate the website: City, Logo, OG Image, Geographical area, Facebook, Twitter, Instagram." src="/img/blog/choir-tech/choir-content-model.png">
<img alt="Screenshot of the Text and Image Section content model in Contentful. This has an internal title, heading, image, body text, image side, and an option to include it in the main menu for the choir." src="/img/blog/choir-tech/text-and-image-content-model.png">
</div>

The free plan is quite restrictive as well, so if we want to add anything like a new locale we'll need to think of another solution. 

## Attendance: automating attendance tracking with the Attendance Bot
The magical thing about SHE Choir is that it's entirely volunteer-run, and free to join. The less magical thing about something that's free to join is that you often don't get the same level of commitment from members, so it becomes quite difficult to learn things well. You'll have a great rehearsal one week, then next week nobody will know the song at all. It's a very frustrating experience, and especially demoralising for the conductor.

We also didn't really know how many active members we had. There were plenty of people in our Slack workspace but who knew if they were actually coming regularly?

We realised we had to start taking attendance. Every week we handed round the attendance sheet which I painstakingly copied into a Google Sheet. It was boring and I hated it. This was 2016, when I was crawling up the wall in my graduate scheme job trying to get opportunities to do more software development, so my budding developer brain zeroed in on an opportunity to be Developer Lazy. Given all of our organisation and coordination was in Slack, why couldn't we take attendance in Slack, too?

And so, the Attendance Bot was born. It's a Slack application built in Node with a full suite of features. I'm taking full advantage of the Slack app platform, with a customisable home screen and interaction flows. It's built on top of Google Firestore, because that seemed like a good idea at the time, and the app itself runs quietly on Google AppEngine and costs me a whopping 8p a month. 

Every day it runs a cron job to see what jobs it needs to do for each choir. For London, it posts in our #rehearsals channel at 9:30am on a Monday morning with a summary of what's happening at rehearsal and asking people to emoji-react if they're coming or not. People can also volunteer for other jobs, like warmups or facilitation. On Thursdays it posts a reminder of what's coming up in the following rehearsal to get people to prepare for what's coming up.

![A Slack post from the SHE Bot. It says: Rehearsal day! @channel We're singing: Bad Romance; Run through: Dancing in the Dark. COVID RULES PLEASE READ Please take a lateral flow test before rehearsal: do not attend, even if fully vaccinated, if you have any symptoms; and let us know if you test positive after having attended rehearsal. Let's all keep each other safe. Please indicate whether or not you can attend tonight by reacting to this message with 👍 (present) or 👎 (absent). To volunteer for physical warmup, respond with 💪. If you want to lead musical warmup, respond with 🎵. Facilitator please respond with 🙌!"](/img/blog/choir-tech/rehearsal-post.png)

Our schedule is a Google Sheet, so the app pulls data from that and shows what songs we're doing that day (and links to the recordings in our Google Drive). 

![A row from the schedule spreadsheet. There are headers for main song, run-through, notes, main song link and run through link.](/img/blog/choir-tech/schedule.png)

The rehearsal message is customisable - you can change the order and which blocks show up. It uses Slack's Block Kit API to control how things are displayed. 

<div class="two-col">
<img src="/img/blog/choir-tech/customise-1.png" alt="A Slack dialog with the title 'Attendance Posts'. It says 'this is where you can compose the parts of the message that will be sent on the day of your rehearsal.' It shows a preview of what each block does, and invites the user to customise the intro message. The preview says: 'Rehearsal day! @channel (with dancing banana emoji)
We're singing: Example Song
Run through: Example Song
Social after rehearsal!
Please indicate whether or not you can attend tonight by reacting to this message with thumbs up (present) or thumbs down (absent).
To volunteer for physical warmup, respond with muscle emoji.
If you want to lead musical warmup, respond with musical note emoji.
Facilitator please respond with raised hands emoji'">
<img src="/img/blog/choir-tech/customise-2.png" alt="The same dialog, but scrolled down to see the input where the user chooses the blocks they want to show in the message. The user has selected Main song, Run through song, Notes, React with emoji if attending/not attending, Volunteer for physical warmup with emoji">
</div>

And my favourite feature: the app caches and checks the [gov.uk Bank Holidays API](https://www.api.gov.uk/gds/bank-holidays/) to detect whether the current day is a bank holiday, and posting a special message if so. (This is also the API that tells you whether bunting is appropriate, but I never got round to doing anything with that.)

![A post from the SHE Bot saying 'it's a bank holiday next Monday, so there's no rehearsal! Have a lovely day off!'](/img/blog/choir-tech/bank-hol.png)

The home screen provides a configuration dashboard, and I built some rudimentary reporting into the app, so I can see who hasn't responded for the last 4 rehearsals. 

![The Home screen of the SHE Bot app. It offers options for configuring rehearsal posts, changing the post channel and rehearsal day, setting Google Sheets ID, viewing attendance reports and excluding members from the reports if they are on hiatus.](/img/blog/choir-tech/app-home.png)

The attendance bot repo is open-source &ndash; you can find it on [GitHub](https://github.com/sophiekoonin/shebot)!