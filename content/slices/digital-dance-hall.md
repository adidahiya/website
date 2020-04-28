---
title: Digital Dance Hall
---

Thesis Documentation DRAFT

April 2020

Adi Dahiya

## Project Description

Digital Dance Hall is a social video platform for internet dance parties. It recreates the festive energies, kinesthetic effects, and social interactions of my favorite nightlife environments in an effort to foster spaces for ecstatic communal experiences and the creation of new performative versions of oneself.

<iframe width="560" height="315" src="https://www.youtube.com/embed/GmIW81pyY90" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Thesis Abstract

Experience design for nightclubs and dance parties has always been propelled by new technologies and mediums, but it is only in the wake of a global pandemic and its associated social practices for outbreak mitigation that earnest efforts are being made to create meaningful party experiences online. Digital Dance Hall is a timely solution to an urgent need in nightlife; it is a platform for an underground dance music community which is underserved by existing products and tools. Its design takes into consideration the needs and roles of DJs, lighting designers, promoters, and party-goers; its features adapt some of the rituals and behaviors from physical spaces which I encountered and developed in my research into digital UX patterns. It is my hope that parties facilitated by Digital Dance Hall can serve some of the functions of their physical counterparts, namely as places for community building, presentation of forward-thinking music culture, and the creation of new performative versions of our self identities.

## Context & Research

My interest in this project stemmed from my involvement and activity in the Brooklyn dance music community over the past year. The project originally sought to explore spatial and lighting design for site-specific dance parties as a means of developing a design philosophy for nightclubs. I was and still am focused specifically in nightlife environments where “dance is not a means to sex but [drives] the space,” where the dance floor is a site of “spiritual communion” due to a “unique combination of decor, space, music, drugs, lighting, and dance, as well as [the host’s] guiding party ethos” (Tim Lawrence, _Love Saves the Day_). As I became an active dancer and forged bonds with others in the underground dance music community, I studied which parts of the designed experience supported these self developments. I developed a small fan base through DJing, worked with industry friends as a promoter, and learned lighting design & programming so that I could throw my own parties. I found that certain lighting and spatial design decisions encouraged greater experimentation in and development of choreography for oneself, as well as varying configurations of dancers in relation to each other and the performers. The most important takeaway from this research was what appears to be an obvious principle in hindsight: dance parties are other people. Our communal aesthetic enjoyment of the music and its visual accompaniment, the kinesthetic synchronization and/or counterpoint of our choreographies, and the opportunities we are afforded for casual performance of dance-floor identities to receptive audiences are what make nightlife and art form.

## Technical Details

Digital Dance Hall is a static web application which acts as a client for the open source video conferencing service Jitsi Meet. The user interface is built using React, MobX, WebRTC, HTML5 Canvas, XMPP, and Websockets. It allows performers to broadcast their audio/visual performance directly with WebRTC routed through Jitsi Videobridge, or through external streaming services (such as the popular livestreaming platform Twitch), whose streams can be embedded as iframes using configuration options.

## Process Documentation

Read more about the process behind this project in my [thesis production blog](/blog/itp/thesis-production).
