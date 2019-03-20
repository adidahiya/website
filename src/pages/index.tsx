import { Link } from "gatsby";
import React from "react";
import DefaultLayout from "../components/defaultLayout";

// import profileImage from "../assets/profile.jpg";

export default () => (
    <DefaultLayout>
        <h3>adi dahiya</h3>
        <p>
            programmer &amp; artist based in Brooklyn, NY. <br />
            currently pursuing a master's @{" "}
            <a href="https://tisch.nyu.edu/itp" target="_blank">
                NYU ITP
            </a>
            .
        </p>
        <h3>blog</h3>
        <p>
            <Link to="/blog/itp/">ITP (2018)</Link>
        </p>
        <h3>portfolio</h3>
        <p>
            <Link to="/projects/2018/">creative projects (2018&mdash;2019)</Link>
            <br />
            <Link to="/projects/2014/">creative projects (2012&mdash;2014)</Link>
            <br />
            <Link to="/photos/">selected photographs</Link>
        </p>
        <h3>links</h3>
        <p>
            <a href="https://instagram.com/adidahiya">instagram</a>
            <br />
            <a href="https://soundcloud.com/adi-dahiya">soundcloud</a>
            <br />
            <a href="https://twitter.com/adi_dahiya">twitter</a>
            <br />
            <a href="https://www.github.com/adidahiya">github</a>
            <br />
            <a href="https://www.flickr.com/photos/adidas006">flickr</a>
        </p>
    </DefaultLayout>
);
