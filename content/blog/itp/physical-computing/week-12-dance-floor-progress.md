---
title: Week 12 - Dance floor sequencer progress
date: "2018-12-02"
---

## Dance floor sequencer progress

I started building out the sequencer software. There are some timing & web audio clock performance issues in this clip, but it should give you the general idea of what I'm thinking so far:

<iframe src="https://player.vimeo.com/video/304020225?loop=1&title=0&byline=0&portrait=0" width="640" height="894" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>

After fixing some timing issues:

<iframe src="https://player.vimeo.com/video/304055758?loop=1&title=0&byline=0&portrait=0" width="640" height="633" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>

Coming soon, more notes on:

- prototypes of plate contact switches
- idea of how I will quantize recordings

Roadblocks:

- p5.sound is side-effectful and that is awful! It caused the same problems I was seeing in the techno-landscape project but was never able to pin down. Timing events greatly improved after I removed this errant module import from the page.
