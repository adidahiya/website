import { Button, EditableText, FormGroup } from "@blueprintjs/core";
import React from "react";
import { DefaultLayoutWithoutHeader } from "../../../components";
import styles from "./automatic-writing.module.css";
import encouragingWords from "./corpora/encouraging_words.json";

interface IState {
    hasStarted: boolean;
    timerSeconds: number;
    motivationText: string;
}

export default class extends React.PureComponent<{}, IState> {
    public state: IState = {
        hasStarted: false,
        timerSeconds: 180,
        motivationText: "keep going!",
    };

    private timerId: number | undefined = undefined;

    public render() {
        const { motivationText, hasStarted, timerSeconds } = this.state;

        return (
            <DefaultLayoutWithoutHeader>
                <h3>automatic writer</h3>
                <p>~~tap into your subconscious for three minutes~~</p>
                <FormGroup>
                    <Button
                        text={hasStarted ? "Write!" : "Start"}
                        intent={hasStarted ? "none" : "success"}
                        disabled={hasStarted}
                        onClick={this.handleStartButtonClick}
                    />
                </FormGroup>
                <p>
                    {timerSeconds} seconds left ... {motivationText}
                </p>
                <EditableText className={styles.editableText} onChange={this.handleTextChange} />
                <div />
            </DefaultLayoutWithoutHeader>
        );
    }

    private handleStartButtonClick = () => {
        this.setState({
            hasStarted: true,
        });

        this.timerId = window.setInterval(() => {
            const { timerSeconds } = this.state;
            if (timerSeconds === 0) {
                clearTimeout(this.timerId);
                return;
            } else {
                this.setState({
                    timerSeconds: timerSeconds - 1,
                });
            }
        }, 1000);
    };

    private handleTextChange = () => {
        console.log("blah");
    };
}
