// import * as p5 from "p5";

// tslint:disable no-console

export interface ISerialOptions {
    baudrate?: number;
}

export default class SerialPort {
    private bufferSize = 1;
    private serialBuffer: any[] = [];
    private serialConnected = false;
    private serialport?: string;
    private serialoptions!: ISerialOptions;
    private emitQueue: any[] = [];
    // @ts-ignore
    private clientData: any = {};
    private serialportList: string[] = [];
    private socket!: WebSocket;

    // callbacks
    private openCallback?: () => void;
    private dataCallback?: () => void;
    private closeCallback?: () => void;
    private errorCallback?: (message?: string) => void;
    private listCallback?: (data: string[]) => void;
    private connectedCallback?: () => void;
    private rawDataCallback?: (data: any) => void;
    private registerCallback?: (data: any) => void;

    constructor(private hostname: string = "localhost", private serverport: number = 8081) {
        try {
            const socketUri = `wss://${this.hostname}:${this.serverport}`;
            this.socket = new WebSocket(socketUri);
            console.log(socketUri);
        } catch (err) {
            if (this.errorCallback != null) {
                this.errorCallback("Couldn't connect to the server, is it running?");
            }
            return;
        }

        this.socket.onopen = _event => {
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

        this.socket.onmessage = event => {
            const messageObject = JSON.parse(event.data);
            // MESSAGE ROUTING
            if (messageObject.method !== undefined) {
                if (messageObject.method === "echo") {
                    // no op
                } else if (messageObject.method === "openserial") {
                    if (this.openCallback !== undefined) {
                        this.openCallback();
                    }
                } else if (messageObject.method === "data") {
                    // Add to buffer, assuming this comes in byte by byte
                    this.serialBuffer.push(messageObject.data);
                    if (this.dataCallback !== undefined) {
                        // Hand it to sketch
                        if (this.serialBuffer.length >= this.bufferSize) {
                            this.dataCallback();
                        }
                    }
                    if (this.rawDataCallback !== undefined) {
                        this.rawDataCallback(messageObject.data);
                    }
                } else if (messageObject.method === "list") {
                    this.serialportList = messageObject.data;
                    if (this.listCallback !== undefined) {
                        this.listCallback(messageObject.data);
                    }
                } else if (messageObject.method === "registerClient") {
                    this.clientData = messageObject.data;
                    if (this.registerCallback !== undefined) {
                        this.registerCallback(messageObject.data);
                    }
                } else if (messageObject.method === "close") {
                    if (this.closeCallback !== undefined) {
                        this.closeCallback();
                    }
                } else if (messageObject.method === "write") {
                    // Success Callback?
                } else if (messageObject.method === "error") {
                    // console.log(messageObject.data);
                    if (this.errorCallback !== undefined) {
                        this.errorCallback(messageObject.data);
                    }
                } else {
                    // Got message from server without known method
                    console.log("Unknown Method: " + messageObject);
                }
            } else {
                console.log("Method Undefined: " + messageObject);
            }
        };

        this.socket.onclose = _event => {
            if (this.closeCallback !== undefined) {
                this.closeCallback();
            }
        };

        this.socket.onerror = _event => {
            if (this.errorCallback !== undefined) {
                this.errorCallback();
            }
        };
    }

    private emit(data: object) {
        if (this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(data));
        } else {
            this.emitQueue.push(data);
        }
    }

    /**
     * Tells you whether p5 is connected to the serial port.
     */
    public isConnected(): boolean {
        return this.serialConnected;
    }

    /**
     * Lists serial ports available to the server.
     * Synchronously returns cached list, asynchronously returns updated list via callback.
     * Must be called within the p5 setup() function.
     * Doesn't work with the p5 editor's "Run in Browser" mode.
     */
    public list(cb: (data: string[]) => void): string[] {
        if (typeof cb === "function") {
            this.listCallback = cb;
        }
        this.emit({
            method: "list",
            data: {},
        });
        return this.serialportList;
    }

    /**
     * Opens the serial port to enable data flow.
     * Use the serialOptions parameter to set the baudrate if it's different from the p5 default, 9600.
     *
     * @param serialPort Name of the serial port, something like '/dev/cu.usbmodem1411'
     * @param serialOptions Object with optional options as {key: value} pairs.
     * @param serialCallback Callback function when open completes
     */
    public open(serialPort: string, serialOptions: ISerialOptions, serialCallback: () => void) {
        if (typeof serialCallback === "function") {
            this.openCallback = serialCallback;
        }

        this.serialport = serialPort;

        if (typeof serialOptions === "object") {
            this.serialoptions = serialOptions;
        } else {
            // console.log("typeof _serialoptions " + typeof _serialoptions + " setting to {}");
            this.serialoptions = {};
        }
        // If our socket is connected, we'll do this now,
        // otherwise it will happen in the socket.onopen callback
        this.emit({
            method: "openserial",
            data: {
                serialport: this.serialport,
                serialoptions: this.serialoptions,
            },
        });
    }

    /**
     * Sends a byte to a webSocket server which sends the same byte out through a serial port.
     */
    public write(data: string | number | string[] | number[]) {
        // Writes bytes, chars, ints, bytes[], Strings to the serial port
        let toWrite = null;
        if (typeof data === "number") {
            // This is the only one I am treating differently, the rest of the clauses are meaningless
            toWrite = [data];
        } else if (typeof data === "string") {
            toWrite = data;
        } else if (Array.isArray(data)) {
            toWrite = data;
        } else {
            toWrite = data;
        }

        this.emit({
            method: "write",
            data: toWrite,
        });
    }
}
