import { Button, FormGroup, InputGroup, type Intent } from "@blueprintjs/core";
import React from "react";

import { fetchNetlifyFunction } from "../../../common";
import { DefaultLayoutWithoutHeader as Layout } from "../../../components";

interface State {
    message: string;
    formState: Intent | undefined;
}

// eslint-disable-next-line @typescript-eslint/ban-types
export default class extends React.PureComponent<{}, State> {
    public state: State = {
        message: "",
        formState: undefined,
    };

    public render() {
        const { formState } = this.state;

        // TODO: use GET /.netlify/functions/isAdiWalking to determine boolean state
        return (
            <Layout title="walking ritual">
                <h3>adi is walking around.</h3>
                <br />
                <p>
                    <em>current location</em>: washington square park.
                </p>
                <p>
                    <em>seeking</em>: inspiration for things to do/see/hear/touch/smell right now
                    which may aid him on his creative journey.
                </p>
                <form>
                    <FormGroup>
                        <InputGroup
                            intent={formState}
                            large={true}
                            rightElement={
                                <Button
                                    minimal={true}
                                    icon="arrow-right"
                                    onClick={this.handleSubmit}
                                />
                            }
                            onChange={this.handleMessageChange}
                            placeholder="send him an anonymous message"
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

    private handleSubmit = async () => {
        const { message } = this.state;
        if (message == null) {
            return;
        }

        try {
            await fetchNetlifyFunction("sendAdiMessage", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message }),
            });
            this.setState({
                formState: "success",
            });
        } catch (e) {
            this.setState({
                formState: "danger",
            });
        }
    };
}
