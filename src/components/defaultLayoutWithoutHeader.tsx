import { Location as LocationProvider } from "@reach/router";
import React from "react";
import { initGoogleAnalytics } from "../common";
import { DefaultLayoutHelmet } from "./defaultLayout";
import styles from "./defaultLayout.module.css";

export default class extends React.Component {
    public componentDidMount() {
        initGoogleAnalytics(window.location);
    }

    public render() {
        return (
            <LocationProvider>
                {({ location }) => {
                    return (
                        <>
                            <DefaultLayoutHelmet location={location} />
                            <div className={styles.body}>{this.props.children}</div>
                        </>
                    );
                }}
            </LocationProvider>
        );
    }
}
