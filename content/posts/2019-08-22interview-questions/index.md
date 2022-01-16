---
title: 'Questions to ask at an engineering interview'
date: 2019-08-22T17:55:34+01:00
tags:
- 'interviews'
- 'advice'
- 'work'
summary: "Tech job interviews are often different flavours of the same thing, regardless of where you apply. Interviewers are likely to ask you questions about your experiences, perhaps a hypothetical question about what you might do in a certain situation, or delve into some of the how-it-works stuff under the hood of whatever programming language you'll be using. However, there's one question that you can *guarantee* will come up: 'Do you have any questions for us?'"
---

{{< img class="inset-image" src="*/silicon-valley-crushed-it.png" alt="A still from the HBO series Silicon Valley in which two interviewers are asking a candidate 'it says here on your resume that from 2010 to 2011, you crushed it?'"  >}}

Tech job interviews are often different flavours of the same thing, regardless of where you apply. Interviewers are likely to ask you questions about your experiences, perhaps a hypothetical question about what you might do in a certain situation, or delve into some of the how-it-works stuff under the hood of whatever programming language you'll be using. However, there's one question that you can _guarantee_ will come up:

> "Do you have any questions for us?"

(At this point you'll probably sigh with relief - internally, at least - as you've reached the end of the interview.)

It might be tempting to just skip over this with a "no, thank you" - maybe the job description gave you enough information for now - but you should always ask **at least one question**. It's a surprisingly important part of the interview. Firstly, it's an opportunity for you to squash any worries you might have, or find out the answers to anything that wasn't quite clear before. Secondly, it's a chance for you to peek into how things _really_ are at Company X before you get too far in and realise you've Made A Huge Mistake. An interview should be as much you interviewing _them_ as it is them interviewing you, as you need to find out whether the company is a good fit for _you_.

