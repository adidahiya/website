import * as React from "react";

import { slugify } from "../../utils";
import * as styles from "./projects.module.css";

const PROJECT_NAMES = [
    "Mapping Musical Genres",
    "Branding the Contemporary Fringe",
    "You Are the Product",
    "Electronic Synthesis Visualizer",
    "Tweet Topic Correlations Between U.S. Counties",
    "Buzz, Your Smart Doorman",
    "Losing My Edge",
    "PennApps hackathon",
    "Nostrand",
    "Levine",
    "Creative Process Book",
];

const SectionLink = ({ name }: { name: string }) => (
    <li>
        <a href={`#${slugify(name)}`}>{name}</a>
    </li>
);

const ProjectHeading = ({ index }: { index: number }) => {
    const name = PROJECT_NAMES[index];
    return (
        <h3 id={slugify(name)}>
            {PROJECT_NAMES[index]}{" "}
            <span className={styles.tocLink}>
                <a href="#toc">&uarr; top</a>
            </span>
        </h3>
    );
};

const ProjectsIndexPage = () => (
    <div className={styles.projects}>
        <h2 id="toc">creative projects</h2>
        <p>
            Below, you'll find my work in information visualization, typography, graphic design,
            physical computing, branding, and various experiments.
        </p>
        <p>
            <ul>{PROJECT_NAMES.map(n => <SectionLink name={n} />)}</ul>
        </p>
        <hr />

        <section>
            <ProjectHeading index={0} />
            <p>
                <img src={require("./mapping-music-genres/clip-1.png")} />
                <img src={require("./mapping-music-genres/clip-2.png")} />
                <a
                    className={styles.imageLink}
                    href={require("./mapping-music-genres/poster-photo.jpg")}
                >
                    <img src={require("./mapping-music-genres/poster-photo-small.jpg")} />
                </a>
            </p>
            <p>
                <a href={require("./mapping-music-genres/poster.pdf")}>60" &times; 40" print</a>{" "}
                &mdash; Spring 2014
            </p>
            <p>
                Multi-dimensional graph-based visualization representing the development of and
                influences between major musical genres from 1940&mdash;2000 (built using data from{" "}
                <a href="http://the.echonest.com/">The Echo Nest</a> APIs).
            </p>
        </section>
        <hr />

        <section>
            <ProjectHeading index={1} />
            <p>
                <img src={require("./branding-fringe/edge-art-render.png")} />
                <img src={require("./branding-fringe/edge-art-video.png")} />
            </p>
            <p>
                <a href="http://www.adidahiya.com/design/edge">Interactive application</a> &mdash;
                Fall 2013
            </p>
            <p>
                An experimental project which attempts to brand the contemporary fringe of art &amp;
                design through a 2D visualization which reacts to user input via webcam.{" "}
                <a href="http://vimeo.com/adidahiya/edge">Demo video on Vimeo</a>.
            </p>
        </section>
        <hr />

        <section>
            <ProjectHeading index={2} />
            <p>
                <img src={require("./you-are-the-product/process.jpg")} />
                <img src={require("./you-are-the-product/doc-6.jpg")} />
            </p>
            <p>
                <a href="http://www.adidahiya.com/design/typog">Website</a> &mdash; Fall 2013
            </p>
            <p>
                A typography-driven project which takes a critical look at the economics of popular
                free web services–such as Google, Facebook, and Twitter–which invert the traditional
                product consumption relationship.
            </p>
        </section>
        <hr />

        <section>
            <ProjectHeading index={3} />
            <p>
                <img src={require("./synthesis/synth-vis.png")} />
            </p>
            <p>
                <a href="http://www.adidahiya.com/synth-vis">Interactive application</a> &mdash;
                Spring 2014
            </p>
            <p>
                A simple browser-based synthesizer that visualizes subtractive synthesis over time.
                Users can play notes using their keyboard and see ADSR envelopes move across the
                isometric 3D canvas.
            </p>
        </section>
        <hr />

        <section>
            <ProjectHeading index={4} />
            <p>
                <img src={require("./tweet-correlations/wwbp-counties.png")} />
            </p>
            <p>
                <a href="http://www.adidahiya.com/wwbp-counties">Interactive application</a> &mdash;
                Spring 2014
            </p>
            <p>
                A force-directed graph visualization which draws attention to particularly unique
                correlations of topics tweeted in different U.S. counties. Data source: Penn's{" "}
                <a href="http://wwbp.org/">World Well-Being Project</a>.
            </p>
        </section>
        <hr />

        <section>
            <ProjectHeading index={5} />
            <p>
                <img src={require("./buzz/header.png")} />
                <img src={require("./buzz/prototype.jpg")} />
                <img src={require("./buzz/internals.jpg")} />
            </p>
            <p>
                <a href={require("./buzz/sell-sheet.pdf")}>
                    Concept, prototype &amp; marketing materials
                </a>{" "}
                &mdash; Spring 2014
            </p>
            <p>A “smart” doorbell which sends you an SMS when a visitor arrives.</p>
        </section>
        <hr />

        <section>
            <ProjectHeading index={6} />
            <p>
                <img src={require("./losing-my-edge/photo.jpg")} />
                <img src={require("./losing-my-edge/preview.png")} />
            </p>
            <p>
                <a href={require("./losing-my-edge/losing-my-edge.pdf")}>
                    5" &times; 7" letterpress print
                </a>{" "}
                &mdash; Fall 2012
            </p>
            <p>
                A graphical interpretation of a text using only typography. I used the lyrics from
                the LCD Soundsystem song <em>Losing My Edge</em>.
            </p>
        </section>
        <hr />

        <section>
            <ProjectHeading index={7} />
            <p>
                <img src={require("./pennapps/website-2014s.png")} />
                <img src={require("./pennapps/website.png")} />
                <img src={require("./pennapps/logo.png")} />
            </p>
            <p>
                <a href="http://2014s.pennapps.com/">Website</a> &mdash; Fall 2013
            </p>
            <p>
                Logo design, website, branding, and creative direction for one of the largest
                student hackathons in the U.S.
            </p>
        </section>
        <hr />

        <section>
            <ProjectHeading index={8} />
            <p>
                <img src={require("./vinyl-sleeve/preview.png")} />
            </p>
            <p>
                <a href={require("./vinyl-sleeve/vinyl-sleeve.pdf")}>12" vinyl cover art</a> &mdash;
                Fall 2012
            </p>
            <p>
                A vinyl cover designed to visually evoke the sounds of the song <em>Nostrand</em> by
                Ratatat.
            </p>
        </section>
        <hr />

        <section>
            <ProjectHeading index={9} />
            <p>
                <a href={require("./levine-typeface/full-1.png")}>
                    <img src={require("./levine-typeface/preview-1.png")} />
                </a>
                <a href={require("./levine-typeface/full-2.png")}>
                    <img src={require("./levine-typeface/preview-2.png")} />
                </a>
            </p>
            <p>Custom typeface &amp; sample sheet &mdash; Fall 2012</p>
            <p>
                A custom typeface designed from a photograph I took of a building on UPenn's campus.
            </p>
        </section>
        <hr />

        <section>
            <ProjectHeading index={10} />
            <p>
                <img src={require("./process-book/preview.png")} />
            </p>
            <p>
                <a href={require("./process-book/process-book.pdf")}>Booklet</a> &mdash; Fall 2012
            </p>
            <p>
                A process book containing sketches and concepts for some early graphic design
                projects. Images are compressed to reduce file size (larger version available upon
                request).
            </p>
        </section>
    </div>
);

export default ProjectsIndexPage;
