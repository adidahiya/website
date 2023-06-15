import * as React from "react";
import * as styles from "./timestamp.module.css";

export interface ITimestampProps {
    date: string;
    small?: boolean;
    style?: React.CSSProperties;
}

export default ({ date, small, style }: ITimestampProps) => (
    <p className={styles.timestamp} style={style}>
        {small ? <small>({date})</small> : date}
    </p>
);