Of course, you don't have to wait until the very end of the interview to ask questions - it's great to ask relevant questions throughout (though be careful that you don't end up answering every question with another question)!

## What your questions say about you

This part of the interview is not just for your benefit: the questions you ask tell the interviewer more about you than you might think. For starters, it shows how engaged you are, what your priorities are and the kind of things you value in your role. It's an opportunity to show off your knowledge and experience by asking questions tailored to the work that you're looking for.

How many questions is too many? It depends how much time you've got left, but don't be afraid to turn up with a list. I brought a notebook into mine, and I took notes while they answered.

So, what kind of questions might you ask? Obviously it's a chance for you to get answers to things that weren't clear about the application process or the job itself. You can ask about the kind of learning and development opportunities, or ask the old favourite of "what do you like most about working here"? Don't be afraid to spin questions that the interviewer asked you back around on them, as long as it's relevant and reasonable.

My favourite interview question tactic is to think about things from my previous roles that frustrate you or that you know you don't want to experience again. Asking questions about these things can give you an idea of whether they do things differently at this place, or whether you're walking into the same job all over again. (Alternatively, if there's something you particuarly enjoy about your current role, it's a good way of finding out whether it'll be the same at this new place too.)

I'll give you some questions that I might ask as a starter (and in some cases, what these questions are _really_ asking). I'm not saying you should ask all of these questions - that would probably take all afternoon - but feel free to pick and choose depending on where you're applying and what's important to you. They're here as a starting point.

## The "how does this work here?" questions

These are the questions based on your past experience. It's a great way to understand more about processes at the company, as well as making sure you won't end up working at somewhere that's exactly the same as your last place (unless that's something you want).

### Working in product teams

> How closely do the dev team work with business stakeholders/customers?

Is this a case of "IT vs The Business" or are engineers embedded throughout the company? I've worked in both situations, and it's much nicer being considered a core part of the business rather than a "supporting function" building a product for someone else's business needs. Is there a product manager on the team who represents the needs of the customer? Are there regular demos with relevant stakeholders? Do they do any user testing?

> How does work come in to the team?
>
> How involved are engineers with deciding what to build?

Am I going to be involved in the decision making and the shaping of what we're building or am I going to be blindly picking up JIRA tickets? Is it an iterative development process, or is it a case of "requirements come in, code comes out 6 months later"?

It took a bit of getting used to, but now I love being involved right at the beginning, helping to decide what it is we're going to build and how we're going to build it. It's related to the first question in that it shows that engineering is a core part of the company and not just something that you do to achieve the thing for the business.

> Who makes technical decisions? How much independence do product teams have to make technical decisions?

This question is about autonomy in what you're building. Is it going to be a case of "here is the work, go and do it" or "how shall we build this? What do you think?"

Some degree of uniformity is vital, especially if you're working with lots of microservices. But having strategies for the way you work and the technologies you use is one thing; being told exactly what to do and having no independence or flexibility is another thing entirely.

### Code, deployment and infrastructure

> Who looks after the live applications?

Is it "you build it, you run it" or is it "you build it, and throw it over the wall"? Do engineers have ownership of the apps they build, and are they trusted to look after them?

It's also worth finding out how on-call works, because if that's something that you can accommodate, it's a great opportunity to learn about the tech and how things work.

> What's your deployment process like?
>
> What does an average path to production look like for a service or application?
>
> Do you practice continuous integration?
>
> How often do you release to production?

Can I deploy stuff myself on an ad-hoc basis, or is it once a week/every three months? Is it going to be six months before you let me put it into the wild?

This is about finding out how much friction there is in the path to production. The more obstacles and Process With A Capital P, the more obstacles to innovation and experimentation. _That said_, there is a happy medium, and I don't believe you should be firing off software into prod without due diligence, some process and quality control, especially when you're working with people's data. It's worth finding out how the company handles that delicate balance.

Bonus points for continuous deployment.

> Say I wanted to spin up a new service. How would I do that?

Would I need to get permission from the Change Advisory Board in a distant ivory tower? Would I need to write numerous documents and have handover meetings for deployment and maintenance?

The answer I got in my Monzo interview was "there's a command line script to generate a new service" and I nearly wept with joy.

> How do you do version control?

If they say "Subversion", it's time to question why. Is there a big beast of a monolith that was written in Java 6 and nobody has quite had the guts to move it off SVN because they aren't _quite_ sure where all the code lives, and do you really want to work with that every day?

> How are architectural decisions made?
>
> Do you have an architecture team? What do they do?

Do you have people whose job title is literally "Architect"? If so, are they hands-on and technical, or do they come in and tell you how to build stuff and then leave again? Am I going to be allowed to make my own decisions about the structure of the software I'm building?

I've definitely met some good architects, but really things like solution architecture should be done by the team building the actual thing.

> What's your testing strategy?

Do your developers do any testing? (Conversely, are you obsessed with as high test coverage as possible?) And if there's pretty poor test coverage, are they open to improving it or do they see it as a waste of time?

## The "how is it really?" questions

The questions that help you delve into day-to-day life at the company.

> What does a typical day look like for you?
>
> What are the working hours like here?

Will I be working until 8pm, or can I go to my clay pigeon shooting evening class without getting Meaningful Glances from my colleagues behind their screens?

Perhaps I'm naïve, but I firmly believe in a work-life balance. I was very lucky to have that in my previous job, and I have it in my current job. I don't believe working later makes you a better contributor, as I think the more tired and burned out you get the worse your work is going to be in the long run. I want to know what kind of hours people keep so I can factor it into my decision.

> Are there many parents here?
>
> How does parental leave work here?
>
> What facilities do you have for new parents?

This one is not a question I've asked, as I don't have children and don't plan to have them any time soon, but if you're a parent or at that stage in your life where it's something you're thinking about, you want to know whether it's a parent-friendly workplace, whether there's anywhere to go and breastfeed, and what kind of caregiver leave they offer.

I know that some places can be a bit funny if women of childbearing age ask about this kind of thing in interviews; if that's the case, I would question whether it's really somewhere you want to work.

> What kind of diversity and inclusion initiatives do you have here?

Does the company take diversity and inclusion seriously? Many (if not most) tech companies have traditionally very poor diversity in terms of gender and ethnicity - and often age, too. Trying to hire from a more diverse pool of candidates is one thing, but how are they trying to make things better in order to get people to stay? Are they hiring a diversity and inclusion lead? Do they have groups or networks?

## The "where can I go from here?" questions

> What kind of learning and development opportunities are there for employees?

A good way to find out whether they have a learning budget, or whether you can ask for books/courses/conference tickets.

> Do you ever host meetups or community events?

Perhas not important to everyone, but as someone who owes a lot of my professional development to the community as a whole, it's really important that wherever I work has a good community spirit.

> Do people here ever speak at conferences?

This one is a bit less helpful as (especially if it's a small team) it could be that the employees don't _want_ to speak at a conference, and that's totally fine. But if it's a huge company and nobody really speaks at conferences, it kind of raises the question of whether anyone does anything worth talking about (or, if they are, whether the company isn't keen on letting them talk about it.)

---

I hope this has given you an idea of the kind of questions you might want to ask at an interview, but more importantly, the value you can get from asking them. If you've got any more thoughts or ideas for interview questions, share this on Twitter with the link below and join the conversation!
