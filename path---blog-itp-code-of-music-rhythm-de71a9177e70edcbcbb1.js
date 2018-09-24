webpackJsonp([0xcc7b9b04168b],{285:function(A,e){A.exports={data:{markdownRemark:{html:'<h3>Reading</h3>\n<ul>\n<li>(Optional) <a href="https://www.html5rocks.com/en/tutorials/audio/scheduling/">A Tale of Two Clocks - Scheduling Web Audio with Precision</a></li>\n</ul>\n<h3>Assignments</h3>\n<h4>Listen</h4>\n<iframe width="560" height="315" src="https://www.youtube.com/embed/B7PeGqqGiFo" frameborder="0" allow="encrypted-media" allowfullscreen></iframe>\n<p>This track slaps. It\'s got some syncopation right off the bat which stays in the drum mix throughout. The shaker is the first instrument you notice which is syncopated, but soon you also notice that the kick drum has one syncopated beat in its repetitive pattern.</p>\n<h4>Interact</h4>\n<p><a href="https://experiments.withgoogle.com/ai/drum-machine/view/">The Infinite Drum Machine</a></p>\n<p><img src="/infinite-drum-machine-34b73122f91f8e8ff8dcd2964ce71a48.gif" alt="infinite-drum-machine"></p>\n<ul>\n<li>I really like this drum machine. Not only is it visually interesting to look at while your loop is playing, it\'s also intuitive to use. I like that it pauses playback when you start to move around one of the four sample selections (you need to be able to preview the new sound you\'re sampling).</li>\n<li>The problem they\'re trying to solve here is real; organizing a large library of samples can be tedious and boring, so applying machine learning seems like a good fit. There are online communities like Splice and Beatport where musicians tag various samples, and ultimately I think this additional human-generated data can help to categorize sounds even better (e.g. with information about how a sound is typically used in a particular genre, not just its musical signature).</li>\n</ul>\n<p><a href="https://musiclab.chromeexperiments.com/Rhythm/">Chrome Music Lab - Rhythm</a></p>\n<p><img src="/chrome-music-lab-rhythm-a0161ca22d56d81c816cf22f681c66a7.gif" alt="chrome-music-lab-rhythm"></p>\n<ul>\n<li>This one\'s pretty simple and cute. It has an approachable interface which invites you to lay down a simple drum beat. I can imagine this being nice for youth music education.</li>\n</ul>\n<h4>Design</h4>\n<p>For this assignment I took inspiration from James Murphy\'s <a href="http://gothamist.com/2014/02/24/video_james_murphy_tests_out_subway.php">Subway Symphony project</a> which aimed to replace the unpleasant beeps of the MTA subway turnstiles with some more melodious sounds (it was <a href="https://pitchfork.com/news/59966-james-murphy-partners-with-heineken-for-subway-turnstile-music-project-mta-denies-it-will-happen/">rejected by the MTA</a>, but later a preview of it was installed in the new <a href="https://ny.curbed.com/2016/7/7/12122964/james-murphy-lowline-lab-subway-music">Lowline</a> in LES). In much the same way, I\'d like to consider a project which improves the aural experience of using the subway and utilizes swiping passengers as inputs to a musical system.</p>\n<p><a data-flickr-embed="true"  href="https://www.flickr.com/photos/jpstjohn/15146385312/in/photolist-p5rbEm-bfAkPx-649JJ1-6LnHk-6UazNw-3hhu8e-6UazAb-6U6AoZ-6UaDKN-6U6Cr4-6UaCrC-Bq9Vi-6U6DhP-6UaDvL-6U6BuF-6U6BWp-6U6vRD-6U6zq6-6Uaz9d-6UaxaE-6UaADf-6UaDjo-6UaApL-6U6vvt-6U6Bi8-7PauQS-6U6DwB-6Uaxo1-6U6CbH-6U6x6K-6UawVQ-6U6A9X-6UayeA-6UaznG-6UayWu-6UaBNj-6U6wT8-6Uayr3-6U6ACX-6UaBAC-C4QF5-6LnNo-6Ar9dw-7R8QtW-mZW6Ua-bxRFnX-e8JCH1-C4Qz2-agSgkc-mZXP7C" title="Hats and Bags"><img src="https://farm4.staticflickr.com/3910/15146385312_a57fab9b80_c.jpg" width="800" height="620" alt="Hats and Bags"></a><script async src="//embedr.flickr.com/assets/client-code.js" charset="utf-8"></script></p>\n<p>My design requires mapping different kinds of "swipes" to different sounds in a drum machine. I think these six triggers could create a good first prototype:</p>\n<ol>\n<li>Regular swipe</li>\n<li>Low balance swipe (less than 1 trip left)</li>\n<li>Swipe with service disruption (planned track work currently affecting service)</li>\n<li>Insufficient fare swipe</li>\n<li>Swipe with train departing (slow down, you just missed it)</li>\n<li>Swipe with train approaching in &#x3C; 2 min (hurry up!)</li>\n</ol>\n<p>If more than one of these situations apply, the latter categories take precedence.</p>\n<p>\n  <a\n    class="gatsby-resp-image-link"\n    href="/static/turnstiles-1-0580c80b0aeaacbebd8cfe82a8da2745-121bb.jpg"\n    style="display: block"\n    target="_blank"\n    rel="noopener"\n  >\n  \n  <span\n    class="gatsby-resp-image-wrapper"\n    style="position: relative; display: block; ; max-width: 888px; margin-left: auto; margin-right: auto;"\n  >\n    <span\n      class="gatsby-resp-image-background-image"\n      style="padding-bottom: 88.046875%; position: relative; bottom: 0; left: 0; background-image: url(\'data:image/jpeg;base64,/9j/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wgARCAASABQDASIAAhEBAxEB/8QAGAABAQEBAQAAAAAAAAAAAAAAAAQBAwL/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIQAxAAAAGrd6HFQI7A9A//xAAaEAADAAMBAAAAAAAAAAAAAAAAAREDEBIx/9oACAEBAAEFAoQ5E7qGMXp//8QAFBEBAAAAAAAAAAAAAAAAAAAAIP/aAAgBAwEBPwEf/8QAFBEBAAAAAAAAAAAAAAAAAAAAIP/aAAgBAgEBPwEf/8QAFBABAAAAAAAAAAAAAAAAAAAAMP/aAAgBAQAGPwIf/8QAHRABAAEDBQAAAAAAAAAAAAAAAQARITEQQVFhcf/aAAgBAQABPyFucsp8j3lIvMNoMLt5m63/2gAMAwEAAgADAAAAEOMAPP/EABQRAQAAAAAAAAAAAAAAAAAAACD/2gAIAQMBAT8QH//EABQRAQAAAAAAAAAAAAAAAAAAACD/2gAIAQIBAT8QH//EABwQAQACAwADAAAAAAAAAAAAAAEAESExcUFRYf/aAAgBAQABPxASoC4Jm23IC2N+ysPGuMDeGiuw2E7YImi2pq5LfbP/2Q==\'); background-size: cover; display: block;"\n    >\n      <img\n        class="gatsby-resp-image-image"\n        style="width: 100%; height: 100%; margin: 0; vertical-align: middle; position: absolute; top: 0; left: 0; box-shadow: inset 0px 0px 0px 400px white;"\n        alt="turnstiles-1"\n        title=""\n        src="/static/turnstiles-1-0580c80b0aeaacbebd8cfe82a8da2745-d8a26.jpg"\n        srcset="/static/turnstiles-1-0580c80b0aeaacbebd8cfe82a8da2745-8b83c.jpg 222w,\n/static/turnstiles-1-0580c80b0aeaacbebd8cfe82a8da2745-80e58.jpg 444w,\n/static/turnstiles-1-0580c80b0aeaacbebd8cfe82a8da2745-d8a26.jpg 888w,\n/static/turnstiles-1-0580c80b0aeaacbebd8cfe82a8da2745-121bb.jpg 1280w"\n        sizes="(max-width: 888px) 100vw, 888px"\n      />\n    </span>\n  </span>\n  \n  </a>\n    </p>\n<p>For accessibility and usability purposes, the actual beeps at the turnstiles shouldn\'t be altered too much (of course, there\'s room for improvement in the actual tones used, and the different codes produced by the system are not easy to learn at the moment). But there\'s room in other parts of the subway system for speakers which produce rhythms triggered by swipes — for example, the MTA attendant\'s booth or the stairwell leading up or down to the platforms.</p>\n<p>The sounds aren\'t triggered immediately (although this might be worth trying, I think it would be too random and the resulting rhythms wouldn\'t feel "musical", just noisy), but rather according to a pre-programmed drum pattern. The software could cycle through patterns on some schedule (perhaps change every 15 min) to keep things interesting. When no one is swiping, there would be no sounds triggered. When a swipe occurs, it would schedule its corresponding sound to trigger <em>on the next instance of that sound in the drum pattern</em>. Additional swipes that occur between the original swipe and when the sound actually plays would queue up additional triggers to occur later.</p>\n<p>\n  <a\n    class="gatsby-resp-image-link"\n    href="/static/turnstiles-2-13e0bc2b2e8b8d1a879e6a9f6aa8f927-121bb.jpg"\n    style="display: block"\n    target="_blank"\n    rel="noopener"\n  >\n  \n  <span\n    class="gatsby-resp-image-wrapper"\n    style="position: relative; display: block; ; max-width: 888px; margin-left: auto; margin-right: auto;"\n  >\n    <span\n      class="gatsby-resp-image-background-image"\n      style="padding-bottom: 47.1875%; position: relative; bottom: 0; left: 0; background-image: url(\'data:image/jpeg;base64,/9j/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wgARCAAJABQDASIAAhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAAAAMEAv/EABQBAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhADEAAAAb9JBhMH/8QAGBAAAgMAAAAAAAAAAAAAAAAAABEBEBL/2gAIAQEAAQUCaNDuT//EABQRAQAAAAAAAAAAAAAAAAAAABD/2gAIAQMBAT8BP//EABQRAQAAAAAAAAAAAAAAAAAAABD/2gAIAQIBAT8BP//EABQQAQAAAAAAAAAAAAAAAAAAACD/2gAIAQEABj8CX//EABoQAAICAwAAAAAAAAAAAAAAAAABEBEhMUH/2gAIAQEAAT8hSYQa2djY/9oADAMBAAIAAwAAABBAz//EABQRAQAAAAAAAAAAAAAAAAAAABD/2gAIAQMBAT8QP//EABQRAQAAAAAAAAAAAAAAAAAAABD/2gAIAQIBAT8QP//EABwQAAIABwAAAAAAAAAAAAAAAAABEBEhMVFhwf/aAAgBAQABPxCs5vYkyx644i//2Q==\'); background-size: cover; display: block;"\n    >\n      <img\n        class="gatsby-resp-image-image"\n        style="width: 100%; height: 100%; margin: 0; vertical-align: middle; position: absolute; top: 0; left: 0; box-shadow: inset 0px 0px 0px 400px white;"\n        alt="turnstiles-2"\n        title=""\n        src="/static/turnstiles-2-13e0bc2b2e8b8d1a879e6a9f6aa8f927-d8a26.jpg"\n        srcset="/static/turnstiles-2-13e0bc2b2e8b8d1a879e6a9f6aa8f927-8b83c.jpg 222w,\n/static/turnstiles-2-13e0bc2b2e8b8d1a879e6a9f6aa8f927-80e58.jpg 444w,\n/static/turnstiles-2-13e0bc2b2e8b8d1a879e6a9f6aa8f927-d8a26.jpg 888w,\n/static/turnstiles-2-13e0bc2b2e8b8d1a879e6a9f6aa8f927-121bb.jpg 1280w"\n        sizes="(max-width: 888px) 100vw, 888px"\n      />\n    </span>\n  </span>\n  \n  </a>\n    </p>',frontmatter:{date:"21 September, 2018",title:"Week 2 rhythm"},fields:{slug:"/blog/itp/code-of-music/rhythm/"}}},pathContext:{slug:"/blog/itp/code-of-music/rhythm/"}}}});
//# sourceMappingURL=path---blog-itp-code-of-music-rhythm-de71a9177e70edcbcbb1.js.map