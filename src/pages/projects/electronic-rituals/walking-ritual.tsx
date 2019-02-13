import { Button, FormGroup, InputGroup } from "@blueprintjs/core";
import React from "react";
import { DefaultLayoutWithoutHeader as Layout } from "../../../components";

export default class extends React.PureComponent {
    public state = {
        message: "",
    };

    public render() {
        // TODO: use GET /.netlify/functions/isAdiWalking to determine boolean state
        return (
            <Layout title="walking ritual">
                <h3>adi is currently walking around.</h3>
                <br />
                <form>
                    <FormGroup>
                        <InputGroup
                            large={true}
                            rightElement={
                                <Button
                                    minimal={true}
                                    icon="arrow-right"
                                    onClick={this.handleSubmit}
                                />
                            }
                            onChange={this.handleMessageChange}
                            placeholder="send him a message"
                            value={this.state.message}
                        />
                    </FormGroup>
                </form>
            </Layout>
        );
    }

    private handleMessageChange = (evt: React.FormEvent<HTMLInputElement>) => {
        this.setState({
            message: evt.currentTarget.value,
        });
    };

    private handleSubmit = () => {
        const { message } = this.state;
        if (message == null) {
            return;
        }

        fetch("/.netlify/functions/sendAdiMessage", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message }),
        });
    };
}
