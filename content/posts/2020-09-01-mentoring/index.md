---
title: 'Mentoring like a teacher: '
date: '2020-09-01'
draft: true
tags: ['mentoring', 'core skills']
summary: "Learn the teaching skills that taught me how to be a great mentor, whether you're onboarding a new hire, pairing with a junior developer or teaching a workshop."
---

## Contents <!-- omit in toc -->

- [What constitutes mentoring?](#what-constitutes-mentoring)
- [Knowing your mentee](#knowing-your-mentee)
  - [Understand their goals](#understand-their-goals)
  - [Learn how they learn best](#learn-how-they-learn-best)
  - [Making the most of learning resources](#making-the-most-of-learning-resources)
- [Building skills](#building-skills)
- [Mentoring through pair programming](#mentoring-through-pair-programming)
  - [When they've got the keyboard](#when-theyve-got-the-keyboard)
  - [When you've got the keyboard](#when-youve-got-the-keyboard)
- [Teaching technique: eliciting](#teaching-technique-eliciting)
- [How to get started with mentoring](#how-to-get-started-with-mentoring)
  - [Coding workshops](#coding-workshops)
  - [In your organisation](#in-your-organisation)

## What constitutes mentoring?

Mentoring can take many forms: it can be a formal arrangement between you and a mentee, or it can be something a bit more transient such as onboarding someone new into the team. Perhaps you're pairing up with a more junior developer to help them learn the skills they need to progress, or maybe you're attending [Codebar](https://codebar.io) sessions to help someone out now and then.

{{< figure caption="Node Girls workshop at Red Badger, 2018" >}}
{{< img class="inset-image" src="*/nodegirls-redbadger.png" alt="" >}}
{{</ figure >}}

Regardless of how much knowledge and experience you have, mentoring can be very challenging. It's a big task to get information out of your brain into someone else's, and it's not necessarily as simple as "you talk, they listen". Think about everything that we do as developers - everything that's involved with building websites and apps. It's easy to imagine that it's pretty overwhelming for mentors to even know where to start, let alone the people they're mentoring.

Leaving the onus on yourself as the mentor to come up with everything can be pretty exhausting, and make you enjoy the mentoring experience much less. It's important to let your mentee guide you - after all, it's a two-way relationship, and you need to know why your mentee is there in the first place.

## Knowing your mentee

### Understand their goals

For my English students, there were a few reasons they would be having lessons. Some of them wanted to become fluent, and some needed to take IELTS, an English language qualification in order to get into a university or for work. Some were just looking to improve their conversational English so they could get by on holiday. These goals influence the kind of thing they needed to learn, as well as their approach to learning, and even their enthusiasm for the course.

It's the same for your mentee. Why are they learning to code? Why have you been asked to mentor them? In our world it’s not as simple as, say, fluency vs conversational JavaScript, but there could be any number of reasons and it’s really important that you know what those are from the outset. It might be obvious and you don’t need to explicitly discuss it, for example when you’re onboarding someone into the team. In a more formal relationship such as with a more junior developer you should discuss their learning goals and identify the areas they want to improve.

Just as I wouldn’t teach someone learning conversational English how to write an academic essay, you don’t want to confuse someone who wants to build a simple static webpage by teaching them bubble sort or how to use service workers. Knowing what their goals are will help you narrow down those topics. You don’t need to write an entire lesson plan or structure some kind of curriculum, but it helps to make a list of the kind of things you think you should cover.

### Learn how they learn best

As well as knowing what the end goal of the learner is, it also helps to know how they learn best - that is, what techniques are most effective when they’re learning something new.

Look at the different resources available to a learner and find out from them which is the most effective - plus, students tend to learn better from a **variety of media** rather than all the same. Think back to when you last learnt a language - there would have been reading exercises, conversation in pairs, listening exercises and even songs. In the classroom setting you can’t cater for individual learning styles necessarily, but you can provide a wide variety of resources so that everyone’s needs are met.

When it comes to developers, some will read a lot of books and blog posts, whereas others will prefer video tutorials and diagrams. Others will want to get stuck in, coding and mapping things out. Some people will mix and match these - I know for myself I tend to learn best by doing, so I prefer to get stuck in, and I also read a lot of blog posts - but I haven’t successfully made it through an entire book about programming.

Ask your learner what their preferred methods are, and maybe you can point them in the direction of some materials that will help them. Maybe they’d benefit from watching a video or conference talk before tackling any code, or maybe you want to give them some smaller JIRA tickets to work on where they can see how they get on and ask you if they get stuck.

### Making the most of learning resources

And if you’re leading a workshop or teaching a group, you’ll want to **mix and match** some of these formats. A lot of your sessions are likely to be very hands-on coding time, but you might punctuate this with mentors pairing with students, or getting students to demonstrate what they’ve done and explaining how they’ve done it. Many students will benefit from teaching things themselves, as it can be a great way to consolidate learning.

{{< figure caption="What's your preferred way of learning?" >}}
{{< img class="inset-image" src="*/learning-resources.png" alt="Various different learning resources, such as videos, books, articles and pairing" >}}
{{</ figure >}}

Provide some **resources for further reading** on the topics you’re teaching for students to read in their own time - granted many of them probably won’t, but some will. Make sure you include videos as well as reading material.

And if you’re recording a tutorial or video, **provide a transcript** so that people who prefer to read can get the information you’re giving in a way that suits them - plus, it’s a nice accessibility win for people who have difficulties watching video or listening to audio.

## Building skills

If you’re teaching someone to speak English, you’re not going to sit them down right at the start and ask them to write an essay. You give them short exercises to do - some sentences, later a paragraph, then maybe a page once they’re confident enough. You don’t ask them to get up in front of the class and give a monologue until they’re able to produce simple sentences.

With a programmer who’s looking to build up their skills and take on more advanced work, it’s the same. As a senior developer and a now a tech lead I need to make sure more junior developers have the opportunities they need to build on the skills they want to improve. So the first thing I do is find out what those skills are - by asking them! - and then having a look through the tickets we’ve got prioritised to see what would give them the **right amount of stretch** without completely overwhelming them. Make sure they know you are on hand to unblock them if they get stuck, and if they are taking a really long time, it may be time to intervene and help out if it’s affecting the team’s progress. **Don’t let them struggle on their own**.

{{< figure caption="CodeWars has some great kata" >}}
{{< img class="inset-image" src="*/codewars-screenshot.png" alt="" >}}
{{</ figure >}}

For newcomers to programming, short coding exercises (often called **kata**) are really helpful. They introduce you to basic concepts one at a time, allowing you to put them into practice before moving on. Think about it: English students can learn a list of vocab, but it’s pretty meaningless until you know how to use them in a sentence and you’ve actually produced the sentence yourself. The same goes for learning to code: an `if` statement is meaningless until you’ve actually used one and seen the outcome.

## Mentoring through pair programming

Arguably one of the best ways to build skills as a developer is **pair programming**. Pairing is a hands-on activity, but is much better for sharing context, getting developers used to more idiomatic programming and learning the way you do things in your team or organisation.

It reminds me of the language exchange partnerships I used to see in the school I trained at: you'd meet up with a speaker of, say, Spanish, and spend half the meeting talking in English (so they can practise) and then half the meeting speaking Spanish (so you can practise). You both get something out of it, and it's a lot of fun!

I find pairing similarly beneficial, in that you can learn a lot from your pair, and they can learn a lot from you.

I’ve worked on teams where we paired on everything as a matter of course, and I’ve worked on teams where we mostly worked solo but paired on things when we’re stuck. I personally prefer the latter, but for bringing a new team member or junior developer up to speed, it’s invaluable.

You might pair by taking turns to write a test and make it pass, or you might time the turns to make sure everyone gets a fair go.

### When they've got the keyboard

When your mentee has control of the keyboard, encourage them to **explain what they’re doing**. That’s not to say they should narrate every single thing they type, but this will help you to understand whether they’re on the right track, as well as helping them to cement their own knowledge of what they're doing.

Make sure you **know what they want feedback on**, so that you can pay extra attention to it while they're coding.

**Let them make mistakes**. This is really important! Even if you can see they've written something that won't work, don’t correct the code before the error shows up - the compiler or the output will let them know something is wrong. Let them try and debug it themselves - you’re there if they need a nudge in the right direction, but try not to tell them exactly what’s wrong unless they ask you.

Imagine you were telling a story in a foreign language and your teacher kept interrupting you to correct you - it’d put you right off your train of thought.

We all have house styles and preferred ways of doing things, but don’t sit there and nitpick their code because it will be very offputting. If what they’re doing gets the job done, that’s fine - you can always go through it together afterwards and look at ways of improving it and refactoring it.

And if you can, get them to **pair with other developers** on the team to give them a different point of view. They’ll learn how others do it, and you might even learn something from them next time.

### When you've got the keyboard

Act natural!

When teaching English students, I couldn’t chat away at my normal pace to the beginner and intermediate students, as they wouldn’t understand what I was saying. And the same goes for me - I speak passable Spanish, but I really struggle to understand normal spoken Spanish as I find it very fast. When you’ve got the keyboard, take care not to zoom ahead too fast unless it’s clear the other person can keep up. If you’re a super speedy programmer whose brain can’t keep up with your fingers, you’ll need to **pace yourself** a bit.

But conversely, you shouldn’t go too slowly. We were taught in teacher training not to speak... super... slowly... because it’s not natural and doesn’t help students to understand English as it's really spoken. Coding really slowly on purpose will be frustrating for the person you’re pairing with, and it can interrupt the flow of work. Plus, if you go _too_ slowly, it’ll just seem patronising. **Asking for feedback** about how they’re finding it will help you to pace yourself effectively.

When you’re writing code, try to **explain what you’re doing**. Sitting in silence as a pair writes code isn’t particularly interesting - and your explanation will help your pair understand why you’re doing what you’re doing.

And **don’t keep all the hard problems for yourself** - even if it seems like you’re doing them a favour. If you end up with a tricky bit of syntax or a hard problem to solve, let them drive, and work through it together.

## Teaching technique: eliciting

Okay, technically it’s actually a range of techniques, but eliciting involves anything that gets the learner to provide information rather than the teacher telling them. We used it a lot in the classroom to get students interacting in the lesson.

It wasn’t just to make sure they were still listening, although it helped. Eliciting is a way of activating the knowledge the students already have, as well as helping them discover things themselves which makes them more likely to remember it. It’s also really helpful for the teacher to find out what the students already know, and what they need more help with.

In the classroom setting, we might elicit sentences from students by drawing pictures on the board, or asking them questions and asking for examples of things we’re talking about, for example after learning new vocabulary or doing a listening exercise: "What did the first person order in the café?" or "Who is the person in the picture?". With younger groups it’s often better to nominate students to answer the questions, rather than asking ‘does anyone know…?’ Because often that results in complete silence, or the same people answering over and over. Adults are generally a bit more willing to share, and you can just get people to shout out the answer - though this depends on the group.

We can use this technique when mentoring developers as well. For example, when pairing, ask strategic questions to help your pair debug a particularly tricky error or to find the syntax they can’t remember: "Where did we define that variable?" "What's the value of `myVar` on line 22?"

I found this technique worked especially well when **mentoring kids** - for example, in sessions where they were building a web page according to instructions on a worksheet, it engaged them a lot more when they had the opportunity to think creatively about what they could do. I would point to the heading and say “how could we make this a different colour?” - they could look for the colour in the CSS and, with a little help from us, change it to a different one. It really personalised the experience for them.

**Use it appropriately**. Eliciting works best in more formal mentoring contexts, such as coding workshops or pairing with a more junior developer, because you can imagine in a 1:1 meeting your mentee might think you’re being a bit odd if you start asking them a ton of questions. And I wouldn’t necessarily recommend using this technique with an experienced developer you’re onboarding onto a team because it'll probably come across quite patronising. But if the person you’re talking to is there to learn something new, and you’re trying to establish what they know and help them commit stuff to long-term memory, it can be a great help.

**Use it sparingly:** don’t ask questions constantly. It’s unnatural and can throw off the mentee, or make them frustrated if they just want to learn something. If they don’t know the answer, move on, don’t keep asking questions - either ask someone else or tell them the answer. In workshop settings, ask a question now and then to assess the attendees’ prior knowledge, or to consolidate something you’ve just taught. When you’re pairing too many questions from you can disrupt your pair’s concentration on the code, so keep it light. That's why I tend to keep it for situations where we're trying to **solve a problem or debug an error**.

It’s also important to **choose your questions wisely**, and be careful how you ask them. It helps to ask questions that are a little open to interpretation, or don’t have a yes/no answer - students are more likely to answer if they feel like they’re not going to be wrong. That’s obviously easier with English, where there are about 5 ways of saying the same thing, though you could arguably say the same thing for JavaScript these days.

And if they do get the answer wrong, rather than saying “no, that’s not right”, say something like “not quite” or “close” - be encouraging. And if necessary, give a refresher if people really don’t know the answer.

Ultimately, your mileage may vary on this one: it's not a subtle technique, the person you're eliciting from will know exactly what you're doing!

## How to get started with mentoring

I've given you a few things to think about here, and I hope you find them useful. Getting to know your mentee and understanding their motivations will help you teach them what they need to know, and techniques like pairing are great for the more immersive side of learning.

If you'd like to become a mentor, there are plenty of opportunities out there - though most of them are online at the moment.

### Coding workshops

- Become a coach at [Codebar](https://codebar.io) - virtual workshops going on in 2020!
- Teach a [Code First Girls](https://codefirstgirls.org.uk/) course
- Teach kids at a [Coder Dojo](https://zen.coderdojo.com/find)

### In your organisation

- Offer to onboard a new hire
- Help a more junior developer get the skills they need to level up
- Mentor a non-techie who wants to get into development

If you know of a mentoring opportunity I haven't listed here, please tweet at me and I'll add it in!
