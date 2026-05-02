---
title: "Making an original Jubilee line door button into a Hue light switch"
date: 2026-05-02
tags: ["projects"]
excerptText: "An extremely nerdy electronics project"
---

There are many things that make me extremely uncool, but one of my particularly nerdy interests is the London Underground. The evolution of its iconic map, showing long-forgotten stations; old wooden-floor train stock I remember from my childhood; the Hidden London tours of old stations, closed-off platforms and soot-covered stairwells with beautiful original tiling. 

<div class="content-grid">
<figure>
<img src="/img/blog/jubilee-line-button/station-closed.jpeg" alt="">
<figcaption>"Station closed" poster at Aldwych</figcaption>
</figure>
<figure>
<img src="/img/blog/jubilee-line-button/charing-x.jpeg" alt="">
<figcaption>Disused Jubilee line platform at Charing Cross, now used for filming</figcaption>
</figure>
</div>

I wouldn’t say I’m a Train Person per se - it’s the history I love, standing where people would have walked a hundred or more years ago. I think it satisfies the same part of my brain that loves secret passages in video games - something hidden and secret - and exploring long-abandoned buildings to learn about what came before in the Horizon games. 

The [London Transport Museum](https://www.ltmuseum.co.uk/) (worth a visit, EXCELLENT shop) occasionally sells old bits of train and station paraphernalia on its website, including a load of original Jubilee line door button plates a few years back. Imagine my delight when I stumbled upon a [Reddit post](https://www.reddit.com/r/LondonUnderground/comments/f3i98g/my_new_light_switch_i_made_from_a_decommissioned/) by a user called mw83 who turned a Jubilee line door button into a Philips Hue light switch, and wrote an [Instructables tutorial](https://www.instructables.com/Hacking-a-London-Underground-Jubilee-Line-Door-But/) to boot! As it so happened, I was in need of both a Hue light switch for my office and a capital-P Project for my sabbatical, so this seemed like the perfect solution.

(Here I’ll politely gloss over the fact that said sabbatical was in 2024, and I’ve only just finished.)

<div class="content-grid">
<img src="/img/blog/jubilee-line-button/finished-item.jpeg" alt="A wooden box containing a metal panel with a distinctive-looking square button in the middle. The button has an orange ring around it, and the word 'Open' with a pair of chevrons.">
<img src="/img/blog/jubilee-line-button/pressing-button.png" alt="An action shot of my hand pressing the button - the orange ring has lit up.">
</div>

I’d missed the door buttons on the Museum shop, but managed to snag a pair off eBay. They were absolutely filthy - covered in decades of underground grime. 

<figure>
<img src="/img/blog/jubilee-line-button/button-dirty.jpeg" alt="A very grimy metal plate with a button. The button is a square with rounded corners, the plastic ring around the button so dirty it looks black. The button itself has a pair of raised chevrons pointing left, and the word 'Open'.">
<figcaption>You've heard of Left Shark, this is Left Jubilee Line Door Button.</figcaption>
</figure>

## Cleaning up 
The first step was to give them the scrubbing of a lifetime. I disassembled the buttons and got to work with a toothbrush. It took ages and it was boring as shit, but I did get the front plate gleaming. Even after cleaning, the orange glow rings were looking a bit worse for wear, with cracks that had quite a lot of dirt embedded.  

<figure>
<img src="/img/blog/jubilee-line-button/button-taken-apart.jpeg" alt="The disassembled front plate, button and light ring. The dirt is very visible - it's caked all around the button fixture .">
<figcaption>Look at all that grime!</figcaption>
</figure>


<div class="content-grid">
<figure>
<img src="/img/blog/jubilee-line-button/button-opened-up.jpeg" alt="The back of the door button, with the back cover removed to reveal the electronics powering the button. There are large purple wires connecting the back cover to the board.">
<figcaption>Peeking at the electronics</figcaption>
</figure>

<figure>
<img src="/img/blog/jubilee-line-button/cleaned-disassembled.jpeg" alt="The button components and front plate, cleaned and looking very shiny. The button is orange once again, though the orange light ring is still quite dirty">
<figcaption>Good as new (almost)!</figcaption>
</figure>

</div>


## Wiring it up

The next step of the tutorial with the actual electronics was a bit, well, [“draw the rest of the owl”](https://knowyourmeme.com/memes/how-to-draw-an-owl). I had no idea what I was doing and it didn't really go into enough detail to hold my hand through it. Ultimately I hadn’t done much in the way of electronics since GCSE Physics 20 years ago - growing up I’d always resented that the boys’ school across the road got electronics classes, while the girls’ school did Textiles (though I do also love sewing, so it wasn’t all bad). So I had to go back to square one a little bit - studying the basics of building circuits to understand how I needed to get this thing wired up. I had an old Arduino in a drawer that I used as a starting point but had no idea how to make it do things. I stuck it into a breadboard and learned how to make button presses register using one of the Arduino tutorials.

<img  src="/img/blog/jubilee-line-button/prototyping.jpeg" alt="An Arduino microcontroller connected to the button with some crocodile clips via a prototyping breadboard. There's a resistor and various wires plugged into the breadboard.">

## Programming the microcontroller

The author used an ESP32 microcontroller, so that's what I used.

The tutorial included a link to the author’s [Github repo](https://github.com/mnkii/esp32-philips-hue-button) with the code he used, so I forked it and set it up with my Hue system. You can [see my fork on GitHub](https://github.com/sophiekoonin/esp32-philips-hue-button).

I started by using the Arduino IDE, but by the end of the project I'd graduated to using VSCode with [platformio](https://platformio.org/) to flash the controller. In the time-honoured tradition of debugging with `console.log`, I got it to record button presses to the serial output so I could check whether the presses were actually being picked up. 

I had to get an API key for the Hue bridge using the [instructions](https://developers.meethue.com/develop/get-started-2/) on the Hue developer website - you have to log into the bridge via your local network, and make requests to the bridge's API. I plugged the API key it gave me into the config in the code, and also got the IDs of the scenes and lights I wanted to target.

<figure>
<img src="/img/blog/jubilee-line-button/testing.jpeg" alt="A Macbook is open next to the breadboard with the ESP32 connected via wires. The Macbook shows the Arduino IDE with the Hue switch code.">
<figcaption>Getting the prototype working with the ESP32</figcaption>
</figure>

## Replacing the LEDs

The original LEDs wired into the panel need a lot of power, and can’t be powered off the same circuit as the microcontroller - I needed a separate 9V battery as well as a transistor to amplify the signal from the Arduino. Again, needed to do a fair bit of learning here. The tutorial named a type of transistor called a MOSFET, so I ordered one of those and stuck it into my breadboard. (Shout out to [Kara](https://ghost.computer) for letting me bombard her with a million questions.)  

<img class="small" src="/img/blog/jubilee-line-button/mosfet.jpeg" alt="A top-down photograph of the circuit setup on the breadboard, as described in the paragraph that follows.">

The left prong of the MOSFET (the gate) connects to the pin for the button on the ESP32, with a resistor in the middle; the middle prong (drain) goes to the button's negative wire; the rightmost prong (source) goes to ground. The current flows between the drain and the source, and the gate varies the voltage. There's [a good explainer on MOSFETs](https://theengineeringmindset.com/how-mosfets-work/) on The Engineering Mindset. **There are likely some resistors missing in this picture** - this is not what went into the final thing!

Some of the comments on the Instructables page had mentioned replacing the original LEDs with a modern LED strip so you don't have to use a battery, and 3D printing a replacement orange ring which they had helpfully uploaded the model file for. The comments didn’t mention how to set up the LED strip, so I had to figure that bit out.

Interestingly, this is something I found Claude quite useful for: quizzing it about my setup and how I should integrate an LED strip. As someone with no Arduino experience, very little electronics experience but lots of programming knowledge, it was actually great to understand more about what I needed to do. I fed it the code for the button, the existing LED code, and the tutorial I was using. It told me about the FastLED library and recommended a type of LED strip I should be using which did indeed work a treat.

This approach allowed me to ditch the transistor and battery altogether: the LEDs draw much less power so they could be powered off the microcontroller. I got some translucent orange PLA+ and 3D printed the new version of the ring, which has a channel inside to house the LED strip. The solder points on the LED strip were tiny as it was such a narrow strip, so I had to leave quite a bit of slack to avoid putting too much strain on the join and causing the solder to peel off. 


<figure>
<img src="/img/blog/jubilee-line-button/3d-printed-ring.jpeg" alt="A deconstructed view of the button: the orange 3D printed ring in its setting on the metal panel, with an LED strip inside the channel that runs around the edge. The LED strip is wired into the prototype board and sits next to the button panel which is also wired into the prototype board.">
<figcaption>The LED strip was too short in this photo - it got bent at the join, and the solder peeled off. It didn't switch on after this photo was taken.</figcaption>
</figure>


 For the board, I used an [Adafruit Perma-Proto](https://www.adafruit.com/product/1609), which looks like a tiny breadboard that you can actually solder stuff to. (My soldering is fucking dreadful, so you’re not getting any close-ups of that.)

<img class="small" src="/img/blog/jubilee-line-button/finished-insides.jpeg" alt="The inside of the finished switch, with everything soldered onto a much smaller prototype board. The battery is gone. There is a narrow LED strip coming out from behind the button.">

Finally, my husband made a lovely wooden case for it. I also had to glue-gun a piece of wood between the board and the front plate to avoid it shorting. 

And now I have a fancy light switch! It can power the lights on and off, long-press to change brightness, and double-press to change scene. All powered by USB, no batteries necessary. 

<video controls>
<source src="/img/jubilee-button/demo.webm" type="video/webm">
<source src="/img/jubilee-button/demo.mp4" type="video/mp4">
A video showing me pressing the button to turn a Philips Hue Go on ond off. First I press it once to turn on the lights, then I double-press it several times to cycle through different scenes. The light changes colour to pink, then a warm yellow. Then I hold the button to dim the light, and finally press it again to turn it off.
</video>

## Acknowledgements

A big old thanks to the original author of the [tutorial](https://www.instructables.com/Hacking-a-London-Underground-Jubilee-Line-Door-But/), mw83 aka [banjowise](https://www.instructables.com/member/banjowise/), and [pneuteboom](https://www.instructables.com/member/pneuteboom/) who uploaded the STL file for the 3D printed orange ring in the comments of that post!