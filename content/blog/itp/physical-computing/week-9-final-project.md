---
title: Week 9 - Final project ideas
date: "2018-11-07"
---

_Work in progress_

## Proposals

Lately I've been very interested in electronic dance music and the production of club environments. I just started learning how to mix as a DJ. For my final project, I want to create a device which is useful for live performance, possibly portable enough to bring around with me to gigs.

The basic idea would be to use the BPM of currently playing track to control some LED visuals. I could get the BPM information into the Arduino either:

1. via MIDI on my computer &rarr; serial data
    - The data could be sent to the Arduino over USB or Bluetooth, so I do have the option of placing the microcontroller away from the DJ booth.

2. by detecting beats in an analog audio signal recorded with a small microphone
    - This would allow the device to be standalone and not dependent on a laptop, which could be cool. I currently use a laptop to DJ with a Pioneer controller, but in a professional club setup I wouldn't typically use a laptop since the CDJs would have all the necessary software.

As far as device outputs, the important part would be programming interesting LED patterns over time. I haven't done this before but I have seen a lot of inspiring work in this area which I hope to imitate.


## Research

Some preliminary research on beat detection:

- https://electronics.stackexchange.com/questions/148085/fft-beat-detection-circuit
- https://dsp.stackexchange.com/questions/9521/simple-beat-detection-algorithm-for-microcontroller
- https://bochovj.wordpress.com/2013/07/07/bass-detection-with-arduino/


## Inspiration

Some artists & engineers whose live performance installations I admire:

- http://www.nitemind.us/
- http://www.daveandgabe.care/
