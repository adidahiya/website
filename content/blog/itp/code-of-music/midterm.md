---
title: Week 8 midterm project
date: "2018-10-29"
---

[Interact here](/projects/code-of-music/midterm).

[View source code here](https://github.com/adidahiya/website/blob/develop/src/pages/projects/code-of-music/midterm.tsx).

## Process

### Ideation

I wanted to explore rhythm more deeply in this project by making an interactive audiovisual piece which reveals its rhythmic layers through extended interaction. After playing with one of the p5.js [drawing example sketches](https://p5js.org/examples/hello-p5-drawing.html) and recreating it myself, I decided that this work would be designed for installation in a large projection space with motion tracking. The idea was that viewers of the work could trigger the generative painting program to draw, which would in turn trigger various associated rhythmic elements. The musical controls would not be immediately obvious; hence this becomes a performance itself and not a tool for musicians.

### Prototype

First, I added randomized colors to the generative painting program linked above:

![midterm-progress-1](midterm-progress-1.png)

For the sounds, I started with kick and hi-hat samples I have been using in my other projects (originally downloaded from Splice). I put these into a drum kit and created a `Tone.Loop` pattern with callbacks for every sixteenth note. I have a helper function called `createLoopWithPlayers` which abstracts away some of the repetitive logic of reading bars / beats / sixteenths from the transport time and triggering players at the right time:

```ts
const kit = new Tone.Players({
    kick: "/sounds/kick.wav",
    hh: "/sounds/electronic-hi-hat.ogg",
    wood: "/sounds/drum-wood-under-rug.m4a",
    dsClave: "/sounds/drum-synth-clave.m4a",
    dsGlass: "/sounds/drum-synth-glass.m4a",
    snareCombo: "/sounds/drum-snare-combo.m4a",
}).toMaster();

// set kit levels

const drumLoop = createLoopWithPlayers(
    kit,
    "16n",
    ({ bar, beat, sixteenth: six, trigger }) => {
        // ...
    },
);
```

I also extracted some sounds from a [track I had produced earlier this year](https://soundcloud.com/adi-dahiya/esemplastic) and added them to the drum kit. Some of these were drum synths tuned to particular parameters and others were samples built into Ableton.

The last thing I did with the drums at this point was sync the kick drum to a pulsing background color change of the p5 canvas.

To round out the rhythm section (which would make up the whole "track" of this piece), I added an acid bass synth line using `MonoSynth`:

```ts
this.monoSynth = new Tone.MonoSynth({
    oscillator: {
        type: "square",
    },
    filter: {
        Q: 1.4,
        frequency: 1000,
        type: "lowpass",
        rolloff: -48,
    },
    envelope: {
        attack: 0.0001,
        decay: 0.2,
        sustain: 0.5,
        release: 0.5,
    },
    filterEnvelope: {
        attack: 0.001,
        decay: 0.6,
        sustain: 0.3,
        release: 0.5,
        baseFrequency: "C2",
        octaves: 4,
    },
}).toMaster();
```

...which played a short looping part of F, A#, and C quarter notes:

```ts
const synthPart = new Tone.Part(
    (time: Tone.Types.Time, note: Tone.Types.Note) => {
        this.monoSynth.triggerAttackRelease(note, "8n", time);
    },
    [
        ["0:0:0", "F2"],
        ["0:0:2", "A#2"],
        ["0:0:3", "C2"],
        ["0:1:0", "A#2"],
        ["0:1:3", "F2"],
        ["0:2:1", "F2"],
        ["0:2:3", "F2"],
    ],
);
```

### Interactivity

Next, I made the kit pattern trigger different players depending on the kinds of particles (in practice, the randomly generated hues) which are currently present on the canvas. I also mapped the bass synth's filter Q value to the number of particle paths, so the synth gets more resonance with a busier drawing. You can check out the [full source code](https://github.com/adidahiya/website/blob/c18bb62a575ab8c3377d183005d27ec2c449000c/src/pages/projects/code-of-music/midterm.tsx#L89) for more details about this part.

Here's a sample of what the piece looked and sounded like at this point:

<iframe src="https://player.vimeo.com/video/298872293?loop=1&title=0&byline=0&portrait=0" width="640" height="358" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>

## Iteration & revision

Later, after listening to the bass line for a while, I got tired of it and decided to remove it. This piece didn't have to feel like a full musical composition, and anyway the bass was taking up space which the drums could better occupy in the mix. I also reduced the lifetime of the particles so that they fade out more quickly; this makes it easier for the user to understand how the visuals affect the active audio samples.

<iframe src="https://player.vimeo.com/video/302605287?loop=1&title=0&byline=0&portrait=0" width="640" height="361" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
