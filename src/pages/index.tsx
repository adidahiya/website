import Link from "gatsby-link";
import React from "react";

import profileImage from "../assets/profile.jpg";

const IndexPage = () => (
    <div>
        <img src={profileImage} alt="profile" width="240px" style={{ height: 240, width: 240 }} />
        <h3 style={{ marginTop: 0 }}>portfolio</h3>
        <p>
            <Link to="/projects/">creative projects</Link>
            <br />
            <Link to="/photos/">selected photographs</Link>
        </p>
        <h3>links</h3>
        <p>
            <a href="https://www.github.com/adidahiya">github</a>
            <br />
            <a href="https://www.flickr.com/photos/adidas006">flickr</a>
            <br />
            <a href="https://www.last.fm/user/adidas006">last.fm</a>
            <br />
            <a href="https://soundcloud.com/adi-dahiya">soundcloud</a>
            <br />
            <a href="https://twitter.com/adi_dahiya">twitter</a>
            <br />
            <a href="https://instagram.com/adidahiya">instagram</a>
        </p>
    </div>
);

export default IndexPage;
