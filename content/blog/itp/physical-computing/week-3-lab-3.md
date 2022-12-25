---
title: Week 3 - Lab 3 - Analog In with an Arduino
date: "2018-09-26"
---

### [Lab 3](https://itp.nyu.edu/physcomp/labs/labs-arduino-digital-and-analog/analog-in-with-an-arduino/) documentation

A simple circuit which reads a potentiometer (analog input) to control the brightness of an LED.

<iframe src="https://player.vimeo.com/video/291979246" width="640" height="360" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>

![analog-in](week-3-analog-in.jpg)

### Code

```c
const int ledPin = 9;
int analogValue = 0;
int brightness = 0;

void setup() {
    pinMode(ledPin, OUTPUT);
}

void loop() {
    analogValue = analogRead(A0);
    brightness = analogValue / 4;
    analogWrite(ledPin, brightness);
}
```
