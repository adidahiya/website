---
title: Final Project - Discriminating Mirror
date: "2019-05-17"
---

### Discriminating Mirror

This project was a collaboration with Brent Bailey. He blogged about it more extensively [here](https://medium.com/critical-objects/discriminating-mirror-bd5c2a18299a) (and previously about the project proposal [here](https://medium.com/critical-objects/critical-object-final-proposal-14af36a985f7)).

Check out his post if you haven't yet. This post links to a few additional pieces of documentation and code references.

The code for our project lives in a few places:

-   Python and Processing code which runs on the Raspberry Pi lives in [this repo](https://github.com/adidahiya/edge_tpu_processing_demo) forked from Dan Oved, whose technical scaffolding related to his thesis project helped us a lot.
-   Code to train our custom image classification model lives [here](https://github.com/adidahiya/models). It works alongside the [Coral Edge TPU image classification retraining tutorial](https://coral.withgoogle.com/docs/edgetpu/retrain-classification/) and should be checked out into the Docker container where you do the training.
-   A few other scripts for prototypes used in this project are in [this folder of my critical-objects repo](https://github.com/adidahiya/critical-objects/tree/master/discriminating-oracle/face-recognition).

This video documents when I first got the Coral Edge facial detection model running with Processing streaming Pi Camera images to Python:

<iframe src="https://player.vimeo.com/video/336428615" width="640" height="360" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>

This video shows our custom facial recognition algorithm classifying faces from image crops determined from the result of the aforementioned facial detection model:

<iframe src="https://player.vimeo.com/video/336428667" width="640" height="360" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>

As Brent mentioned in his post, there is an interesting custom ML pipeline here which emphasizes data ownership and control of the automated system. We hope to iterate further on physical output from this system to better communicate the critical discussion we set out to achieve with the project.
