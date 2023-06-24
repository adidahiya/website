import { Link } from "gatsby";
import React from "react";

import DefaultLayout from "../components/defaultLayout";

// import profileImage from "../assets/profile.jpg";

export default () => (
    <DefaultLayout>
        <h3>adi dahiya</h3>
        <p>
            programmer &amp; artist based in Brooklyn, NY. <br />
            <a href="https://tisch.nyu.edu/itp" target="_blank">
                NYU ITP
            </a>{" "}
            alum.
        </p>
        <h3>portfolio</h3>
        <p>
            <Link to="/projects/lighting/">lighting design</Link>
            <br />
            <Link to="/projects/video/">video</Link>
            <br />
            <Link to="/projects/software/">software</Link>
            <br />
            <Link to="/photos/">photography</Link>
            <br />
            <Link to="/projects/itp/">creative projects (ITP)</Link>
            <br />
            <Link to="/projects/upenn/">creative projects (UPenn)</Link>
        </p>
        <h3>blog posts & essays</h3>
        <p>
            <Link to="/slices/free-water/">free water at the rave // liquid love (2023)</Link>
            <br />
            <Link to="/blog/itp/">ITP blog (2018&mdash;2020)</Link>
        </p>
        <h3>links</h3>
        <p>
            <a href="https://www.instagram.com/calzone.wav">instagram</a>
            <br />
            <a href="https://soundcloud.com/taal-nyc">soundcloud</a>
            <br />
            <a href="https://twitter.com/adi_dahiya">twitter</a>
            <br />
            <a href="https://www.github.com/adidahiya">github</a>
            <br />
            <a href="https://www.flickr.com/photos/adidas006">flickr</a>
        </p>
    </DefaultLayout>
);
