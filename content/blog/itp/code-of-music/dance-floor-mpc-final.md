---
title: Week 14 final project conclusion
date: "2018-12-18"
---

I produced four working tiles for the final presentation of my Dance Floor MPC project on December 10. Because I set up the sensors as analog inputs, I was able to detect varying pressure and program the device to support _accents_ in the sequencer. Stepping on the tiles with greater force provides feedback with a different LED color:

<iframe src="https://player.vimeo.com/video/305814941?loop=1&title=0&byline=0&portrait=0" width="640" height="360" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>

During the actual presentation, I taped the tiles to the foam tile base to keep them in place. By this point, I had not yet fabricated the [floor console](../../physical-computing/week-13-dance-floor-mpc-3) I had designed, so I kept the microcontroller and breadboard in a cardboard box next to the tiles and simply placed the transport LED strip in front of them.

![final-project-conclusion](final-project-conclusion.jpg)

Here's a screen recording of the sequencer web interface which I showed during the presentation (not the exact performance from my demo, but it reflects the [state of the code at the time](https://github.com/adidahiya/website/blob/565b24cbeb8e9541a6324929e91c1cd7a86f9ad5/src/pages/projects/physical-computing/dance-floor-sequencer.tsx)):

<iframe src="https://player.vimeo.com/video/307206133?title=0&byline=0&portrait=0" width="640" height="556" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>

I received some good interaction design feedback during the presentation critique which pushed me towards making the device feel more like a game (akin to DDR) rather than framing it as a groove dancing experience; I was forced to face the fact that it's pretty hard to get a groove going on the "Dance Floor MPC" _and_ produce a nice rhythm at the same time (rather, you can dance to the beat you made after using the sequencing features).

I kept working on this project up until the winter show on December 16. You can read more about the overall project [here](/slices/dance-floor-mpc) and read more progress updates in the [physical computing section of this blog](../../physical-computing).
