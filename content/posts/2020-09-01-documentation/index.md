---
title: 'Teaching Code as a Foreign Language - Part 2: Writing good documentation'
date: '2020-09-01'
draft: true
tags: 
- 'documentation'
- 'core skills'
summary: "Good documentation makes all the difference! Learn the teaching skills that helped me level up my documentation and write like a pro."
---
{{<preamble>}}
This is Part 2 of a two-part series on the skills I learned as an English teacher which made me a better developer. Previously: [Part 1: How to be a great mentor](/2020/09/teaching-code-as-a-foreign-language-part-1-how-to-be-a-great-mentor/)
{{</preamble>}}

## Contents <!-- omit in toc -->
- [Documentation, documentation, documentation](#documentation-documentation-documentation)
- [Web 101](#web-101)
- [Who is the documentation for?](#who-is-the-documentation-for)
- [The importance of register](#the-importance-of-register)
- [Don't assume prior knowledge](#dont-assume-prior-knowledge)
- [Explain technical concepts clearly](#explain-technical-concepts-clearly)
  - [Terrible party game idea: Programming Articulate](#terrible-party-game-idea-programming-articulate)
- [Teaching technique: analogies and stories](#teaching-technique-analogies-and-stories)
  - [Another terrible party game idea: Ridiculous Technical Analogies](#another-terrible-party-game-idea-ridiculous-technical-analogies)
- [The importance of "why"](#the-importance-of-why)
- [No more "simple", no more "just"](#no-more-simple-no-more-just)
- [Web 101: a great success](#web-101-a-great-success)
- [When it's done, it's never done](#when-its-done-its-never-done)
- [Put your writing skills to work!](#put-your-writing-skills-to-work)

## Documentation, documentation, documentation
Ahh, documentation. A developer's best friend. It's often seen as a chore, and may even be skipped entirely, but the power of good documentation shouldn’t be underestimated. Good documentation can be the difference between someone getting their work done efficiently, and having to stop all the time to find someone to answer questions. (Or alternatively, being interrupted constantly throughout the day because there's no documentation for something you're the expert in.)


{{< img class="inset-image" src="*/giphy-api.png" alt="" >}}


I'm not just talking about formal documentation here, either: this includes everything from the humble README through to code comments and even Slack posts. Documentation might be kept in the repo alongside our code, or it might be hosted elsewhere. Maybe you write tutorials and blog posts to share with others. Conference talks and video tutorials count, too - they may not be written media, but they are still used as technical instructions, so the rules definitely apply. 

And just like with [mentoring](/2020/09/teaching-code-as-a-foreign-language-part-1-how-to-be-a-great-mentor/), my documentation-writing skills are a direct result of my past teaching experience.  

## Web 101

A while back I put together a self-guided tutorial as an introduction to web at Monzo, with   contributions from the wider web team. It's basically teaching!

{{< img class="inset-image" src="*/web101-contents.png" alt="The contents of Web 101, split into sections, from development environment setup through to functionality, accessibility, analytics and testing" >}}

As we’re only a small team of web engineers, much of the web work for our internal tooling is done by backend engineers in sponsoring teams. Not all of them are super familiar with how we do web at Monzo, so we needed something to teach them best practices and the basics of things like accessibility and testing. I also wanted to create an onboarding document for new starters in web. So Web 101 was born, to cover both of those bases. It’s been really well received, and a lot of that is down to the way it was written.

Using Web 101 as an example, let me take you through the teaching skills that got me there.



## Who is the documentation for?

Just like with mentoring, our first step is to identify who our learner is - in this case, the reader or consumer of our documentation. Are they complete beginners to programming? Are they experienced developers looking for the query parameters for an API call? Like with Web 101, are they backend engineers who need to do some web work? 

Sometimes you’ll have a real mix, so the challenge is writing documentation that suits everyone’s needs.

In the world of teaching, teachers will assign work for the level of the majority of the class, and have **stretch exercises** for the more advanced students once they’ve finished the work. We can apply this to the technical documentation we write as well. Less experienced engineers will be able to learn at a level that suits them, and more experienced engineers can quite happily skim over the stuff they already know. 

With Web 101, we broke everything up into sections so that a developer starting from the beginning could work all the way through, but someone with a bit more context could pick and choose the section that was most applicable to them. The advantage of this was that it’s also easy to link to particular sections from other documentation, so for example we have the section on developer environment setup linked from various READMEs. 

{{< img class="inset-image" src="*/graphql-web101.png" alt="A section from Web 101 explaining what GraphQL is, with a link that says 'I'm familiar GraphQL, take me to the bit where I can write stuff'" >}}

Similarly, in a section on the basics of GraphQL, we have a link to skip to the actual tutorial work if the reader doesn’t need the primer on what GraphQL actually is. 



## The importance of register

*Register* is a linguistic concept which means a variety of language used for a particular purpose or situation. For example, I would use a more simplified version of English when talking to my class, whereas when I’m writing a blog post I might use words like “whereas”. Often it’s less conscious, for example you might use more slang with your friends or peers than with your manager without even thinking about it. 

{{< figure caption="Monzo's tone of voice" >}}
{{< img class="inset-image" src="*/toneofvoice.png" alt="" >}}
{{</ figure >}}

When it comes to written language, especially in a business context, we tend to talk about tone of voice. This is almost like the register of your writing - how you say what you’re saying. At Monzo we have a very distinctive [friendly tone of voice](https://monzo.com/blog/2018/03/27/tone-of-voice) which is aimed at making sure all our customers can understand things like terms and conditions and weird banking jargon, which there is loads of. Our tone of voice was drafted by our amazing head of writing, Harry Ashbridge, and the article has some great tips for keeping your writing simple and clear. It's worth a read! 

The world of programming is enormous, and people may be reading your documentation from all over the world, with different levels of English. Writing in a clear, concise and informal manner will mean that *everyone* can understand what you’re saying. It's also great for accessibility, as your writing will make sense to people with varying levels of reading ability. 

## Don't assume prior knowledge

When teaching English students, we had to be careful not to assume they already knew the context of what we were learning - especially things that are tied to local culture. For example, there are so many slang words that we use without even thinking, which might seem obvious to use but actually might make zero sense to the learner (especially if we're in the UK, and the student learned their English from US TV). This can end up with the student feeling disheartened. So we taught them slang as a formal lesson because they’d need it in everyday language, but used more common and "standard" terms when communicating in lessons. 

With documentation, assuming too much prior knowledge can have the same effect. You need to make sure your reader has sufficient context and understanding for your documentation to be useful. If you don’t want to spend the time explaining the background knowledge required, put in a section at the beginning outlining what the required background is and add some links to find out more. That way, the reader can prepare themselves for your article. 


{{< img class="inset-image" src="*/usequery-web101.png" alt="" >}}


In Web 101 we take engineers through creating a new view on our internal customer service system, BizOps. We made sure to add a background on what BizOps actually is and how it’s used before getting into the code. We’ve also added explanations for various concepts for whoever needs them, but as **callouts** rather than in the body text of the tutorial so that it’s easy to skip over them if you don’t need it. For example, when we’re guiding the reader through adding a GraphQL query, we explain what React hooks are in a callout before going into the detail of Apollo’s `useQuery` hook. 

I’d recommend getting a less experienced developer than you to read through your documentation to identify anything that they don’t have context on. Then you can expand on things where needed. 


## Explain technical concepts clearly

A great game we used to play with our English students was [Articulate](https://www.drumondpark.com/articulate_cards) - where you are given a word, and you have to explain what it means to your team without using the actual word (and they have to guess). It was a fantastic way for students to practise both their vocabulary, and explaining things - description skills are useful in foreign languages when you can’t remember the word you want to say! I once bought tissues in a pharmacy in Spain by asking for something like “small paper for my nose". 


{{< img class="inset-image" src="*/articulate.png" alt="" >}}


It’s something we had to do as teachers too, because if a student asks what a word means, we can’t use that word to explain it! And we have to explain its meaning in words that the student can understand. 

Being able to describe technical concepts in simple terms is such a useful skill - I really can’t state that enough. A clear explanation can be the difference between someone sitting and banging their head against the desk and feeling stupid, and a lightbulb going off and everything becoming clear. Some concepts are easier to explain than others, but a good explanation can really transform your documentation.

### Terrible party game idea: Programming Articulate

If you want to practise your skills explaining technical concepts, why not put together a list of words and have a game of Programming Articulate with your colleagues? It may sound a bit silly, but it’s actually really good practice for being better communicators. The non-technical folk in your team will be glad for it when you can explain exactly what you’re working on in non-technical terms. 

{{< img class="inset-image" src="*/schema-web101.png" alt="">}}

In Web 101 we could assume a base level of programming knowledge, but things like GraphQL wouldn’t be familiar to everyone so we had to explain them. The tutorial centres around doughnuts and writing a frontend view to manage doughnut purchases, so using this to illustrate what a schema looks like, we explain exactly what queries and mutations are, and what the various constructs in the schema do. Significant words are bolded, and explanations are simple, not too wordy.  

## Teaching technique: analogies and stories

A great way to explain technical concepts simply is to use real-world analogies. We’d use this in the English classroom too, for English words our students didn’t understand - using real-world concepts and stories to model the meanings. For example, you might describe “embarrassed” by describing a series of really embarrassing events as if they happened to you. 

A few years back I worked on a team where I was implementing an OAuth-style authentication flow with refresh tokens, and our product manager wanted to know what it involved - she had no background in tech. So I ended up illustrating it using a ridiculous analogy involving a secret clubhouse.

{{< figure caption="Who keeps refresh tokens up to date? We do." >}}
{{< img class="inset-image" src="*/stonecutters.png" alt="The Stonecutters secret society from the Simpsons." >}}
{{</ figure >}}

You say a password to get in, but then there’s a secret handshake (the access token) you need to speak to anyone. The handshake changes every 5 minutes, and you are given a special badge (the refresh token) that you need to show when you want to learn the new handshake. And when you leave the clubhouse, they take the badge off you, and you get a new one next time you come in. It was silly, but it got the message across.

### Another terrible party game idea: Ridiculous Technical Analogies

Try and come up with some ridiculous analogies for technical concepts - the sillier the better. See if they work on your non-technical friends and family members, as well. If they'll still talk to you after that.

## The importance of "why"

I spoke before about the importance of knowing your reader - understanding their goals and intentions. What you teach them should be relevant for their goals. READMEs and tutorials are a bit easier for this as you know who’s going to be reading them, and for a blog post you can imagine who your target audience might be and write for them. But presenting facts to the reader will only get you so far. 

I would teach my students all sorts, from letter writing to describing injuries. We even had a lesson on the f-word once, with all the ways it can be used in English. The thing is, if the students don’t know *why* they’re learning this, it won’t be nearly as effective. You learn how to write letters so you can write a cover letter for a job or sort out visa things. You may need to make a doctor’s appointment sometime when living abroad, or have a medical emergency on holiday. And living in a foreign country, you’ll hear people swearing, and you’ll need to understand what they’re saying!  

With documentation, explaining *why* will help the reader to understand what they’re doing. Why do we need these environment variables? Why is it bad to give an `onClick` attribute to a div? (answer: it's better to use a semantic `button` element for accessibility reasons!)

Giving the additional context will make things seem clearer to the reader, and make it seem less like magic. 

{{< img class="inset-image" src="*/why-transpile.png" alt="A section of Web 101, which says 'The build script checks for Flow type errors, transpiles our nice fancy syntatic-sugared JavaScript and React code into browser-readable JavaScript using Babel, and bundles it using Webpack.' Followed by a callout that says 'Wondering why we need to transpile JavaScript? Check out this article while you're waiting for the build: JavaScript Transpilers - What they are and why we need them.'" >}}
{{< img class="inset-image" src="*/why-semantic.png" alt="A section of Web 101. A list of semantic HTML tags, followed by the explanation: using these semantic elements builds a map of landmarks on the page, allowing it to understand what each part of the page does and where the important elements are. This means assitive technology like screen readers can jump to the relevant sections and help the user navigate the page." >}}


In Web 101 we made sure to explain things like *why* we have to run a build script when browsers already understand JavaScript (to transpile the React code), or *why* we should be using semantic HTML (accessibility and clarity). It gives that extra bit of background, and especially with the semantic HTML it makes the reader more likely to actually use it in the future.

## No more "simple", no more "just"

Imagine learning a new language - whether that’s a human or programming language - and trying to get your head around a difficult concept. Look at these sentences - examples of what we call [modal verbs](https://learnenglish.britishcouncil.org/english-grammar-reference/modal-verbs) - and imagine trying to get your head around this as a non-native speaker. Three or four verbs in a row! 

* I **could have been doing** it.
* She **couldn't have had** it.

(English is ridiculous.)

Some people find grammar a lot easier than others. I have always been more of a grammar person than a vocabulary person: when learning modal verbs in German at school, for example, I found them fairly logical, but some of my classmates thought they were really confusing. Conversely, I can never for the life of me remember words for things. No two learners are the same.

In one Spanish class I took years ago, I was struggling with understanding something and said it was difficult - the tutor said <span lang="es">"no, mujer, es *fácil*!"</span> ("no, it's *easy*!)". It was horrible, it made me feel bad, and I didn’t learn anything. 


Now imagine looking through the docs for a library you’re using, and being presented with this sentence: 

> Simply synthesize the circuit, then just get to the VGA sensor through the online HDD address 

It makes literally no sense, and yes that’s because it is literally complete nonsense, but for someone reading a technical document about something they’re not familiar with, what you’ve written might seem like this too. What seems simple to you won’t be simple to everyone.

For that reason, we **don’t use the words “simply” or “just”** or anything like that in Web 101. All it does is make people feel bad about their own abilities if it doesn’t seem simple to them. Ban it from your documentation, regardless of how easy you think it is. 


## Web 101: a great success

We got some great feedback on Web 101, largely down to the consistent, clear writing style, the background information and the thorough explanations we wrote.  Here's a quote from a Monzo colleague:

> “I just wrote a brand new bit of code following the guidance there and it just worked 🤯 (I find this happens very rarely in engineering, and is testament to the quality of the docs)”

## When it's done, it's never done

One thing that is important to remember about documentation is that it **should be living**. Just as you never really stop learning a language (even for native speakers!), your documentation should evolve and grow with your system and organisation. I like to joke that code becomes legacy code as soon as it's committed - but really the same is true for documentation. 

One way of tackling the problem of constant updates is by asking the people reading the documentation to keep it up-to-date. We use Notion for our documentation, so readers can either leave comments on the doc, or edit it themselves. We've found this works pretty well.

## Put your writing skills to work! 

With Hacktoberfest coming up, it's a great opportunity to contribute some documentation to open source projects. Have a look through the [GitHub issues labelled with "documentation" and "good first issue"](https://github.com/issues?q=is%3Aopen+is%3Aissue+label%3Adocumentation+label%3A%22good+first+issue%22+) and pick something up. 

Alternatively, you could create your own Web 101-style onboarding document/self-guided tutorial for your team or organisation. Try it out with a group of beta testers, and iterate. 

Create your own platform: start a blog! Blogs are cool again, don'tcha know. There are some excellent static site generators out there (I use [Hugo](https://gohugo.io)) and I'm sure you have at least two domain names you bought on a whim and don't know what to do with. Or, write an article for [DEV.to](https://dev.to) if you don't want to host your own.

What are you waiting for? Get writing! 
