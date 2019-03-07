declare module "tone" {
    class Tone {
        constructor();
        public readonly context: Tone.Context;
        /**
         * Recieve the input from the desired channelName to the input
         * @param channelName A named channel to send the signal to.
         * @param channelNumber The channel to connect to
         */
        public receive(channelName: string, channelNumber?: number): this;
        /**
         * Send this signal to the channel name.
         * @param channelName A named channel to send the signal to.
         * @param amount The amount of the source to send to the bus.
         * @returns The gain node which connects this node to the desired channel. Can be used to adjust the levels of the send.
         */
        public send(channelName: string, amount: Tone.Types.Decibels): GainNode;
        /**
         * Convert a frequency representation into a number.
         */
        public toFrequency(freq: Tone.Frequency): Tone.Types.Hertz;
        /**
         * Convert Time into seconds. Unlike the method which it overrides, this takes into account transporttime and musical notation. Time : 1.40 Notation: 4n or 1m or 2t Now Relative: +3n Math: 3n+16n or even complicated expressions ((3n*2)/6 + 1)
         */
        public toSeconds(time: Tone.Time): Tone.Types.Seconds;
        /**
         * Convert a time representation into ticks.
         */
        public toTicks(time: Tone.Time): Tone.Types.Ticks;
        /**
         * Generate a buffer by rendering all of the Tone.js code within the callback using the OfflineAudioContext. The OfflineAudioContext is capable of rendering much faster than real time in many cases. The callback function also passes in an offline instance of Tone.Transport which can be used to schedule events along the Transport. NOTE OfflineAudioContext has the same restrictions as the AudioContext in that on certain platforms (like iOS) it must be invoked by an explicit user action like a click or tap.
         * @param callback All Tone.js nodes which are created and scheduled within this callback are recorded into the output Buffer.
         * @param duration the amount of time to record for.
         */
        public static Offline(callback: Function, duration: Tone.Time): Promise<Tone.Buffer>;
        /**
         * connect together all of the arguments in series
         */
        public static connectSeries(nodes: AudioParam | Tone | AudioNode): Tone;
        /**
         * Convert decibels into gain.
         */
        public static dbToGain(db: Tone.Types.Decibels): number;
        /**
         * If the given parameter is undefined, use the fallback. If both given and fallback are object literals, it will return a deep copy which includes all of the parameters from both objects. If a parameter is undefined in given, it will return the fallback property.
         * WARNING: if object is self referential, it will go into an an infinite recursive loop.
         */
        public static defaultArg(given: any, fallback: any): any;
        /**
         * TODO: narrower type definition using generics
         * @param values The arguments array
         * @param keys The names of the arguments
         * @param constr The class constructor
         * @returns An object composed of the defaults between the class’ defaults and the passed in arguments.
         */
        public static defaults(values: any[], keys: string[], constr: Function | Object): Object;
        /**
         * Equal power gain scale. Good for cross-fading.
         * @param percent (0-1)
         * @returns output gain (0-1)
         */
        public static equalPowerScale(percent: Tone.Types.NormalRange): number;
        /**
         * have a child inherit all of Tone’s (or a parent’s) prototype to inherit the parent’s properties, make sure to call Parent.call(this) in the child’s constructor based on closure library’s inherit function
         * @param parent (optional) parent to inherit from if no parent is supplied, the child will inherit from Tone
         */
        public static extend(child: Function, parent?: Function): void;
        /**
         * Convert gain to decibels.
         * @param gain (0-1)
         */
        public static gainToDb(gain: number): Tone.Types.Decibels;
        /**
         * Convert an interval (in semitones) to a frequency ratio.
         * @param interval the number of semitones above the base note
         * @returns the frequency ratio
         */
        public static intervalToFrequencyRatio(interval: Tone.Types.Interval): number;
        /**
         * Test if the argument is an Array
         */
        public static isArray(arg: any): boolean;
        /**
         * Test if the argument is a boolean.
         */
        public static isBoolean(arg: any): boolean;
        /**
         * Test if the argument is not undefined.
         */
        public static isDefined(arg: any): boolean;
        /**
         * Test if the argument is a function.
         */
        public static isFunction(arg: any): boolean;
        /**
         * Test if the argument is in the form of a note in scientific pitch notation. e.g. “C4”
         */
        public static isNote(arg: any): boolean;
        /**
         * Test if the argument is a number.
         */
        public static isNumber(arg: any): boolean;
        /**
         * Test if the argument is an object literatl (i.e. {})
         */
        public static isObject(arg: any): boolean;
        /**
         * Test if the argument is a string
         */
        public static isString(arg: any): boolean;
        /**
         * Test if the argument is undefined
         */
        public static isUndef(arg: any): boolean;
        /**
         * Returns a Promise which resolves when all of the buffers have loaded
         */
        public static loaded(): Promise<void>;
        /**
         * Return the current time of the AudioContext clock.
         */
        public static now(): number;
        /**
         * Global transport object
         */
        public static Transport: Tone.TransportSingleton;
        /**
         * Global Draw singleton
         */
        public static Draw: Tone.DrawSingleton;
        public static context: {
            latencyHint: "interactive" | "playback" | "balanced" | "fastest";
        };
    }

    namespace Tone {
        /**
         * ========================================================
         * Type
         * ========================================================
         */

        const Type: {
            AudioRange: "audioRange";
            BPM: "bpm";
            BarsBeatsSixteenths: "barsBeatsSixteenths";
            Cents: "cents";
            Decibels: "db";
            Default: "number";
            Degrees: "degrees";
            Frequency: "frequency";
            Gain: "gain";
            Hertz: "hertz";
            Interval: "interval";
            MIDI: "midi";
            Milliseconds: "milliseconds";
            NormalRange: "normalRange";
            Notation: "notation";
            Note: "note";
            Positive: "positive";
            Samples: "samples";
            Seconds: "seconds";
            Ticks: "ticks";
            Time: "time";
            TransportTime: "transportTime";
        };

        /**
         * Primitive types are contained in this namespace so that they don't clash with the classes of the same name in Tone.js
         * For example, a Tone.Frequency is a complex object which can be constructed, but a Types.Frequency type is a primitive
         * type of value which is accepted as an argument or returned as a result in many Tone.js functions. Both are useful.
         */
        namespace Types {
            /**
             * Gain is the ratio between input and output of a signal. A gain of 0 is the same as silencing the signal. A gain of 1, causes no change to the incoming signal.
             */
            type Gain = number;
            /**
             * Default units
             */
            type Default = any;
            /**
             * A colon-separated representation of time in the form of Bars:Beats:Sixteenths.
             */
            type BarsBeatsSixteenth = string;
            /**
             * A cent is a hundredth of a semitone.
             */
            type Cents = number;
            /**
             * Beats per minute.
             */
            type BPM = number;
            /**
             * Decibels are a logarithmic unit of measurement which is useful for volume because of the logarithmic way that we perceive loudness. 0 decibels means no change in volume. -10db is approximately half as loud and 10db is twice is loud.
             */
            type Decibels = number;
            /**
             * AudioRange values are between [-1, 1].
             */
            type AudioRange = number;
            /**
             * A number representing a midi note.
             */
            type MIDI = number;
            /**
             * Normal values are within the range [0, 1].
             */
            type NormalRange = number;
            /**
             * One millisecond is a thousandth of a second.
             */
            type Milliseconds = number;
            /**
             * Hertz are a frequency representation defined as one cycle per second.
             */
            type Hertz = number;
            /**
             * Frequency can be described similar to time, except ultimately the values are converted to frequency instead of seconds. A number is taken literally as the value in hertz. Additionally any of the Time encodings can be used. Note names in the form of NOTE OCTAVE (i.e. C4) are also accepted and converted to their frequency value.
             */
            type Frequency = number | string;
            /**
             * Half-step note increments, i.e. 12 is an octave above the root. and 1 is a half-step up.
             */
            type Interval = number;
            /**
             * Angle between 0 and 360.
             */
            type Degrees = number;
            /**
             * A string representing a duration relative to a measure. * “4n” = quarter note * “2m” = two measures * “8t” = eighth-note triplet
             */
            type Notation = string;
            /**
             * A frequency represented by a letter name, accidental and octave. This system is known as Scientific Pitch Notation.
             * @see https://en.wikipedia.org/wiki/Scientific_pitch_notation
             */
            type Note = string;
            /**
             * The value must be greater than or equal to 0.
             */
            type Positive = number;
            /**
             * Sampling is the reduction of a continuous signal to a discrete signal. Audio is typically sampled 44100 times per second.
             */
            type Samples = number;
            /**
             * Seconds are the time unit of the AudioContext. In the end, all values need to be evaluated to seconds.
             */
            type Seconds = number;
            /**
             * Ticks are the basic subunit of the Transport. They are the smallest unit of time that the Transport supports.
             */
            type Ticks = number;
            /**
             * Time can be described in a number of ways.
             * - Numbers, which will be taken literally as the time (in seconds).
             * - Notation, (“4n”, “8t”) describes time in BPM and time signature relative values.
             * - TransportTime, (“4:3:2”) will also provide tempo and time signature relative times in the form BARS:QUARTERS:SIXTEENTHS.
             * - Frequency, (“8hz”) is converted to the length of the cycle in seconds.
             * - Now-Relative, (“+1”) prefix any of the above with “+” and it will be interpreted as “the current time plus whatever expression follows”.
             * - Expressions, (“3:0 + 2 - (1m / 7)”) any of the above can also be combined into a mathematical expression which will be evaluated to compute the desired time.
             * - No Argument, for methods which accept time, no argument will be interpreted as “now” (i.e. the currentTime).
             * @see https://github.com/Tonejs/Tone.js/wiki/Time
             */
            type Time = string | number;
            /**
             * TransportTime describes a position along the Transport’s timeline. It is similar to Time in that it uses all the same encodings, but TransportTime specifically pertains to the Transport’s timeline, which is startable, stoppable, loopable, and seekable.
             * @see https://github.com/Tonejs/Tone.js/wiki/TransportTime
             */
            type TransportTime = string | number;

            type CtrlPattern = string;

            /**
             * Playback state of an audio source
             */
            type PlaybackState = "started" | "stopped";
        }

        type FilterRolloff = -12 | -24 | -48 | -96;
        type FilterType = "lowpass" | "highpass" | "bandpass" | "lowshelf" | "highshelf" | "notch" | "allpass" | "peaking";

        // TODO: complete definition
        class TimeBase extends Tone {
            constructor(val: string | number, units?: string);
            public toMilliseconds(): Types.Milliseconds;
        }

        // TODO: complete definition
        class Time extends TimeBase {
            /**
             * Return the time encoded as Bars:Beats:Sixteenths.
             */
            public toBarsBeatsSixteenths(): Types.BarsBeatsSixteenth;
        }

        // TODO: complete definition
        class Frequency extends TimeBase {
            /**
             * Takes an array of semitone intervals and returns an array of frequencies transposed by those intervals.
             */
            public harmonize(intervals: number[]): Frequency[];
            /**
             * Transposes the frequency by the given number of semitones.
             */
            public transpose(semitones: number): Types.Frequency;
            /**
             * Return the value of the frequency in Scientific Pitch Notation
             */
            public toNote(): Types.Note;
        }

        /**
         * ========================================================
         * Core
         * ========================================================
         */

        class Emitter extends Tone {
            constructor();
            public dispose(): this;
            public emit(event: string, ...args: any[]): this;
            public off(event: string, callback: Function): this;
            public on(event: string, callback: Function): this;
            public once(event: string, callback: Function): this;
            public static mixin(obj: Object | Function): Emitter;
        }

        class Context extends Emitter {
            constructor(context?: AudioContext);
            /**
             * What the source of the clock is, either “worker” (Web Worker [default]), “timeout” (setTimeout), or “offline” (none).
             */
            public clockSource: string;
            /**
             * The type of playback, which affects tradeoffs between audio output latency and responsiveness. In addition to setting the value in seconds, the latencyHint also accepts the strings “interactive” (prioritizes low latency), “playback” (prioritizes sustained playback), “balanced” (balances latency and performance), and “fastest” (lowest latency, might glitch more often).
             */
            public latencyHint: string | number;
            /**
             * The amount of time events are scheduled into the future
             */
            public lookAhead: number;
            /**
             * How often the Web Worker callback is invoked. This number corresponds to how responsive the scheduling can be. Context.updateInterval + Context.lookAhead gives you the total latency between scheduling an event and hearing it.
             */
            public updateInterval: number;
            /**
             * Clears a previously scheduled timeout with Tone.context.setTimeout
             */
            public clearTimeout(id: number): this;
            /**
             * Promise which is invoked when the context is running. Tries to resume the context if it’s not started.
             */
            public close(): Promise<void>;
            public createConstantSource(): any;
            public createStereoPanner(): any;
            /**
             * Unlike other dispose methods, this returns a Promise which executes when the context is closed and disposed
             */
            // @ts-ignore
            public dispose(): Promise<this>;
            /**
             * Generate a looped buffer at some constant value.
             */
            public getConstant(val: number): AudioBufferSourceNode;
            /**
             * The current audio context time
             */
            public now(): number;
            /**
             * Promise which is invoked when the context is running. Tries to resume the context if it’s not started.
             */
            public read(): Promise<void>;
            /**
             * A setTimeout which is gaurenteed by the clock source. Also runs in the offline context.
             */
            public setTimeout(fn: Function, timeout: number): number;
        }

        class Buffer extends Tone {
            /**
             * @param url The url to load, or the audio buffer to set.
             * @param onload A callback which is invoked after the buffer is loaded. It’s recommended to use Tone.Buffer.on('load', callback) instead since it will give you a callback when all buffers are loaded.
             * @param onerror The callback to invoke if there is an error
             */
            constructor(url: AudioBuffer | string, onload?: Function, onerror?: Function);
            /**
             * The duration of the buffer.
             */
            public readonly duration: number;
            /**
             * The length of the buffer in samples
             */
            public readonly length: number;
            /**
             * If the buffer is loaded or not
             */
            public readonly loaded: boolean;
            /**
             * The number of discrete audio channels. Returns 0 if no buffer is loaded.
             */
            public readonly numberOfChannels: number;
            /**
             * Reverse the buffer.
             */
            public reverse: boolean;
            /**
             * dispose and disconnect
             */
            public dispose(): this;
            /**
             * Set the audio buffer from the array. To create a multichannel AudioBuffer, pass in a multidimensional array.
             * @param array The array to fill the audio buffer
             */
            public fromArray(array: Float32Array): this;
            /**
             * The audio buffer stored in the object.
             */
            public get(): AudioBuffer;
            /**
             * Returns the Float32Array representing the PCM audio data for the specific channel.
             * @param channel The channel number to return
             */
            public getChannelData(channel: number): Float32Array;
            /**
             * Makes an xhr reqest for the selected url then decodes the file as an audio buffer. Invokes the callback once the audio buffer loads.
             * @param url The url of the buffer to load. filetype support depends on the browser.
             */
            public load(url: string): Promise<Tone.Buffer>;
            /**
             * Pass in an AudioBuffer or Tone.Buffer to set the value of this buffer.
             */
            public set(buffer: AudioBuffer | Tone.Buffer): this;
            /**
             * Cut a subsection of the array and return a buffer of the subsection. Does not modify the original buffer
             * @param start The time to start the slice
             * @param end The end time to slice. If none is given will default to the end of the buffer
             */
            public slice(start: Tone.Time, end?: Tone.Time): this;
            /**
             * Get the buffer as an array. Single channel buffers will return a 1-dimensional Float32Array, and multichannel buffers will return multidimensional arrays.
             * @param channel Optionally only copy a single channel from the array.
             */
            public toArray<T>(channel?: number): T[];
            /**
             * Sums muliple channels into 1 channel
             * @param channel Optionally only copy a single channel from the array.
             */
            public toMono<T>(channel?: number): T[];
            /**
             * Stops all of the downloads in progress
             */
            public static cancelDownloads(): Tone.Buffer;
            /**
             * Create a Tone.Buffer from the array. To create a multichannel AudioBuffer, pass in a multidimensional array.
             * @param array The array to fill the audio buffer
             */
            public static fromArray(array: Float32Array): Tone.Buffer;
            /**
             * Creates a Tone.Buffer from a URL, returns a promise which resolves to a Tone.Buffer
             */
            public static fromUrl(url: string): Promise<Tone.Buffer>;
            /**
             * Loads a url using XMLHttpRequest.
             */
            public static load(
                url: string,
                onload: Function,
                onerror: Function,
                onprogress: Function,
            ): XMLHttpRequest;
            /**
             * Checks a url’s extension to see if the current browser can play that file type.
             * @param url The url/extension to test
             */
            public static supportsType(url: string): boolean;
            public static on(event: "load", callback: Function): void;
        }

        class AudioNode extends Tone {
            constructor(context?: AudioContext);
            /**
             * the number of channels used when up-mixing and down-mixing connections to any inputs to the node. The default value is 2 except for specific nodes where its value is specially determined.
             */
            public readonly channelCount: number;
            /**
             * determines how channels will be counted when up-mixing and down-mixing connections to any inputs to the node. The default value is “max”. This attribute has no effect for nodes with no inputs.
             */
            public readonly channelCountMode: string;
            /**
             * determines how individual channels will be treated when up-mixing and down-mixing connections to any inputs to the node. The default value is “speakers”.
             */
            public readonly channelInterpretation: string;
            /**
             * Get the audio context belonging to this instance.
             */
            public readonly context: Context;
            /**
             * The number of inputs feeding into the AudioNode. For source nodes, this will be 0.
             */
            public readonly numberOfInputs: number;
            /**
             * The number of outputs coming out of the AudioNode.
             */
            public readonly numberOfOutputs: number;
            /**
             * connect the output of a ToneNode to an AudioParam, AudioNode, or ToneNode
             */
            public connect(
                unit: Tone | AudioParam | AudioNode,
                outputNum?: number,
                inputNum?: number,
            ): this;
            /**
             * disconnect the output
             * @param output Either the output index to disconnect if the output is an array, or the node to disconnect from.
             */
            public disconnect(output: number | AudioNode): this;
            /**
             * dispose and disconnect
             */
            public dispose(): this;
            /**
             * Connect ‘this’ to the master output. Shorthand for this.connect(Tone.Master)
             */
            public toMaster(): this;
        }

        // TODO: extract outside namespace?
        type valueof<T> = T[keyof T];

        // TODO: complete definition
        class Param<U extends valueof<typeof Type>, V> extends AudioNode {
            constructor(param: AudioParam, units: U, convert: boolean);
            public convert: boolean;
            public units: U;
            public value: V;
        }

        // TODO: complete definition
        class Signal<U extends valueof<typeof Type>, V> extends Param<U, V> {
            public setValueAtTime(value: V, time: Types.Time): this;
            public linearRampToValueAtTime(value: V, time: Types.Time): this;
            public linearRampToValue(value: V): this;
            public exponentialRampToValue(value: V): this;
            public rampTo(value: V): this;
        }

        /**
         * Singleton available on the Tone global, should not be constructed
         */
        class TransportSingleton extends Emitter {
            private constructor();
            /**
             * Pulses Per Quarter note. This is the smallest resolution the Transport timing supports.
             * This should be set once on initialization and not set again.
             * Changing this value after other objects have been created can cause problems.
             */
            public PPQ: number;
            /**
             * The Beats Per Minute of the Transport.
             */
            public bpm: Signal<typeof Type.BPM, Types.BPM>;
            /**
             * If the transport loops or not.
             */
            public loop: boolean;
            /**
             * When the Tone.Transport.loop = true, this is the ending position of the loop.
             */
            public loopEnd?: Types.Time;
            /**
             * When the Tone.Transport.loop = true, this is the starting position of the loop.
             */
            public loopStart?: Types.Time;
            /**
             * The Transport’s position in Bars:Beats:Sixteenths. Setting the value will jump to that position right away.
             */
            public position: Types.BarsBeatsSixteenth;
            /**
             * The Transport’s loop position as a normalized value. Always returns 0 if the transport if loop is not true.
             */
            public progress: Types.NormalRange;
            /**
             * The Transport’s position in seconds Setting the value will jump to that position right away.
             */
            public seconds: Types.Seconds;
            /**
             * Returns the playback state of the source, either “started”, “stopped”, or “paused”
             */
            public readonly state: "started" | "stopped" | "paused";
            /**
             * The swing value. Between 0-1 where 1 equal to the note + half the subdivision.
             */
            public swing: Types.NormalRange;
            /**
             * Set the subdivision which the swing will be applied to. The default value is an 8th note. Value must be less than a quarter note.
             */
            public swingSubdivision: Types.Time;
            /**
             * The transports current tick position.
             */
            public ticks: Types.Ticks;
            /**
             * The time signature as just the numerator over 4. For example 4/4 would be just 4 and 6/8 would be 3.
             */
            public timeSignature: number | number[];
            /**
             * Remove scheduled events from the timeline after the given time. Repeated events will be removed if their startTime is after the given time
             */
            public cancel(after?: Types.TransportTime): this;
            /**
             * Clear the passed in event id from the timeline
             */
            public clear(eventId: number): this;
            /**
             * Return the elapsed seconds at the given time.
             */
            public getSecondsAtTime(time: Types.Time): this;
            /**
             * Get the clock’s ticks at the given time.
             */
            public getTicksAtTime(time: Types.Time): this;
            /**
             * Returns the time aligned to the next subdivision of the Transport. If the Transport is not started, it will return 0.
             * Note: this will not work precisely during tempo ramps.
             */
            public nextSubdivision(subdivision: Types.Time): this;
            /**
             * Pause the transport and all sources synced to the transport.
             */
            public pause(time?: Types.Time): this;
            /**
             * Schedule an event along the timeline.
             * @returns The id of the event which can be used for canceling the event.
             */
            public schedule(callback: Function, time: Types.TransportTime): number;
            /**
             * Schedule an event that will be removed after it is invoked.
             * Note that if the given time is less than the current transport time, the event will be invoked immediately.
             * @returns The ID of the scheduled event.
             */
            public scheduleOnce(callback: Function, time: Types.TransportTime): number;
            /**
             * Schedule a repeated event along the timeline. The event will fire at the interval starting at the startTime and for the specified duration.
             * @returns The ID of the scheduled event. Use this to cancel the event.
             */
            public scheduleRepeat(callback: Function, interval: Types.Time, startTime?: Types.TransportTime, duration?: Types.Time): number;
            /**
             * Set the loop start and stop at the same time.
             */
            public setLoopPoints(startPosition: Types.TransportTime, endPosition: Types.TransportTime): this;
            /**
             * Start the transport and all sources synced to the transport.
             */
            public start(time?: Types.Time, offset?: Types.TransportTime): this;
            /**
             * Stop the transport and all sources synced to the transport.
             */
            public stop(time?: Types.Time): this;
            /**
             * Attaches the signal to the tempo control signal so that any changes in the tempo will change the signal in the same ratio.
             * @param ratio Optionally pass in the ratio between the two signals. Otherwise it will be computed based on their current values.
             */
            public syncSignal(signal: Signal<any, any>, ratio?: number): this;
            /**
             * Toggle the current state of the transport. If it is started, it will stop it, otherwise it will start the Transport.
             */
            public toggle(time?: Types.Time): this;
            /**
             * Unsyncs a previously synced signal from the transport’s control.
             * @see Tone.Transport.syncSignal.
             */
            public unsyncSignal(signal: Signal<any, any>): this;
        }

        /**
         * Global Draw singleton, should not be constructed.
         */
        class DrawSingleton extends Tone {
            private constructor();
            /**
             * The amount of time before the scheduled time that the callback can be invoked. Default is half the time of an animation frame (0.008 seconds).
             */
            public anticipation: number;
            /**
             * The duration after which events are not invoked.
             */
            public expiration: number;
            /**
             * Cancel events scheduled after the given time
             */
            public cancel(time?: Types.Time): this;
            /**
             * Schedule a function at the given time to be invoked on the nearest animation frame.
             */
            public schedule(callback: Function, time: Types.Time): this;
        }

        class Master extends Tone {
            constructor();
            public mute: boolean;
            public volume: Signal<typeof Type.Decibels, Types.Decibels>;
        }

        /**
         * ========================================================
         * Sources
         * ========================================================
         */

        // TODO: complete definition
        class Source extends AudioNode {
            public volume: Signal<typeof Type.Decibels, Types.Decibels>;
            public start(time?: Types.Time): this;
            public stop(time?: Types.Time): this;
            public sync(): this;
            public unsync(): this;
        }

        // TODO: complete definition
        /**
         * Tone.Player is an audio file player with start, loop, and stop functions.
         */
        class Player extends Source {
            constructor(url: string | AudioBuffer, onload?: Function);
            public readonly loaded: boolean;
            public volume: Signal<typeof Type.Decibels, Types.Decibels>;
            public readonly state: Types.PlaybackState;
            /**
             * Load the audio file as an audio buffer.
             * Decodes the audio asynchronously and invokes the callback once the audio buffer loads.
             * Note: this does not need to be called if a url was passed in to the constructor. Only use this if you want to manually load a new url.
             */
            public load(url: string, callback?: Function): void;
            public loop: boolean;
            public loopEnd: Types.Time;
        }

        // TODO: complete definition
        class Players extends AudioNode {
            /**
             * Tone.Players combines multiple Tone.Player objects.
             * @param urls An object mapping a name to a url.
             * @param onload The function to invoke when all buffers are loaded.
             */
            constructor(urls: { [key: string]: string }, onload?: Function);
            public readonly loaded: boolean;
            public get(name: string): Player;
            public volume: Signal<typeof Type.Decibels, Types.Decibels>;
        }

        // TODO: complete definition
        class Oscillator extends Source {
            constructor(frequency?: Types.Frequency, type?: string);
        }

        // TODO: complete definition
        class BufferSource extends AudioNode {
            constructor(buffer: AudioBuffer | Tone.Buffer, onload?: Function);
            public start(time?: Types.Time, offset?: Types.Time, duration?: Types.Time, gain?: Types.Gain, fadeInTime?: Types.Time): this;
            public stop(time?: Types.Time): this;
            public loop: boolean;
            public loopEnd: Types.Time;
            public playbackRate: Signal<typeof Type.Positive, Types.Positive>;
            public fadeIn: Types.Time;
            public fadeOut: Types.Time;
        }

        /**
         * ========================================================
         * Instrument
         * ========================================================
         */

        // TODO: complete definition
        class Instrument extends AudioNode {
            /**
             * Trigger the attack and then the release after the duration.
             * @param note The note to trigger.
             * @param duration How long the note should be held for before triggering the release. This value must be greater than 0.
             * @param time When the note should be triggered.
             * @param velocity The velocity the note should be triggered at.
             */
            public triggerAttackRelease(
                note: Types.Frequency,
                duration: Types.Time,
                time?: Types.Time,
                velocity?: Types.NormalRange,
            ): this;
            /**
             * The volume of the output in decibels.
             */
            public volume: Signal<typeof Type.Decibels, Types.Decibels>;
            /**
             * Sync the instrument to the Transport. All subsequent calls of triggerAttack and triggerRelease will be scheduled along the transport.
             */
            public sync(): this;
            /**
             * Unsync the instrument from the Transport
             */
            public unsync(): this;
        }

        type NoiseType = "white" | "pink" | "brown";

        class Noise extends Source {
            constructor(type: NoiseType);
        }

        /**
         * Tone.OmniOscillator aggregates Tone.Oscillator, Tone.PulseOscillator, Tone.PWMOscillator, Tone.FMOscillator, Tone.AMOscillator, and
         * Tone.FatOscillator into one class. The oscillator class can be changed by setting the type. omniOsc.type = "pwm" will set it to the
         * Tone.PWMOscillator. Prefixing any of the basic types (“sine”, “square4”, etc.) with “fm”, “am”, or “fat” will use the FMOscillator,
         * AMOscillator or FatOscillator respectively. For example: omniOsc.type = "fatsawtooth" will create set the oscillator to a
         * FatOscillator of type “sawtooth”.
         */
        class OmniOscillator extends Source {
            constructor(frequency: Types.Frequency, type: string);
            /**
             * The number of detuned oscillators
             */
            public count: number;
            /**
             * The detune control
             */
            public detune: Signal<typeof Type.Cents, Types.Cents>;
            /**
             * The frequency control
             */
            public frequency: Signal<typeof Type.Frequency, Types.Frequency>;
            /**
             * Harmonicity is the frequency ratio between the carrier and the modulator oscillators.
             * A harmonicity of 1 gives both oscillators the same frequency. Harmonicity = 2 means a change of an octave.
             * @see Tone.AMOscillator
             * @see Tone.FMOscillator
             */
            public harmonicity: Signal<typeof Type.Positive, Types.Positive>;
            /**
             * The modulationFrequency Signal of the oscillator (only if the oscillator type is set to pwm).
             * @see Tone.PWMOscillator
             */
            public modulationFrequency: Signal<typeof Type.Frequency, Types.Frequency>;
            /**
             * The type of the modulator oscillator. Only if the oscillator is set to “am” or “fm” types.
             * @see Tone.AMOscillator
             * @see Tone.FMOscillator
             */
            public modulationType: string;
            /**
             * The partials of the waveform. A partial represents the amplitude at a harmonic.
             * The first harmonic is the fundamental frequency, the second is the octave and so on following the harmonic series.
             * Setting this value will automatically set the type to “custom”. The value is an empty array when the type is not “custom”.
             * This is not available on “pwm” and “pulse” oscillator types.
             */
            public partials: number[];
            /**
             * The phase of the oscillator in degrees.
             */
            public phase: Types.Degrees;
            /**
             * The detune spread between the oscillators. If “count” is set to 3 oscillators and the “spread” is set to 40,
             * the three oscillators would be detuned like this: [-20, 0, 20] for a total detune spread of 40 cents.
             * @see Tone.FatOscillator
             */
            public spread: Types.Cents;
            /**
             * The type of the oscillator. Can be any of the basic types: sine, square, triangle, sawtooth.
             * Or prefix the basic types with “fm”, “am”, or “fat” to use the FMOscillator, AMOscillator or FatOscillator types.
             * The oscillator could also be set to “pwm” or “pulse”. All of the parameters of the oscillator’s class are accessible
             * when the oscillator is set to that type, but throws an error when it’s not.
             */
            public type: string;
            /**
             * The width of the oscillator (only if the oscillator is set to “pulse”)
             */
            public width: Types.NormalRange;
            /**
             * TODO: documentation
             */
            public restart(): this;
        }

        interface MonophonicOptions {
            portamento?: Types.Time;
        }

        interface MonophonicConstructor {
            new (options?: MonophonicOptions): Monophonic;
        }

        /**
         * This is an abstract base class for other monophonic instruments to extend.
         * IMPORTANT: It does not make any sound on its own and shouldn’t be directly instantiated.
         */
        abstract class Monophonic extends Instrument {
            constructor(options?: MonophonicOptions);
            /**
             * The glide time between notes.
             */
            public portamento: Types.Time;
            /**
             * Get the level of the output at the given time. Measures the envelope(s) value at the time.
             */
            public getLevelAtTime(time: Types.Time): Types.NormalRange;
            /**
             * Set the note at the given time. If no time is given, the note will set immediately.
             */
            public setNote(note: Types.Frequency, time?: Types.Time): this;
            /**
             * Trigger the attack of the note optionally with a given velocity.
             */
            public triggerAttack(note: Types.Frequency, time?: Types.Time, velocity?: number): this;
            /**
             * Trigger the release portion of the envelope
             */
            public triggerRelease(time?: Types.Time): this;
        }

        interface OscillatorOptions {
            modulationType?: string;
            type: string;
        }

        interface EnvelopeOptions {
            attack?: Types.Time;
            decay?: Types.Time;
            sustain?: Types.NormalRange;
            release?: Types.NormalRange;
        }

        interface SynthOptions extends MonophonicOptions {
            oscillator?: OscillatorOptions;
            envelope?: EnvelopeOptions;
        }

        /**
         * Tone.Synth is composed simply of a Tone.OmniOscillator routed through a Tone.AmplitudeEnvelope.
         */
        class Synth extends Monophonic {
            constructor(options?: SynthOptions);
            /**
             * The detune control
             */
            public detune: Signal<typeof Type.Cents, Types.Cents>;
            /**
             * The amplitude envelope.
             */
            public envelope: AmplitudeEnvelope;
            /**
             * The frequency control
             */
            public frequency: Signal<typeof Type.Frequency, Types.Frequency>;
            /**
             * The oscillator.
             */
            public oscillator: OmniOscillator;
        }

        interface FilterOptions {
            frequency: Types.Frequency;
            gain?: Types.Gain;
            Q: Types.Positive,
            rolloff: FilterRolloff;
            type: FilterType;
        }

        interface FilterEnvelopeOptions extends EnvelopeOptions {
            baseFrequency: Types.Frequency;
            octaves: number;
            exponent?: number;
        }

        interface MonoSynthOptions extends SynthOptions {
            filter: FilterOptions;
            filterEnvelope: FilterEnvelopeOptions;
        }

        /**
         * Tone.MonoSynth is composed of one oscillator, one filter, and two envelopes.
         * The amplitude of the Tone.Oscillator and the cutoff frequency of the Tone.Filter are controlled by Tone.Envelopes.
         */
        class MonoSynth extends Monophonic {
            constructor(options: MonoSynthOptions);
            public detune: Signal<typeof Type.Cents, Types.Cents>;
            public envelope: AmplitudeEnvelope;
            public filter: Filter;
            public filterEnvelope: FrequencyEnvelope;
            public frequency: Signal<typeof Type.Frequency, Types.Frequency>;
            public oscillator: OmniOscillator;
            public dispose(): this;
        }

        interface NoiseOptions {
            type: NoiseType,
        }

        /**
         * Tone.NoiseSynth is composed of a noise generator (Tone.Noise), one filter (Tone.Filter), and two envelopes (Tone.Envelop).
         * One envelope controls the amplitude of the noise and the other is controls the cutoff frequency of the filter.
         */
        class NoiseSynth extends Instrument {
            constructor(
                options?: {
                    noise: NoiseOptions,
                    envelope: EnvelopeOptions,
                },
            );
        }

        /**
         * Karplus-String string synthesis. Often out of tune. Will change when the AudioWorkerNode is available across browsers.
         */
        class PluckSynth extends Instrument {
            constructor(options?: {
                attackNoise?: number;
                dampening?: Types.Frequency;
                resonance?: Types.NormalRange;
            });
            /**
             * The amount of noise at the attack. Nominal range of [0.1, 20]
             */
            public attackNoise: number;
            /**
             * The dampening control. i.e. the lowpass filter frequency of the comb filter
             */
            public dampening: Signal<typeof Type.Frequency, Types.Frequency>;
            /**
             * The resonance control.
             */
            public resonance: Signal<typeof Type.NormalRange, Types.NormalRange>;
            /**
             * Trigger the note.
             */
            public triggerAttack(note: Types.Frequency, time?: Types.Time): this;
        }

        /**
         * Tone.PolySynth handles voice creation and allocation for any instruments passed in as the second paramter.
         * PolySynth is not a synthesizer by itself, it merely manages voices of one of the other types of synths,
         * allowing any of the monophonic synthesizers to be polyphonic.
         */
        class PolySynth<V extends Monophonic> extends Instrument {
            constructor(polyphony?: number | object, voiceConstructor?: { new (): V });
            /**
             * The detune in cents
             */
            public detune: Signal<typeof Type.Cents, Types.Cents>;
            /**
             * the array of voices
             */
            public voices: V[];
            /**
             * Get the synth’s attributes. Given no arguments get will return all available object properties and their corresponding values. Pass in a single attribute to retrieve or an array of attributes. The attribute strings can also include a “.” to access deeper properties.
             */
            public get(params?: string[]): any[];
            /**
             * Set a member/attribute of the voices.
             */
            public set(params: string | object, value: number, rampTime: Types.Time): this;
            /**
             * Trigger the attack and release after the specified duration
             */
            public triggerAttackRelease(
                notes: Types.Frequency | Types.Frequency[],
                durations: Types.Time | Types.Time[],
                time?: Types.Time,
                velocity?: Types.NormalRange,
            ): this;
            /**
             * Trigger the attack portion of the note
             */
            public triggerAttack(
                notes: Types.Frequency | Types.Frequency[],
                time?: Types.Time,
                velocity?: Types.NormalRange,
            ): this;
            /**
             *  Trigger the release of the note. Unlike monophonic instruments, a note (or array of notes) needs to be passed in as the first argument.
             */
            public triggerRelease(
                notes: Types.Frequency | Types.Frequency[],
                time?: Types.Time,
            ): this;
            /**
             * Trigger the release portion of all the currently active voices.
             */
            public releaseAll(): this;
        }

        /**
         * ========================================================
         * Effect
         * ========================================================
         */

        // TODO: complete definition
        class Effect extends AudioNode {
            constructor(wet?: Types.NormalRange | object);
            public wet: Signal<typeof Type.NormalRange, Types.NormalRange>;
        }

        // TODO: complete definition
        class AutoFilter extends Effect {
            constructor(frequency?: Types.Time | object, baseFrequency?: Types.Frequency, octaves?: Types.Frequency);
            public start(time?: Types.Time): this;
            public stop(time?: Types.Time): this;
        }

        // TODO: complete definition
        class Convolver extends Effect {
            constructor(url?: string, onload?: () => void);
        }

        // TODO: complete definition
        class Distortion extends Effect {
            constructor(distortion?: number | object);
            public distortion: Types.NormalRange;
            public oversample: string;
        }

        // TODO: complete definition
        class FeedbackEffect extends Effect {
        }

        // TODO: complete definition
        class FeedbackDelay extends FeedbackEffect {
            constructor(delayTime?: Types.Time | object, feedback?: Types.NormalRange);
            public delayTime: Signal<typeof Type.Time, Types.Time>;
        }

        // TODO: complete definition
        class StereoEffect extends Effect {
        }

        class Phaser extends StereoEffect {
            constructor(frequency?: Types.Frequency, octaves?: number, baseFrequency?: Types.Frequency);
            constructor(options: {
                frequency?: Types.Frequency;
                octaves?: number,
                baseFrequency?: Types.Frequency;
            });
            public Q: Signal<typeof Type.Positive, Types.Positive>;
            public frequency: Signal<typeof Type.Frequency, Types.Frequency>;
            public baseFrequency: Types.Frequency;
            public octaves: Types.Positive;
            public dispose(): this;
        }

        /**
         * ========================================================
         * Event
         * ========================================================
         */

        // TODO: complete definition
        class Event extends Tone {
            constructor(callback: Function, value?: any);
            public loop: boolean | Tone.Types.Positive;
            public loopEnd: Tone.Types.Time;
            public start(time?: Tone.Types.Time): this;
            public stop(): this;
            public cancel(time?: Types.TransportTime): this;
            public dispose(): this;
            public state: Types.PlaybackState;
        }

        // TODO: complete definition
        class Loop extends Tone {
            constructor(callback: Function, interval: Types.Time);
            public start(): this;
            public stop(): this;
            public readonly state: Types.PlaybackState;
            public dispose(): this;
        }

        // TODO: complete definition
        class Pattern extends Loop {
            constructor(callback: Function, values: Types.Note[], pattern?: Types.CtrlPattern);
        }

        // TODO: complete definition
        class Part extends Event {
            constructor(callback: (time: Types.Time, note: Types.Note) => void, events: Array<[Types.Time, Types.Note]>);
            /** TODO: this seems to be an option but is undocumented */
            public humanize: boolean;
            public loop: boolean | Types.Positive;
            public loopEnd: Types.Time;
            public loopStart: Types.Time;
            public playbackRate: Types.Positive;
            public probability: Types.NormalRange;
            public add(time: Types.Time, value: Types.Note | Event): this;
            public at(time: Types.TransportTime, value: Types.Note | Event): Event;
            public cancel(time: Types.TransportTime): this;
            public start(): this;
            public stop(): this;
        }

        class Sequence<T> extends Part {
            constructor(callback: (time: Types.Time, val: T) => void, events: T[], subdivision: Types.Time);
        }

        /**
         * ========================================================
         * Component
         * ========================================================
         */

        // TODO: complete definition
        class Envelope extends AudioNode {
            constructor(envelope: EnvelopeOptions);
            constructor(attack?: Types.Time, decay?: Types.Time, sustain?: Types.NormalRange, release?: Types.Time);
            public attack: Types.Time;
            public decay: Types.Time;
            public sustain: Types.NormalRange;
            public release: Types.NormalRange;
            public triggerAttackRelease(time?: Types.Time): this;
        }

        // TODO: complete definition
        class AmplitudeEnvelope extends Envelope {
            public readonly value: number;
        }

        /**
         * Tone.Filter is a filter which allows for all of the same native methods as the BiquadFilterNode.
         * Tone.Filter has the added ability to set the filter rolloff at -12 (default), -24 and -48.
         */
        class Filter extends AudioNode {
            constructor(frequency?: Types.Frequency | object, type?: string, rolloff?: FilterRolloff);
            public Q: Signal<typeof Type.Positive, Types.Positive>;
            public detune: Signal<typeof Type.Cents, Types.Cents>;
            public frequency: Signal<typeof Type.Frequency, Types.Frequency>;
            public gain: Signal<"number", number>;
            public rollof: FilterRolloff;
            public type: FilterType;
        }

        // TODO: complete definition
        /**
         * Tone.FrequencyEnvelope is a Tone.ScaledEnvelope, but instead of min and max it’s got a baseFrequency and octaves parameter.
         */
        class FrequencyEnvelope extends Envelope {
            constructor(atatck?: Types.Time | object, sustain?: Types.Time, decay?: number, release?: Types.Time);
        }
    }

    export default Tone;
}
