import { Link, withPrefix } from "gatsby";
import p5 from "p5";
import React from "react";
import DefaultLayout from "../../../components/defaultLayout";
import { P5Canvas } from "../../../components/p5Canvas";

const CANVAS_WIDTH = 400;
const BAR_WIDTH = 50;

function sketch(p: p5) {
    const sounds: any = {};
    let rects: any = {};

    p.preload = () => {
        // HACKHACK
        const loadSound = (path: string) =>
            ((p as any) as p5.SoundFile).loadSound(withPrefix(path));
        sounds.hiHat = loadSound("sounds/hho.wav");
        sounds.punchySnare = loadSound("sounds/snare.wav");
        sounds.punchySnare.setVolume(0.7);
        sounds.pianoLoop = loadSound("sounds/piano-loop.wav");
        sounds.pianoLoop.setVolume(0.6);
        sounds.kick = loadSound("sounds/kick.wav");
        sounds.snare = loadSound("sounds/ce-snare.wav");
    };

    p.setup = () => {
        p.createCanvas(CANVAS_WIDTH, Object.keys(sounds).length * BAR_WIDTH);
        rects = {
            kick: [0, 0],
            punchySnare: [0, BAR_WIDTH],
            hiHat: [0, BAR_WIDTH * 2],
            snare: [0, BAR_WIDTH * 3],
            pianoLoop: [0, BAR_WIDTH * 4],
        };
    };

    p.draw = () => {
        p.clear();
        p.noStroke();
        for (const sound of Object.keys(sounds)) {
            const [x, y] = rects[sound];
            if (sounds[sound].isPlaying()) {
                const progress = sounds[sound].currentTime() / sounds[sound].duration();
                p.fill("rgba(249,172,0," + progress + ")");
                p.rect(x, y, CANVAS_WIDTH * progress, BAR_WIDTH);
            }
        }
    };

    p.keyPressed = () => {
        switch (p.keyCode) {
            case 65: // A
                sounds.kick.play();
                break;
            case 83: // S
                sounds.punchySnare.play();
                break;
            case 70: // F
                sounds.snare.play();
                break;
            case 74: // J
                if (sounds.pianoLoop.isPlaying()) {
                    sounds.pianoLoop.stop();
                } else {
                    sounds.pianoLoop.loop();
                }
                break;
            case 68: // D
                sounds.hiHat.play();
                break;
        }
    };
}

export default () => (
    <DefaultLayout>
        <h3>Code of Music</h3>
        <p>
            Week 1 sample-based instrument (
            <Link to="/blog/itp/code-of-music/sample-based-instrument">blog post</Link>)
        </p>
        <p>Available keys: A, S, D, F, J</p>
        <P5Canvas sketch={sketch} />
    </DefaultLayout>
);
