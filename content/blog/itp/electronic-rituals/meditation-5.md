---
title: Meditation 5 - randomness
date: "2019-04-17"
---

### Random noise generator

For this week's meditation I felt inspired by the example of N64/NES noise sounds brought up in class. I wanted to create my own interactive noise instrument based on browser interaction sources of entropy. I was already somewhat familiar with white/pink/brown noise in Tone.js, but this gave me the chance to dive a little deeper into the audio noise algorithm and use Web Audio APIs directly.

Tone.js' source code references an algorithm by Zach Denton, which he explains in [this blog post](https://noisehack.com/generate-noise-web-audio-api/). At first I created some buffer sources with a plan to loop through them to play back noise... but I quickly realized this wouldn't work for an interactive instrument which I wanted to react to mouse movement on a web page. So I switched to the more resource-intensive `ScriptProcessorNode` approach with a buffer size of 4096 samples (so it runs about 10 times per second with a 44.1kHz sample rate). I created a custom random function which utilizes mouse X/Y position and the current system time in milliseconds.

[You can interact with the noise instrument here](/projects/electronic-rituals/randomness). [View source code here](https://github.com/adidahiya/website/blob/develop/src/pages/projects/electronic-rituals/randomness.tsx#L129).

Here's a short video of me playing around with the instrument:

<iframe src="https://player.vimeo.com/video/331130997?loop=1&title=0&byline=0&portrait=0" width="640" height="360" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>

You'll notice that it quickly gets into predictable cycles if you don't move the mouse. Mouse movement entropy is a big part of this system, so it relies on a "performer" actually moving the mouse to produce a pseudo random sonic aesthetic.
