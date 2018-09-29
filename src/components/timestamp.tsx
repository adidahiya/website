import * as React from "react";

export interface ITimestampProps {
    date: string;
    small?: boolean;
    style?: React.CSSProperties;
}

export default ({ date, small, style }: ITimestampProps) => (
    <p className="timestamp" style={{ color: "gray", display: "inline-block", ...style }}>
        {small ? <small>({date})</small> : date}
    </p>
);
