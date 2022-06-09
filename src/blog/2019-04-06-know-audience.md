---
title: Why software engineers should know their audience
date: 2019-04-06
tags: 
- 'engineering'
- 'work'
- 'communication'
- 'teams'
---

When you're talking about what you're working on, do you ever stop to think about what you're saying and whether the person you're talking to can actually understand it?

<!--more-->

There's more to being a software engineer than coding. What people often underestimate are the so-called "soft skills" (the worst term for something that's really vital) - the way that you interact with others around you. In particular, how you communicate what you're doing to people with different skillsets.

Imagine you're in a standup and someone gives this update:

> I'll synthesize the haptic DDR3 network, that should shut down the SDD capacitor!

This came straight from the brilliant [Hollywood Jargon Generator](http://shinytoylabs.com/jargon/), but to anyone who doesn't have as much technical experience as you, that might as well have been what you just said. 


## u wot m8

One of the best pieces of advice I ever got was from a tech lead who took all of the engineers aside after a standup where we'd been discussing how we were getting on with the new authentication flow we were writing. She told us to make sure we didn't go into too much technical detail in the standup, so that everyone could understand it. Sounds so simple, right?

We'd just spent ten minutes with the rest of the team - including our product manager and the marketing lead - and we'd been talking about refresh tokens and token expiry. It had meant absolutely nothing to several of the people there. The more we mentioned these arcane technical concepts, the less the rest of the team wanted to come along to standups because they felt it was irrelevant or above them in some way. 

"But it's a standup!" I hear you cry. "You're only meant to give a quick high-level update anyway!"

You'd be surprised how easy it is to start talking in jargon without even realising for even the smallest of updates. Next time you give a standup update, ask yourself: if I weren't technical, would I know what I was talking about?

!["Two characters are talking. Left: What've you been up to? Right: Doing tons of math for my thesis. Left: Can you explain it like I'm five? Right: Oh my God, where are your parents?"](/img/blog/xkcd-eli5.png "source: xkcd")

How much technical detail do you really need to go into? If your standup tends to be "here's what I did yesterday and here's what I'm doing today", do you need to say:

>We're still trying to get the auth service to store the user's refresh token in the database and check it against the incoming requests.

or can you just say

> We're still trying to get authentication working in the backend.

To you the first example might look pretty easy to understand, but that's probably because you're an engineer. You know what a refresh token is. You know what a request is in this context. Non-technical folk probably knows what a database is, and what authentication is, but that's about it, and they've switched off by the end of the sentence. By keeping the technical detail to a minimum you'll be providing an update that the rest of the team understand, so they know what everyone's working on. 

What about if there's a particular technical thing that's blocking you that you wanted to mention in standup? Either mention that you're generally blocked in the update and approach one of your fellow engineers afterwards, or maybe have a 5-minute dev-only standup after the main team standup where you can go into more technical detail.

Here's another example:

> Some of our ElasticSearch nodes went down last night, it turns out we are still using the old cluster so we're going to migrate to the new cluster today.

vs.

> Our search system went down last night, it turns out we're using an old server* so we're going to move it to the newer one today.

\* I know this isn't technically the same thing, but to someone who doesn't know what a cluster is, it literally doesn't matter. You can go into more detail in the relevant dev standup/slack channel/coffee break.

## Use real-world analogies 

Keeping your language simple works for technical people too. If you're mentoring another engineer or helping someone work through a problem, being able to explain technical concepts in an easy-to-understand way and relating them to tangible concepts in the real world can really help others to learn from you. You'll find it a useful skill for giving talks - there's a real difference between "show me how" and "make me understand". For example, in a talk about [redux-saga](https://redux-saga.js.org) I used pictures of dogs to illustrate the library of effects it provides. In pretty much every object-oriented programming language tutorial there is some kind of `Person` or `Car` class to help you understand the concept of an object, and the tutorials about composition and inheritance usually talk about different species of animals.

With the auth token example, I told my team a story about a secret members' club involving an ever-changing secret handshake and a badge that let you learn the new secret handshake, which went down well and helped the others to get what we were trying to do, even though my product manager thought I was talking about a sex club. 

## Yeah, so we really need to reticulate the splines in our codebase

It's not just standups where this skill comes in handy: in your day-to-day role, explaining technical things clearly and simply might be the thing that convinces them why you should take a break from delivering new features to go back and tackle the mountain of tech debt that's been piling up:

> We need to upgrade a lot of the packages, check for security vulnerabilities and replace a lot of deprecated code.

What does "deprecated" mean? What are packages in this context?

> We've got some old code that needs updating because soon it won't work any more, and it might pose a security risk.

It sounds so basic, but to a non-engineer, that's all they need to know. They might ask some questions about what kind of risk it poses, or what "won't work any more" means, but it's a lot easier to follow. 

## Challenge yourself to keep it simple

It's not always easy to translate the hard stuff in easy terms, especially when you're working on things that involve kubernetes (true story). I still haven't found a good layman's explanation for what Docker does. But next time you're in a standup, listen carefully to what your fellow engineers say and then catch up with your other team members afterwards to ask if they followed everything. If they say yes, then you're fine, and you can just carry on as you were. But if they say no, consider getting your team to challenge themselves to deliver very simple standup for a a week. Make up ridiculous stories to illustrate migrating ElasticSearch clusters. At the end, ask those same people whether they feel like they know more about what you've been up to.

And if all else fails, there's my old favourite fallback:

> Everything's slightly broken, but I'm working on making it not broken.
