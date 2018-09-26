import { withPrefix } from "gatsby";
import Link from "gatsby-link";
import p5 from "p5";
import React from "react";
import DefaultLayout from "../../../components/defaultLayout";
import { P5Canvas } from "../../../components/p5Canvas";

function sketch() {
    // TODO
}

export default () => (
    <DefaultLayout>
        <h3>Code of Music</h3>
        <p>
            Week 2 rhythm (<Link to="/blog/itp/code-of-music/rhythm">blog post</Link>)
        </p>
        <P5Canvas sketch={sketch} />
    </DefaultLayout>
);
