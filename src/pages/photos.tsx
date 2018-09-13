import React from "react";

import styles from "./photos.module.css";

const FlickrImg = ({ href, src }: { href: string; src: string }) => (
    <a className={styles.linkNoDecoration} href={href}>
        <img src={src} />
    </a>
);

const PhotosPage = () => (
    <div className={styles.photos}>
        <h2>selected photographs</h2>
        <p>
            I take photos for fun&mdash;usually to capture &amp; document beauty on my travels, but
            also sometimes simply as visual expression. <br /> <br />
            See more on <a href="https://www.flickr.com/photos/adidas006">flickr</a> &rarr;
        </p>
        <h3>abstract</h3>
        <p>
            {[
                {
                    href: "https://www.flickr.com/photos/adidas006/8297354527",
                    src: "https://farm9.staticflickr.com/8504/8297354527_bfc9ae80f6.jpg",
                },
                {
                    href: "https://www.flickr.com/photos/adidas006/8060485346",
                    src: "https://farm9.staticflickr.com/8174/8060485346_0585260087.jpg",
                },
                {
                    href: "https://www.flickr.com/photos/adidas006/8298424994",
                    src: "https://farm9.staticflickr.com/8492/8298424994_6fdde562ab.jpg",
                },
                {
                    href: "https://www.flickr.com/photos/adidas006/6586272521",
                    src: "https://farm8.staticflickr.com/7154/6586272521_cdc7f0ca95.jpg",
                },
            ].map((p, key) => <FlickrImg {...p} key={key} />)}
        </p>

        <h3>landscapes, nature</h3>
        <p>
            {[
                {
                    href: "https://www.flickr.com/photos/adidas006/24599057457",
                    src: "https://farm5.staticflickr.com/4641/24599057457_0f2e424a9b_z.jpg",
                },
                {
                    href: "https://www.flickr.com/photos/adidas006/39466014101",
                    src: "https://farm5.staticflickr.com/4594/39466014101_57f1308b81_z.jpg",
                },
                {
                    href: "https://www.flickr.com/photos/adidas006/31518601671",
                    src: "https://farm1.staticflickr.com/645/31518601671_1d108474a2_z.jpg",
                },
                {
                    href: "https://www.flickr.com/photos/adidas006/24558540011",
                    src: "https://farm2.staticflickr.com/1597/24558540011_2c1f30e62a_z.jpg",
                },
                {
                    href: "https://www.flickr.com/photos/adidas006/24342430232",
                    src: "https://farm2.staticflickr.com/1544/24342430232_5e836e9871_z.jpg",
                },
                {
                    href: "https://www.flickr.com/photos/adidas006/24367748411",
                    src: "https://farm2.staticflickr.com/1529/24367748411_40c5b84d61_z.jpg",
                },
                {
                    href: "https://www.flickr.com/photos/adidas006/9361406769",
                    src: "https://farm4.staticflickr.com/3813/9361406769_5fbfa50d92.jpg",
                },
                {
                    href: "https://www.flickr.com/photos/adidas006/9361321535",
                    src: "https://farm4.staticflickr.com/3672/9361321535_56a30d028d.jpg",
                },
                {
                    href: "https://www.flickr.com/photos/adidas006/9364094754",
                    src: "https://farm4.staticflickr.com/3768/9364094754_bacfa32061.jpg",
                },
                {
                    href: "https://www.flickr.com/photos/adidas006/8020495995",
                    src: "https://farm9.staticflickr.com/8177/8020495995_11db1bcf9c.jpg",
                },
            ].map((p, key) => <FlickrImg {...p} key={key} />)}
        </p>
        <h3>people</h3>
        <p>
            {[
                {
                    href: "https://www.flickr.com/photos/adidas006/31064456304",
                    src: "https://farm1.staticflickr.com/417/31064456304_eecdabb8c5_z.jpg",
                },
                {
                    href: "https://www.flickr.com/photos/adidas006/9361312375",
                    src: "https://farm3.staticflickr.com/2823/9361312375_0795cde5f1.jpg",
                },
                {
                    href: "https://www.flickr.com/photos/adidas006/8781888899",
                    src: "https://farm3.staticflickr.com/2813/8781888899_31cf287f1c.jpg",
                },
                {
                    href: "https://www.flickr.com/photos/adidas006/13492374243",
                    src: "https://farm4.staticflickr.com/3666/13492374243_4f9dbb77b0_z.jpg",
                },
                {
                    href: "https://www.flickr.com/photos/adidas006/11019290125",
                    src: "https://farm6.staticflickr.com/5538/11019290125_8396036a9e_z.jpg",
                },
            ].map((p, key) => <FlickrImg {...p} key={key} />)}
        </p>
    </div>
);

export default PhotosPage;
