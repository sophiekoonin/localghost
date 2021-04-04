---
title: "Building a piano with JavaScript"
subtitle: "Making music with the Web Audio API"
summary: "How I built a tiny virtual synthesiser using the JS Web Audio API, and some bonus musical theory to boot."
date: "2021-04-04"
draft: true
tags: ['music', 'web audio api', 'react']
---

- [Background](#background)
- [The Virtual Piano](#the-virtual-piano)
  - [How sound works: relevant science bit](#how-sound-works-relevant-science-bit)
  - [Useful musical terms: relevant words bit](#useful-musical-terms-relevant-words-bit)
- [Building the piano](#building-the-piano)
  - [Getting started: the `AudioContext`](#getting-started-the-audiocontext)
  - [The waveform](#the-waveform)
  - [The oscillator](#the-oscillator)
  - [Calculating different frequencies](#calculating-different-frequencies)
  - [Generating octaves](#generating-octaves)
  - [Generating scales](#generating-scales)
  - [Building the piano UI](#building-the-piano-ui)
  - [Playing the notes](#playing-the-notes)
  - [Playing a scale](#playing-a-scale)
- [Inevitable problems (and solutions)](#inevitable-problems-and-solutions)
  - [Broken oscillators](#broken-oscillators)
  - [Accessibility](#accessibility)
- [Explore the Web Audio API](#explore-the-web-audio-api)


## Background
There are two great loves in my life: music, and procrastination. Occasionally, the two meet.

Recently, my beloved [SHE Choir London](https://shechoir.com/london) had a virtual retreat weekend (since the pandemic prevented us from gathering for the real thing) and I promised to do a workshop on the basics of musical theory. Chords, scales, keys, harmony and melody - that kind of thing.

Usually with a workshop like this I'd have activities for the group to do to practise what they've learned: for example when teaching chords, we'd sing different notes of a chord together and change some of the notes to hear how different note combinations sound. You can't do that over Zoom, so I was trying to think of ways to make the workshop interactive. I imagined a tool where you can play with the various notes of scales and chords, but also be guided about which notes are in each chord for different keys. Now, I have no doubt that that already exists in many forms, but this was a *prime* procrastination opportunity and I'd wanted to learn how to use the Web Audio API for a while. So that's what I did.

## The Virtual Piano

Have a play: *‌*[Virtual Piano](https://virtualpiano.vercel.app/)

{{< img class="inset-image" src="*/virtualpiano-screenshot.png"  alt="">}}

The app itself is a [Next.js](https://nextjs.org) Typescript React app hosted on [Vercel](https://vercel.com). I figured React would make the interactivity part a bit easier, managing things like showing which keys are playing and reducing repetition when rendering the keyboard, but you could equally do it in vanilla JS. 

### How sound works: relevant science bit
Sound is made up of vibrations that travel as waves: the shape of the wave is known as the **waveform**. The number of vibrations in a time period gives us the **frequency** of the sound: frequency is measured in Hertz (Hz). 1 Hz is one cycle (complete wave) per second, so a frequency of 3 Hz will be 3 cycles per second. 

Synthesizers generate these waves programmatically using **oscillators** to make sound, and that’s what we need to do in order to be able to make sounds with Javascript. 

### Useful musical terms: relevant words bit 
<dl class="terminology">
<div class="definition"><dt>Note</dt>
<dd>A simple musical sound. There are 12 notes in Western music, and they repeat in groups on a piano. We give each note a letter from A-G.</dd></div>
<div class="definition"><dt>Pitch</dt>
<dd>How high or low a note's frequency is. Notes on a piano go from low to high, left to right.</dd></div>
<div class="definition"><dt>Semitone, or half-tone</dt>
<dd>The distance between one note and its nearest neighbour on the piano</dd></div>
<div class="definition"><dt>Tone, or whole tone</dt>
<dd>Two semitones</dd></div>
<div class="definition"><dt>Octave</dt>
<dd>The distance between one note and its next occurrence (e.g. C to C). Each octave jump doubles the frequency of a note, and our brains are clever enough to work out that it's the same note.</dd></div>
<div class="definition"><dt>Scale</dt>
<dd>A set of 8 notes that you play to go from one note to the same note in the next octave. Scales follow particular patterns.</dd></div>
<div class="definition"><dt>Root note</dt>
<dd>The starting note of a scale</dd></div>
<div class="definition"><dt>Key</dt>
<dd>Music tends to use the notes from a particular scale throughout a piece or a song. The key is the scale we are using the notes from.</dd></div>
<div class="definition"><dt>Sharps and flats</dt>
<dd>The black notes on the piano. If the black note is to the right, it's a sharp (♯); if it's to the left, it's a flat (♭). Each black note has two names - one sharp, one flat: e.g. C♯ is the same as D♭.</dd></div>
</dl>

## Building the piano
For my piano I needed
* a **waveform** to output
* an **oscillator** to play the waveform
* to know the **frequencies** of notes on the piano
* to generate **scales** to play
* something for the user to interact with - a **keyboard interface**

 
### Getting started: the `AudioContext`
To use the Web Audio API we need to initialise an [`AudioContext`](https://developer.mozilla.org/en-US/docs/Web/API/AudioContext), the overall audio processor. We only need one for the whole app. The constructor lives on the global `window` object in browsers that support it (all except IE).

{{< highlight typescript >}}
const audioContext = new window.AudioContext()
{{</ highlight >}}

In vanilla JS this would be a global variable. In my React app, I used the `useRef` hook to attach a ref to the AudioContext and keep track of it. Then, when I instantiated my AudioContext I could check to see if we already had one.

{{< highlight typescript >}}
const audioContextRef = useRef<AudioContext>()
...
  let audioCtx: AudioContext
      if (audioContextRef.current == null) {
        audioCtx = new window.AudioContext()
        audioContextRef.current = audioCtx
      } else {
        audioCtx = audioContextRef.current
{{</ highlight >}}

### The waveform
The shape of the waveform determines the sound that’s produced. In an ideal world I'd make my virtual piano sound like an actual piano, but the virtual pianos you get in software and audio programs are using recorded samples of real piano sounds rather than algorithmically generated sounds. I wanted to generate a sound because I could do it on the client, rather than having to make the client fetch a load of massive audio files of piano sounds. Better still, I wanted *someone else* to generate the sound.

I found the [Google Chrome Labs web audio samples](https://github.com/GoogleChromeLabs/web-audio-samples/tree/gh-pages) repository, which helpfully had some waveform files including a "piano" one which I [copied into my project](https://github.com/sophiekoonin/musicaltheory/blob/master/lib/wavetable.ts). 

The function `audioCtx.createPeriodicWave` takes two arguments, `real` and `imag` - both of which are arrays of floats that define the various values of the wave. They are cosine terms and sine terms respectively, for anyone interested. 

I’m not going to go into the details of the maths behind it, mainly because I kind of understand it but also don’t really, and I... don’t really care that much. I know enough to be able to twiddle knobs on a synth and change the sound, but for the purposes of this project, I just wanted something that vaguely resembled a piano.

{{< highlight typescript >}}
 const wave = audioCtx.createPeriodicWave(
        new Float32Array(real),
        new Float32Array(imag)
      )
{{</ highlight >}}


### The oscillator
Now I had my waveform, I needed an oscillator to turn that waveform into sound. An oscillator generates a constant tone. I created one using the `audioCtx` object. 

{{< highlight typescript >}}
 const osc = audioCtx.createOscillator()
      osc.setPeriodicWave(wave)
      osc.connect(audioCtx.destination)
      osc.start()
{{</ highlight >}}

I set the wave I just created on the oscillator using the `setPeriodicWave` function, then connected it to the audio context. Here, `audioCtx.destination` refers to the computer's sound output. `osc.start()` starts the oscillator tone. 

If you want a simple waveform like a [sine or square wave](https://www.perfectcircuit.com/signal/difference-between-waveforms) you don’t need to bother creating a separate waveform - you can just set the `type` property of the oscillator to the wave type you want. 

At this point, the app will be playing a fixed tone. It defaults to a frequency of 440Hz, which is an A. 

### Calculating different frequencies
The A that the oscillator defaults to is A4. The number refers to the octave the note is in, so the 4th octave on the piano.

This A is particularly significant, as it's standardised as [ISO 16](https://www.iso.org/standard/3601.html) - a fixed tuning frequency. We use it as a constant to work out the frequency of other notes based on their position relative to A4 on the piano. 

This function calculates the frequency of a note:

> 𝑓 = 440Hz × 2<sup>𝑛/12</sup>

Where *n* is the number of semitones between our note and A4.

For example, the note C5 - the next C above A4 - is 3 semitones from A4. 𝑛 in this case is 3. 

I hardcoded the semitone distances in a single octave from A:

{{< highlight typescript >}}
const SemitoneDistances = Object.freeze({
  C: -9,
  "C#": -8,
  D: -7,
  "D#": -6,
  E: -5,
  F: -4,
  "F#": -3,
  G: -2,
  "G#": -1,
  A: 0,
  "A#": 1,
  B: 2
})
{{</ highlight >}}

I then used this as the basis for a function that takes a note and its octave, e.g. A, 4, and returns the frequency using the equation above.

{{< highlight typescript >}}
export function calcFrequency(note: NoteLetter, octave: number): number {
  const distanceFromA = SemitoneDistances[note]
  const steps = (octave - 4) * 12 + distanceFromA

  // f = 440Hz * 2^n/12
  const freq = A4 * Math.pow(2, steps / 12)
  // round to 1 d.p.
  return Math.round(freq * 10) / 10
{{</ highlight >}}

Let's break it down:

First, we find the number of semitones between our note and A4, if our note was in octave 4 as well. We use the hardcoded values for this.  
{{< highlight typescript >}}
  const distanceFromA = SemitoneDistances[note]
{{</ highlight >}}
 
 Then, we calculate the difference between our chosen octave and octave 4, and multiply it by the number of semitones in an octave (12), to get the number of semitones between A4 and A in our chosen octave. 

We can then add this value to the `distanceFromA` to get the number of semitones between our note and A4.

{{< highlight typescript >}}
  const steps = (octave - 4) * 12 + distanceFromA
{{</ highlight >}}

Finally, we can calculate the frequency by running that equation we saw before - the frequency of A4 multiplied by 2 to the power of the number of steps over 12. For convenience we round it to 1 decimal place. 

{{< highlight typescript >}}
// f = 440Hz * 2^n/12
  const freq = A4 * Math.pow(2, steps / 12)
  // round to 1 d.p.
  return Math.round(freq * 10) / 10
{{</ highlight >}}

If you'd like to play with this function, I've created an interactive [Codepen](https://codepen.io/sophiekoonin/pen/JjEJowB) that shows the working.

### Generating octaves
With these frequencies I could generate octaves of notes in the form of arrays. I used these this to supply notes to the virtual piano, and generate things like chords and scales.

I iterated over the notes in order and calculated the frequency of each one, and appended them to an array. 

{{< highlight typescript >}}
const notes = [
  'C',  'C#', 'D',  'D#',
  'E',  'F',  'F#', 'G',
  'G#', 'A',  'A#', 'B'
]
// generate an array containing all 12 semitones in octave, from root to root + 8
export function generateOctaves(
  rootNote: NoteLetter, // the note to start the octave on
  startingOctave: number = 4,
  numOctaves: number = 1
) {
  let currentOctave = startingOctave
  const octaveNotes: Array<Note> = []
  const noteIndex = notes.indexOf(rootNote)
  for (let j = 0; j < numOctaves; j++) {
    // first populate the array with all notes from root note through to G#
    for (let i = noteIndex; i < notes.length; i++) {
      octaveNotes.push({
        letter: notes[i],
        octave: currentOctave,
        frequency: calcFrequency(notes[i], currentOctave)
      })
    }
    // then add the remaining notes from before the root note
    for (let i = 0; i < noteIndex; i++) {
      octaveNotes.push({
        letter: notes[i],
        octave: currentOctave + 1,
        frequency: calcFrequency(notes[i], currentOctave + 1)
      })
    }
    currentOctave += 1
  }
  // finally, whack on the last root note + 8
  octaveNotes.push({
    letter: notes[noteIndex],
    octave: currentOctave,
    frequency: calcFrequency(notes[noteIndex], currentOctave)
  })
  return octaveNotes
}
{{</ highlight >}}


### Generating scales
I wanted the piano to play sequences of notes in scales. We can change the frequency the oscillator is playing programmatically, but how do we know which frequencies to play? 

All scales follow patterns, depending on the kind of scale they are. For example, the major scale has the pattern
> tone, tone, semitone, tone, tone, tone, semitone

Apply this pattern from any note, and you'll get that note's major scale. From a starting (root) note of A:

> A, B, C#, D, E, F#, G# 

We can translate this pattern into numbers, and move numerically up the scale in semitones to find the next note of the scale. One tone = two semitones. So this becomes
> 2, 2, 1, 2, 2, 2, 1

I use two octaves to get scale notes from, starting from the chosen root note, as if I tried to calculate A major from one octave I would hit the end of the array pretty quickly. 

I keep a cursor that points to the current position in the scale and iterate through the pattern, adding the number at each step of the pattern. This cursor points to the right notes in the right positions.

{{< highlight typescript >}}
export const ScalePatterns = {
  [Scales.MAJOR]: [0, 2, 2, 1, 2, 2, 2, 1],
  [Scales.NATURAL_MINOR]: [0, 2, 1, 2, 2, 1, 2, 2]
  }
  
function calcScale(rootNote: string, type: string): Array<Note> {
  // start on octave 4
  const octave = generateOctaves(rootNote, 4, 1)
  const scalePattern = ScalePatterns[type]
  return calculateNotePattern(octave, scalePattern)
}


function calculateNotePattern(octave: Note[], pattern: number[]) {
  let currentPosition = 0 // our cursor. starts at root
  const notes = []
  // iterate through the pattern incrementing the position accordingly
  // and get the note at that position.
  for (let pos of pattern) {
    // move the cursor by the number of semitones
    currentPosition += pos
    notes.push(octave[currentPosition])
  }

  return notes
}
{{</ highlight >}}


### Building the piano UI
Now that I had the frequencies, the scales and the octaves, I needed something to interact with and actually play the notes.

I didn't really want to build a complete piano UI from scratch, so I ended up porting [`pianosvg`](https://github.com/spacejack/pianosvg) into React. Each key is an SVG path rendered by a separate React component with its own props. This way, I can pass in whether or not it's currently being played, and what happens when you click it.

The `pianosvg` code takes care of calculating the positions of the keys, and my `Piano` component renders two rows of keys - one white, one black.

I won't go into the details of rendering the piano itself, but you can see the code on [GitHub](https://github.com/sophiekoonin/musicaltheory/blob/master/components/Player/Piano/index.tsx).

### Playing the notes
With the piano rendered, I could now pass in functions to trigger on piano key click. The `Piano` component takes an array of notes, and each `Key` component has an `id` which refers to the note in the array it represents. 

The `Piano` itself sits inside a parent `Player` component, which controls all the audio operations and manages what's currently playing.

I wanted to be able to press a note and have it sound once, but also be able to activate a "sustain pedal" to make the notes continue sounding after I released the mouse button. I also wanted it to be keyboard-accessible. The parent `Player` component stores whether or not the pedal is active in state, and each `Key` has an absurd number of event listeners.

{{< highlight typescript >}}
function Key({
  id,
  play,
  stop,
  pedalOn,
  isPressed,
  toggleNote,
  [...]
}: KeyProps) {
  const playNote = () => (pedalOn ? null : play(id))
  const stopNote = () => (pedalOn ? null : stop(id))
  
   const props = {
    className: cx(styles.key, {
      [styles.pressed]: isPressed
    }),
    onClick: () => toggleNote(id),
    onMouseDown: playNote,
    role: "button",
    onMouseOut: stopNote,
    onMouseUp: stopNote,
    onKeyPress: (e: KeyboardEvent) => handleKeyAction(e, () => toggleNote(id)),
    onKeyDown: (e: KeyboardEvent) => handleKeyAction(e, playNote),
    onKeyUp: (e: KeyboardEvent) => handleKeyAction(e, stopNote),
    tabIndex: id + 10,
    key: id,
  }
  
  return (<g {...props}>
  [...]
  </g>)
  }
  {{</ highlight >}}

The `play` and `stop` functions are defined in the parent `Player` component, and passed in as props to `Piano`. 

{{< highlight typescript >}} 
function playNote(id: number) {
    const osc = initOscillator() // this runs the code we saw before to set up the `AudioContext`
    setOscillators({ ...oscillators, [id]: osc })
    setCurrentNotes(pedalOn ? [...currentNotes, id] : [id])
    osc.frequency.value = pianoNotes[id].frequency
  }
  
  function stop(id: number) {
    if (!isPlaying) return
    const osc = oscillators[id]
    if (osc == null) return

    // remove note from current notes
    const idx = currentNotes.indexOf(id)

    if (idx > -1) {
      const notes = [...currentNotes]
      notes.splice(idx, 1) 
      setCurrentNotes(notes)
    }
    osc.stop(0)
    osc.disconnect(audioContextRef.current.destination)
  }

{{</ highlight >}}

I create a new oscillator for each note that plays. An oscillator can only play one note at a time, so to play multiple notes at once we need multiple oscillators. I keep track of the oscillators in the `Player` state, and stop and disconnect them when I'm done with them.

### Playing a scale
As well as being able to interact with the piano directly, I wanted the piano to automatically play a user-selected scale.

I iterate over the notes of the scale, and set a timeout for each note - when the timeout elapses the frequency of the oscillator is set to the frequency of that note. I chose an interval of half a second for each timeout. The last timeout clears the `currentNotes` array in state, and stops play. 

The `Player` keeps track of the timeouts in state, so that if the user hits the "stop" button I can cancel all the timeouts and stop the scale. 

{{< highlight typescript >}}
function playScale() {
    const osc = initOscillator()
    setOscillators({ ...oscillators, [-1]: osc })

    const playLength = scale.length / 2

    scale.forEach((note, i) => {
      const time = i * 0.5 * 1000 // 0.5 secs * index
      noteTimeouts.push(
        setTimeout(() => {
          osc.frequency.value = note.frequency
          setCurrentNotes([
            pianoNotes.findIndex((n) => n.frequency === note.frequency)
          ])
          setNoteTimeouts(noteTimeouts.slice(1))
        }, time)
      )
    })

    noteTimeouts.push(
      setTimeout(() => {
        setIsPlaying(false)
        setCurrentNotes([])
      }, scale.length * 0.5 * 1000)
    )
    osc.stop(audioContextRef.current.currentTime + playLength)
  }
  {{</ highlight >}}

And there we have it, a tiny interactive piano that plays scales! 
## Inevitable problems (and solutions)
### Broken oscillators
I got it all working, but I had a bit of a nightmare with it. For one thing, sometimes the notes just... don't stop. Despite the array of oscillators in `Player` state, it seems to lose track of the oscillators sometimes and be unable to disconnect them. Also, initialising oscillators sometimes doesn't work fast enough and I'd get errors from trying to set the frequency of undefined oscillators. I had to wrap the function in a promise to force the app to wait until the oscillator had actually been initialised. But I decided people can just refresh the page and live with it.

### Accessibility 
I never thought I'd be building an app with `onclick` attributes added to SVG elements. It feels wrong. But `<button>` is not a valid child of `<svg>`, so I ran with it and added the ARIA attribute `role="button"` to each key. However, the display order of keys didn't match the tabbing order: the white and black keys are rendered separately, so you'd have to tab through the white keys and then the black keys.

I fixed this by manually overriding the `tabindex` attribute for each piano key. Each key has an `id` from 0 to the number of notes on the piano, so I could use this easily. To make sure the remaining elements on the page were still tabbable as usual, I added an offset of 10. 

## Explore the Web Audio API
If you'd like to find out more about the Web Audio API, there are some fantastic resources around, and some even more amazing demos of what's possible.

* [MDN - The Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
* [CSS Tricks: Introduction to the Web Audio API](https://css-tricks.com/introduction-web-audio-api/)
* [Audio Visualization Demo by soulwire](https://codepen.io/soulwire/pen/Dscga)
* [Boombox demo by Ruth John](https://codepen.io/Rumyra/pen/qyMzqN)