import { Location as LocationProvider } from "@reach/router";
import React from "react";

import { DefaultLayoutHelmet } from "./defaultLayout";
import * as styles from "./defaultLayout.module.css";

interface Props {
    children?: React.ReactNode;

    /** Page title */
    title?: string;

    /** Additional scripts to load from the web. Use this sparingly... */
    remoteScripts?: Array<Pick<React.ScriptHTMLAttributes<HTMLScriptElement>, "src" | "async">>;
}

export default class extends React.Component<Props> {
    public render() {
        const { remoteScripts, title } = this.props;
        return (
            <LocationProvider>
                {({ location }) => {
                    return (
                        <>
                            <DefaultLayoutHelmet
                                location={location}
                                title={title}
                                remoteScripts={remoteScripts}
                            />
                            <div className={styles.body}>{this.props.children}</div>
                        </>
                    );
                }}
            </LocationProvider>
        );
    }
}
