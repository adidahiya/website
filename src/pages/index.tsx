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
        <h3>blog</h3>
        <p>
            <Link to="/blog/itp/">ITP (2018&mdash;2020)</Link>
        </p>
        <h3>portfolio</h3>
        <p>
            <Link to="/projects/2018/">creative projects (2018&mdash;2020)</Link>
            <br />
            <Link to="/projects/blueprint/">blueprint (2015&mdash;2019)</Link>
            <br />
            <Link to="/projects/2014/">creative projects (2012&mdash;2014)</Link>
            <br />
            <Link to="/photos/">selected photographs</Link>
        </p>
        <h3>links</h3>
        <p>
            <a href="https://www.instagram.com/comfortzone.wav">instagram</a>
            <br />
            <a href="https://soundcloud.com/djcomfortzone">soundcloud</a>
            <br />
            <a href="https://twitter.com/adi_dahiya">twitter</a>
            <br />
            <a href="https://www.github.com/adidahiya">github</a>
            <br />
            <a href="https://www.flickr.com/photos/adidas006">flickr</a>
        </p>
    </DefaultLayout>
);
