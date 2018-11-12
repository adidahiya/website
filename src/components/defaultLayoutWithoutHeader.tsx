import { Location as LocationProvider } from "@reach/router";
import React from "react";
import { initGoogleAnalytics } from "../common";
import { DefaultLayoutHelmet } from "./defaultLayout";
import styles from "./defaultLayout.module.css";

interface IProps {
    className?: string;
    title?: string;
}

export default class extends React.Component<IProps> {
    public componentDidMount() {
        initGoogleAnalytics(window.location);
    }

    public render() {
        const { className, title } = this.props;
        return (
            <LocationProvider>
                {({ location }) => {
                    return (
                        <div className={className}>
                            <DefaultLayoutHelmet location={location} title={title} />
                            <div className={styles.body}>{this.props.children}</div>
                        </div>
                    );
                }}
            </LocationProvider>
        );
    }
}
