---
title: Stop generating, start thinking  
date: 2026-02-08
tags: ["ai", "engineering"]
excerptText: "Instead of wanting to learn and improve as humans, and build better software, we’ve outsourced our mistakes to an unthinking algorithm."
---

Throughout my career, I feel like I’ve done a pretty decent job of staying top of new developments in the industry: attending conferences, following (and later befriending!) some of the very smart people writing the specs, being the one sharing news on Slack about exciting new features of CSS or JS with my colleagues. The joys of working on an internal tool where you only need to worry about latest Chrome, and playing with anchor positioning in a production app while it’s still experimental!

It’s very unsettling, then, to find myself feeling like I’m in danger of being left behind - like I’m missing something. As much as I don’t like it, so many people have started going so hard on LLM-generated code in a way that I just can’t wrap my head around. 

I’ve been using Copilot - and more recently Claude - as a sort of [“spicy autocomplete”](https://www.theguardian.com/us-news/ng-interactive/2026/jan/18/tech-ai-bubble-burst-reverse-centaur) and occasional debugging assistant for some time, but any time I try to get it to do anything remotely clever, it completely shits the bed. Don’t get me wrong, I know that a large part of this is me holding it wrong, but I find it hard to justify the value of investing so much of my time perfecting the art of asking a machine to write what I could do perfectly well in less time than it takes to hone the prompt. 

You’ve got to give it enough context - but not too much or it gets overloaded. You’re supposed to craft lengthy prompts that massage the AI assistant’s apparently fragile ego by telling it “you are an expert in distributed systems” as if it were an insecure, mediocre software developer.

Or I could just write the damn code in less time than all of this takes to get working.

As I see more and more people generating code instead of writing it, I find myself wondering why engineers are so ready and willing to do away with one of the good bits of our jobs (coding) and leave themselves with the boring bit (reviews). 

Perhaps people enjoy writing roleplay instructions for computers, I don’t know. But I find it dangerous that people will willingly - and proudly - pump their products full of generated code. 

I’ll share a couple of the arguments I’ve encountered when I’ve expressed concern about this.

## “This is the Industrial Revolution of our time! It’s like mechanisation all over again.”

Yes, this is true in many ways.

Firstly, when you consider how much the Industrial Revolution [contributed to climate change](https://www.oerproject.com/OER-Materials/OER-Media/HTML-Articles/Climate/Unit1/The-Industrial-Revolution-and-Climate-Change), and look at the [energy consumption](https://www.iea.org/reports/energy-and-ai/energy-demand-from-ai) of the data centres powering AI software, it’s easy to see parallels there. Granted, not all of this electricity is fossil-fuel-powered, so that’s some improvement on the Industrial Revolution, but we’re still wasting enormous amounts of resources generating pictures of [shrimp Jesus](https://www.businessinsider.com/meta-facebook-ban-ai-slop-images-shrimp-jesus-why-2024-6).

Mechanisation made goods cheaper and more widely available, but at the cost of quality: it’s been a race to the bottom since the late 19th century and now we have websites like SHEIN where you can buy a highly flammable pair of trousers for less than a cup of coffee. Mechanisation led to a decline in skilled labour, made worse by companies gradually offshoring their factories to less economically developed countries where they could take advantage of poorly-paid workers with fewer rights, and make even more money. 

Generated code is rather a lot like fast fashion: it looks all right at first glance but it doesn’t hold up over time, and when you look closer it’s full of holes. Just like fast fashion, it’s often [ripped off other people’s designs](https://www.sundaypost.com/fp/our-designer-fear-small-firms-alarm-at-impact-of-high-street-copy-cats/). And it’s a scourge on the environment. 

But there’s a key difference. Mechanisation involved replacing human effort in the manufacturing processes with machinery that could do the same job. It’s the equivalent of a codemod or a script that generates boilerplate code. The key thing is that it *produces the same results each time*. And if something went wrong, humans would be able to peer inside the machine and figure out what went wrong. 

LLM output is **non-deterministic**, and the inner workings opaque. There’s no utility in a mechanised process that spits out something different every time, often peppered with hallucinations.  

## “LLMs are just another layer of abstraction, like higher level programming languages were to assembly.”

It’s true that writing Java or Go means I never had to bother learning assembly. The closest I get to anything resembling assembly is knitting patterns. 

The way that we write software has evolved in terms of what we need to think about (depending on your language of choice): I don't have to think about garbage collection or memory allocation because the runtime does it for me. But I do still have to think about writing efficient code that makes sense architecturally in the wider context of our existing systems. I have to think about how the software I'm building will affect critical paths, and reason about maintainability versus speed of delivery. When building for the web, we have to think about browser support, accessibility, security, performance. 

Where I've seen LLMs do the most damage is where engineers outsource the *thinking* that should go into software development. LLMs can't reason about what the system architecture should be because *they cannot reason*. They do not think. So if we're not thinking and they're not thinking that means nobody is thinking. Nothing good can come from software nobody has thought about.

In the wake of the [Horizon scandal](https://en.wikipedia.org/wiki/British_Post_Office_scandal), where innocent Post Office staff went to prison because of bugs in Post Office software that led management to think they’d been stealing money, we need to be thinking about our software more than ever: we need *accountability* in our software.

Thirteen people killed themselves as a direct result of those bugs in that Post Office software, by the way.

### Our terrible code is the problem
But, you may argue, human developers today write inaccessible, unperformant, JavaScript-heavy code! What's the difference?

Yes, *exactly* (or should I say “You’re absolutely right”?). LLMs are trained (without our explicit consent) on all our shitty code, and we've taught them that that's what they should be outputting. They are doomed to repeat humans’ mistakes, then be trained on the shitty reconstituted mistakes made by other LLMs in what’s (brilliantly) been called [human centipede epistemology](https://maggieappleton.com/ai-dark-forest#2-be-original-critical-and-sophisticated). We don't write good enough code as humans to deserve something that writes the same stuff faster.

And if you think we’ve done all right so far, we haven't: just ask anyone who uses assistive technology, or lives in a country with terrible Internet connection (or tries to get online on mobile data in any UK city, to be honest). Ask anyone who's being racially discriminated against by facial recognition software or even a hand dryer. Ask the Post Office staff.

Instead of wanting to learn and improve as humans, and build better software, we’ve outsourced our mistakes to an unthinking algorithm.

### Four eyes good, two eyes bad

Jessica Rose and Eda Eren gave a [brilliant talk](https://2025.ffconf.org/jessica-eda) at FFConf last year about the danger of AI coding assistants making us lose our skills. There was one slide in particular that stood out to me: 

![Jess and Eda on stage at FFConf in front of a slide that says "Code you did not write is code you do not understand.
You cannot maintain code you do not understand."](/img/blog/code-you-did-not-write.jpg)

The difference between reviewing a PR written by human and one by an LLM is that there's a certain amount of trust in a PR by a colleague, especially one that I know. The PR has been reasoned about: someone has thought about this code. There are exceptions to every rule, yes: but I'd expect manager intervention for somebody constantly raising bad PRs. 

Open source maintainers will tell you about the deluge of poor quality generated PRs they're seeing nowadays. As a contributor to any repository, you are accountable for the code you commit, even if it was generated by an LLM. The reviewer also holds some accountability, but you’ve still got two pairs of eyes on the change.


I’ve seen social media posts from companies showing off that they’re using e.g. Claude to generate PRs for small changes by just chatting to the agent on Slack. Claude auto-generates the code, then creates the PR. At that point accountability sits solely with the reviewer. Unless you set up particularly strict rules, one person can ask Claude to do something and then approve that PR: we’ve lost one of those pairs of eyes, and there's less shared context in the team as a result.

Reviewing PR isn't just about checking for bugs: it’s about sharing understanding of the code and the changes. Many companies don't do PRs at all and commit directly to the main branch, but the only way I've personally seen that work consistently at scale is if engineers are pairing constantly. That way you still have shared context about changes going in. 

## I'm not anti-progress, I'm anti-hype

I think it’s important to highlight at this stage that I am not, in fact, “anti-LLM”. I’m anti-the branding of it as “artificial intelligence”, because it’s not *intelligent*. It’s a form of machine learning. “Generative AI” is just a very good Markov chain that people expect far too much from. 

I don’t even begrudge people using generative AI to generate prototypes. If you need to just quickly chuck together a wireframe or an interactive demo, it makes a lot of sense. My worry is more around people thinking they can “vibe code” their way to production-ready software, or hand off the actual thinking behind the coding. 

Mikayla Maki had a [particularly good take](https://zed.dev/blog/on-programming-with-agents) on working with agents: keep the human in the loop, treat them like an external contributor you don’t trust. Only use agents for tasks you already know how to do, because it’s vital that you understand it.

I will continue using my spicy autocomplete, but I’m not outsourcing my thinking any time soon. Stop generating, start understanding, and remember what we enjoyed about doing this in the first place.
