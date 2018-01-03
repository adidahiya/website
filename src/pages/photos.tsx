import Link from "gatsby-link";
import * as React from "react";

import * as styles from "./photos.module.css";

// TODO: DRY
// TODO: use GraphQL
const photos = {
    ABSTRACT: [
        {
            href: "https://www.flickr.com/photos/adidas006/8297354527",
            src: "https://farm9.staticflickr.com/8504/8297354527_bfc9ae80f6.jpg",
        },
    ],
    LANDSCAPES: [
        {
            href: "https://www.flickr.com/photos/adidas006/24599057457",
            src: "https://farm5.staticflickr.com/4641/24599057457_0f2e424a9b_z.jpg",
        },
        {
            href: "https://www.flickr.com/photos/adidas006/39466014101",
            src: "https://farm5.staticflickr.com/4594/39466014101_57f1308b81_z.jpg",
        },
    ],
    PEOPLE: [],
};

const PhotosPage = () => (
    <div className={styles.photos}>
        <h2>selected photographs</h2>
        <p>
            I take photos for fun&mdash;usually to capture &amp; document beauty on my travels, but also sometimes
            simply as visual expression through a medium I've become comfortable with over the years. <br /> <br />
            See more on <a href="https://www.flickr.com/photos/adidas006">flickr</a> &rarr;
        </p>
        <h3>abstract</h3>
        <p>
            {photos.ABSTRACT.map((p, key) => (
                <a href={p.href} key={key}>
                    <img src={p.src} />
                </a>
            ))}
            <a href="https://www.flickr.com/photos/adidas006/8060485346">
                <img src="https://farm9.staticflickr.com/8174/8060485346_0585260087.jpg" />
            </a>
            <a href="https://www.flickr.com/photos/adidas006/8298424994">
                <img src="https://farm9.staticflickr.com/8492/8298424994_6fdde562ab.jpg" />
            </a>
            <a href="https://www.flickr.com/photos/adidas006/6586272521">
                <img src="https://farm8.staticflickr.com/7154/6586272521_cdc7f0ca95.jpg" />
            </a>
        </p>
        <h3>landscapes, nature</h3>
        <p>
            {photos.LANDSCAPES.map((p, key) => (
                <a href={p.href} key={key}>
                    <img src={p.src} />
                </a>
            ))}
            <a href="https://www.flickr.com/photos/adidas006/31518601671">
                <img src="https://farm1.staticflickr.com/645/31518601671_1d108474a2_z.jpg" />
            </a>
            <a href="https://www.flickr.com/photos/adidas006/24558540011">
                <img src="https://farm2.staticflickr.com/1597/24558540011_2c1f30e62a_z.jpg" />
            </a>
            <a href="https://www.flickr.com/photos/adidas006/24342430232">
                <img src="https://farm2.staticflickr.com/1544/24342430232_5e836e9871_z.jpg" />
            </a>
            <a href="https://www.flickr.com/photos/adidas006/24367748411">
                <img src="https://farm2.staticflickr.com/1529/24367748411_40c5b84d61_z.jpg" />
            </a>
            <a href="https://www.flickr.com/photos/adidas006/9361406769">
                <img src="https://farm4.staticflickr.com/3813/9361406769_5fbfa50d92.jpg" />
            </a>
            <a href="https://www.flickr.com/photos/adidas006/9361321535">
                <img src="https://farm4.staticflickr.com/3672/9361321535_56a30d028d.jpg" />
            </a>
            <a href="https://www.flickr.com/photos/adidas006/9364094754">
                <img src="https://farm4.staticflickr.com/3768/9364094754_bacfa32061.jpg" />
            </a>
            <a href="https://www.flickr.com/photos/adidas006/8020495995">
                <img src="https://farm9.staticflickr.com/8177/8020495995_11db1bcf9c.jpg" />
            </a>
        </p>
        <h3>people</h3>
        <p>
            {photos.PEOPLE.map((p, key) => (
                <a href={p.href} key={key}>
                    <img src={p.src} />
                </a>
            ))}
            <a href="https://www.flickr.com/photos/adidas006/31064456304">
                <img src="https://farm1.staticflickr.com/417/31064456304_eecdabb8c5_z.jpg" />
            </a>
            <a href="https://www.flickr.com/photos/adidas006/9361312375">
                <img src="https://farm3.staticflickr.com/2823/9361312375_0795cde5f1.jpg" />
            </a>
            <a href="https://www.flickr.com/photos/adidas006/8781888899">
                <img src="https://farm3.staticflickr.com/2813/8781888899_31cf287f1c.jpg" />
            </a>
            <a href="https://www.flickr.com/photos/adidas006/13492374243">
                <img src="https://farm4.staticflickr.com/3666/13492374243_4f9dbb77b0_z.jpg" />
            </a>
            <a href="https://www.flickr.com/photos/adidas006/11019290125">
                <img src="https://farm6.staticflickr.com/5538/11019290125_8396036a9e_z.jpg" />
            </a>
        </p>
    </div>
);

export default PhotosPage;
