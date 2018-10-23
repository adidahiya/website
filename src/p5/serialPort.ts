import * as p5 from "p5";

// tslint:disable no-console

export default class SerialPort {
    private bufferSize = 1;
    private serialBuffer = [];
    private serialConnected = false;
    private serialport;
    private serialoptions;
    private emitQueue = [];
    private clientData = {};
    private serialportList = [];
    private socket: WebSocket;

    // callbacks
    private openCallback;
    private dataCallback;
    private closeCallback;
    private errorCallback?: (message: string) => void;
    private listCallback;
    private connectedCallback;
    private rawDataCallback;
    private registerCallback;

    constructor(private hostname: string = "localhost", private serverport: number = 8081) {
        try {
            const socketUri = `wss://${this.hostname}:${this.serverport}`;
            this.socket = new WebSocket(socketUri);
            console.log(socketUri);
        } catch (err) {
            if (this.errorCallback != null) {
                this.errorCallback("Couldn't connect to the server, is it running?");
            }
        }

        this.socket.onopen = event => {
            console.log("opened socket");
            this.serialConnected = true;

            if (this.connectedCallback != null) {
                this.connectedCallback();
            }

            if (this.emitQueue.length > 0) {
                for (const message of this.emitQueue) {
                    this.emit(message);
                }
                this.emitQueue = [];
            }
        };
    }

    private emit(message: string) {
        // TODO
    }
}
