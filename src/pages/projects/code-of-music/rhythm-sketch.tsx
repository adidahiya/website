import { withPrefix } from "gatsby";
import Link from "gatsby-link";
import p5 from "p5";
import "p5/lib/addons/p5.dom";
import "p5/lib/addons/p5.sound";
import React from "react";
import DefaultLayout from "../../../components/defaultLayout";
import { P5 } from "../../../components/p5";

function sketch() {
    // TODO
}

export default () => (
    <DefaultLayout>
        <h3>Code of Music</h3>
        <p>
            Week 2 rhythm (<Link to="/blog/itp/code-of-music/rhythm">blog post</Link>)
        </p>
        <P5 sketch={sketch} />
    </DefaultLayout>
);
