---
title: Week 3 deep fakes
date: "2018-09-28"
---

### Deep fake progress

Today I started using [FakeApp](https://www.deepfakes.club/tutorial/) and trained my model. I decided to change my deep fake concept (previously I was planning to do Will Forte <> Elon Musk). Now I'm planning to replace Will Forte's face with that of Ben Shapiro in another Comedy Bang! Bang! segment.

The target clip I'm going to use is from the episode "David Cross Wears A Red Polo Shirt & Brown Shoes With Red Laces" (Season 2, Episode 4) where Will Forte plays a candidate for Senate who claims to have done some pretty horrible things. It's not on YouTube, but you can watch it on Netflix.

Training data clips for Will Forte: CBB S01E01, CBB S02E04, [this SNL skit](https://www.youtube.com/watch?v=4SBo5wzn4MI).

Training data clips for Ben Shapiro: [clip 1](https://www.youtube.com/watch?v=fERROPfODEw), [clip 2](https://www.youtube.com/watch?v=eB2VQ30RvUQ).

Here are some of the CLI tools I used:

```sh
# download video
youtube-dl 'https://www.youtube.com/watch?v=4SBo5wzn4MI' -f '[height <=? 720]'

# split video into frames
ffmpeg -vf fps=5 -qscale:v 2 'frames-270p/imagename%04d.jpg' -i netflix-screencap.mov

# crop frames to get 500x500 px images of faces
autocrop -i ./frames-720p -o ./will-forte-frames-720p
```

I started training in FakeApp with my first batch of images (~380 per face) around 6:20pm today and after about 4 hours, I started to see loss values close to 0.02.
I hope to come back later and keep training with frames from other clips.
