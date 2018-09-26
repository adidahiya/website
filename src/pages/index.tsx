import Link from "gatsby-link";
import React from "react";
import DefaultLayout from "../components/defaultLayout";

// import profileImage from "../assets/profile.jpg";

export default () => (
    <DefaultLayout>
        <h3>about</h3>
        <p>
            grad student at NYU's ITP program, based in Brooklyn. <br />
            interested in music, interaction design, photography, and the social impact of
            technology.
        </p>
        <h3>blogs</h3>
        <p>
            <Link to="/blog/itp/">ITP (2018)</Link>
        </p>
        <h3>portfolio</h3>
        <p>
            <Link to="/projects/2014/">creative projects (2012&mdash;2014)</Link>
            <br />
            <Link to="/photos/">selected photographs</Link>
        </p>
        <h3>links</h3>
        <p>
            <a href="https://instagram.com/adidahiya">instagram</a>
            <br />
            <a href="https://twitter.com/adi_dahiya">twitter</a>
            <br />
            <a href="https://soundcloud.com/adi-dahiya">soundcloud</a>
            <br />
            <a href="https://www.github.com/adidahiya">github</a>
            <br />
            <a href="https://www.flickr.com/photos/adidas006">flickr</a>
            <br />
            <a href="https://www.last.fm/user/adidas006">last.fm</a>
        </p>
    </DefaultLayout>
);
