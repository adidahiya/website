---
title: Week 5 harmony
date: "2018-10-15"
---

## Listen

Delicate Steve plays beautiful slide guitar melodies on top of each other. _Ramona Reborn_ builds up with the interplay of three such voices:

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/NJhxCgvac3k?rel=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>

Another example of harmony which crossed my mind as we listened to drone sounds in class was classical sitar. Ravi Shankar demonstrates some of the best of this genre of music:

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/gMk2eTqPLWk?rel=0&amp;start=1158" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>

## Code

[Check out my p5.js sketch for the week here](/projects/code-of-music/harmony-sketch).

I started out by trying to emulate some of the slide guitar sounds in Delicate Steve's songs by using some basic pitch bending. I created a `PolySynth` and applied `rampTo` on each of the voices' frequencies right after triggering the attack stage of the envelope (notes are released when keys are released).

I noticed that if I played notes quickly in succession, the pitch would start to increase past the bounds that I had initially programmed. `rampTo` was being called in quick succession to transpose the notes up the scale. Although this effect was an artifact of my initial naive implementation, I decided to run with the idea to compose some harmonies.

I added a drone synth based off the [drone_event](https://editor.p5js.org/luisa/sketches/H1p3B-6cm) sample sketch. Mine uses an FM sine oscillator with triangle modulation. It plays a constant C2 note on every measure, except when there are multiple keys pressed -- then, it changes pitch to match the current (potentially ramped) frequency of the first voice in the `PolySynth`. This creates some interesting harmonies and disharmonies.

There are a lot of parameters to tweak here... I'd like to see how the sketch sounds with the drone playing every 2 beats instead of every measure (so that it's easier to line up with notes the user is playing). I could also "quantize" the drone pitches so that it never gets caught on a dissonant frequency between notes (or even on notes that are not harmonic with the current scale) while `rampTo` is active.

<iframe src="https://player.vimeo.com/video/295222625" width="640" height="323" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
