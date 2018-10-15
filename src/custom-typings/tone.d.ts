declare module "tone" {
    class Tone {
        constructor();
        readonly context: Tone.Context;
        /**
         * Recieve the input from the desired channelName to the input
         * @param channelName A named channel to send the signal to.
         * @param channelNumber The channel to connect to
         */
        receive(channelName: string, channelNumber?: number): this;
        /**
         * Send this signal to the channel name.
         * @param channelName A named channel to send the signal to.
         * @param amount The amount of the source to send to the bus.
         * @returns The gain node which connects this node to the desired channel. Can be used to adjust the levels of the send.
         */
        send(channelName: string, amount: Tone.Types.Decibels): GainNode;
        /**
         * Convert a frequency representation into a number.
         */
        toFrequency(freq: Tone.Frequency): Tone.Types.Hertz;
        /**
         * Convert Time into seconds. Unlike the method which it overrides, this takes into account transporttime and musical notation. Time : 1.40 Notation: 4n or 1m or 2t Now Relative: +3n Math: 3n+16n or even complicated expressions ((3n*2)/6 + 1)
         */
        toSeconds(time: Tone.Time): Tone.Types.Seconds;
        /**
         * Convert a time representation into ticks.
         */
        toTicks(time: Tone.Time): Tone.Types.Ticks;
        /**
         * Generate a buffer by rendering all of the Tone.js code within the callback using the OfflineAudioContext. The OfflineAudioContext is capable of rendering much faster than real time in many cases. The callback function also passes in an offline instance of Tone.Transport which can be used to schedule events along the Transport. NOTE OfflineAudioContext has the same restrictions as the AudioContext in that on certain platforms (like iOS) it must be invoked by an explicit user action like a click or tap.
         * @param callback All Tone.js nodes which are created and scheduled within this callback are recorded into the output Buffer.
         * @param duration the amount of time to record for.
         */
        static Offline(callback: Function, duration: Tone.Time): Promise<Tone.Buffer>;
        /**
         * connect together all of the arguments in series
         */
        static connectSeries(nodes: AudioParam | Tone | AudioNode): Tone;
        /**
         * Convert decibels into gain.
         */
        static dbToGain(db: Tone.Types.Decibels): number;
        /**
         * If the given parameter is undefined, use the fallback. If both given and fallback are object literals, it will return a deep copy which includes all of the parameters from both objects. If a parameter is undefined in given, it will return the fallback property.
         * WARNING: if object is self referential, it will go into an an infinite recursive loop.
         */
        static defaultArg(given: any, fallback: any): any;
        /**
         * TODO: narrower type definition using generics
         * @param values The arguments array
         * @param keys The names of the arguments
         * @param constr The class constructor
         * @returns An object composed of the defaults between the class’ defaults and the passed in arguments.
         */
        static defaults(values: Array<any>, keys: string[], constr: Function | Object): Object;
        /**
         * Equal power gain scale. Good for cross-fading.
         * @param percent (0-1)
         * @returns output gain (0-1)
         */
        static equalPowerScale(percent: Tone.Types.NormalRange): number;
        /**
         * have a child inherit all of Tone’s (or a parent’s) prototype to inherit the parent’s properties, make sure to call Parent.call(this) in the child’s constructor based on closure library’s inherit function
         * @param parent (optional) parent to inherit from if no parent is supplied, the child will inherit from Tone
         */
        static extend(child: Function, parent?: Function): void;
        /**
         * Convert gain to decibels.
         * @param gain (0-1)
         */
        static gainToDb(gain: number): Tone.Types.Decibels;
        /**
         * Convert an interval (in semitones) to a frequency ratio.
         * @param interval the number of semitones above the base note
         * @returns the frequency ratio
         */
        static intervalToFrequencyRatio(interval: Tone.Types.Interval): number;
        /**
         * Test if the argument is an Array
         */
        static isArray(arg: any): boolean;
        /**
         * Test if the argument is a boolean.
         */
        static isBoolean(arg: any): boolean;
        /**
         * Test if the argument is not undefined.
         */
        static isDefined(arg: any): boolean;
        /**
         * Test if the argument is a function.
         */
        static isFunction(arg: any): boolean;
        /**
         * Test if the argument is in the form of a note in scientific pitch notation. e.g. “C4”
         */
        static isNote(arg: any): boolean;
        /**
         * Test if the argument is a number.
         */
        static isNumber(arg: any): boolean;
        /**
         * Test if the argument is an object literatl (i.e. {})
         */
        static isObject(arg: any): boolean;
        /**
         * Test if the argument is a string
         */
        static isString(arg: any): boolean;
        /**
         * Test if the argument is undefined
         */
        static isUndef(arg: any): boolean;
        /**
         * Returns a Promise which resolves when all of the buffers have loaded
         */
        static loaded(): Promise<void>;
        /**
         * Return the current time of the AudioContext clock.
         */
        static now(): number;
        /**
         * Global transport object
         */
        static Transport: Tone.TransportClass;
    }

    namespace Tone {
        /**
         * ========================================================
         * Type
         * ========================================================
         */

        const Type: {
            AudioRange: "audioRange"
            BPM: "bpm"
            BarsBeatsSixteenths: "barsBeatsSixteenths"
            Cents: "cents"
            Decibels: "db"
            Default: "number"
            Degrees: "degrees"
            Frequency: "frequency"
            Gain: "gain"
            Hertz: "hertz"
            Interval: "interval"
            MIDI: "midi"
            Milliseconds: "milliseconds"
            NormalRange: "normalRange"
            Notation: "notation"
            Note: "note"
            Positive: "positive"
            Samples: "samples"
            Seconds: "seconds"
            Ticks: "ticks"
            Time: "time"
            TransportTime: "transportTime"
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
        }

        // TODO: complete definition
        class TimeBase extends Tone {
            constructor(val: string | number, units?: string);
            toMilliseconds(): Types.Milliseconds;
        }

        // TODO: complete definition
        class Time extends TimeBase {

        }

        // TODO: complete definition
        class Frequency extends TimeBase {
            harmonize(intervals: number[]): Frequency[];
            transpose(semitones: number): Types.Frequency;
        }


        /**
         * ========================================================
         * Core
         * ========================================================
         */

        class Emitter extends Tone {
            constructor();
            dispose(): this;
            emit(event: string, ...args: any[]): this;
            off(event: string, callback: Function): this;
            on(event: string, callback: Function): this;
            once(event: string, callback: Function): this;
            static mixin(obj: Object | Function): Emitter;
        }

        class Context extends Emitter {
            constructor(context?: AudioContext);
            /**
             * What the source of the clock is, either “worker” (Web Worker [default]), “timeout” (setTimeout), or “offline” (none).
             */
            clockSource: string;
            /**
             * The type of playback, which affects tradeoffs between audio output latency and responsiveness. In addition to setting the value in seconds, the latencyHint also accepts the strings “interactive” (prioritizes low latency), “playback” (prioritizes sustained playback), “balanced” (balances latency and performance), and “fastest” (lowest latency, might glitch more often).
             */
            latencyHint: string | number;
            /**
             * The amount of time events are scheduled into the future
             */
            lookAhead: number;
            /**
             * How often the Web Worker callback is invoked. This number corresponds to how responsive the scheduling can be. Context.updateInterval + Context.lookAhead gives you the total latency between scheduling an event and hearing it.
             */
            updateInterval: number;
            /**
             * Clears a previously scheduled timeout with Tone.context.setTimeout
             */
            clearTimeout(id: number): this;
            /**
             * Promise which is invoked when the context is running. Tries to resume the context if it’s not started.
             */
            close(): Promise<void>;
            createConstantSource(): any;
            createStereoPanner(): any;
            /**
             * Unlike other dispose methods, this returns a Promise which executes when the context is closed and disposed
             */
            // @ts-ignore
            dispose(): Promise<this>;
            /**
             * Generate a looped buffer at some constant value.
             */
            getConstant(val: number): AudioBufferSourceNode;
            /**
             * The current audio context time
             */
            now(): number;
            /**
             * Promise which is invoked when the context is running. Tries to resume the context if it’s not started.
             */
            read(): Promise<void>;
            /**
             * A setTimeout which is gaurenteed by the clock source. Also runs in the offline context.
             */
            setTimeout(fn: Function, timeout: number): number;
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
            readonly duration: number;
            /**
             * The length of the buffer in samples
             */
            readonly length: number;
            /**
             * If the buffer is loaded or not
             */
            readonly loaded: boolean;
            /**
             * The number of discrete audio channels. Returns 0 if no buffer is loaded.
             */
            readonly numberOfChannels: number;
            /**
             * Reverse the buffer.
             */
            reverse: boolean;
            /**
             * dispose and disconnect
             */
            dispose(): this;
            /**
             * Set the audio buffer from the array. To create a multichannel AudioBuffer, pass in a multidimensional array.
             * @param array The array to fill the audio buffer
             */
            fromArray(array: Float32Array): this;
            /**
             * The audio buffer stored in the object.
             */
            get(): AudioBuffer;
            /**
             * Returns the Float32Array representing the PCM audio data for the specific channel.
             * @param channel The channel number to return
             */
            getChannelData(channel: number): Float32Array;
            /**
             * Makes an xhr reqest for the selected url then decodes the file as an audio buffer. Invokes the callback once the audio buffer loads.
             * @param url The url of the buffer to load. filetype support depends on the browser.
             */
            load(url: string): Promise<Tone.Buffer>;
            /**
             * Pass in an AudioBuffer or Tone.Buffer to set the value of this buffer.
             */
            set(buffer: AudioBuffer | Tone.Buffer): this;
            /**
             * Cut a subsection of the array and return a buffer of the subsection. Does not modify the original buffer
             * @param start The time to start the slice
             * @param end The end time to slice. If none is given will default to the end of the buffer
             */
            slice(start: Tone.Time, end?: Tone.Time): this;
            /**
             * Get the buffer as an array. Single channel buffers will return a 1-dimensional Float32Array, and multichannel buffers will return multidimensional arrays.
             * @param channel Optionally only copy a single channel from the array.
             */
            toArray<T>(channel?: number): Array<T>;
            /**
             * Sums muliple channels into 1 channel
             * @param channel Optionally only copy a single channel from the array.
             */
            toMono<T>(channel?: number): Array<T>;
            /**
             * Stops all of the downloads in progress
             */
            static cancelDownloads(): Tone.Buffer;
            /**
             * Create a Tone.Buffer from the array. To create a multichannel AudioBuffer, pass in a multidimensional array.
             * @param array The array to fill the audio buffer
             */
            static fromArray(array: Float32Array): Tone.Buffer;
            /**
             * Creates a Tone.Buffer from a URL, returns a promise which resolves to a Tone.Buffer
             */
            static fromUrl(url: string): Promise<Tone.Buffer>;
            /**
             * Loads a url using XMLHttpRequest.
             */
            static load(url: string, onload: Function, onerror: Function, onprogress: Function): XMLHttpRequest;
            /**
             * Checks a url’s extension to see if the current browser can play that file type.
             * @param url The url/extension to test
             */
            static supportsType(url: string): boolean;
        }

        class AudioNode extends Tone {
            constructor(context?: AudioContext);
            /**
             * the number of channels used when up-mixing and down-mixing connections to any inputs to the node. The default value is 2 except for specific nodes where its value is specially determined.
             */
            readonly channelCount: number;
            /**
             * determines how channels will be counted when up-mixing and down-mixing connections to any inputs to the node. The default value is “max”. This attribute has no effect for nodes with no inputs.
             */
            readonly channelCountMode: string;
            /**
             * determines how individual channels will be treated when up-mixing and down-mixing connections to any inputs to the node. The default value is “speakers”.
             */
            readonly channelInterpretation: string;
            /**
             * Get the audio context belonging to this instance.
             */
            readonly context: Context;
            /**
             * The number of inputs feeding into the AudioNode. For source nodes, this will be 0.
             */
            readonly numberOfInputs: number;
            /**
             * The number of outputs coming out of the AudioNode.
             */
            readonly numberOfOutputs: number;
            /**
             * connect the output of a ToneNode to an AudioParam, AudioNode, or ToneNode
             */
            connect(unit: Tone | AudioParam | AudioNode, outputNum?: number, inputNum?: number): this;
            /**
             * disconnect the output
             * @param output Either the output index to disconnect if the output is an array, or the node to disconnect from.
             */
            disconnect(output: number | AudioNode): this;
            /**
             * dispose and disconnect
             */
            dispose(): this;
            /**
             * Connect ‘this’ to the master output. Shorthand for this.connect(Tone.Master)
             */
            toMaster(): this;
        }

        // TODO: extract outside namespace?
        type valueof<T> = T[keyof T];

        // TODO: complete definition
        class Param<U extends valueof<typeof Type>, V> extends AudioNode {
            constructor(param: AudioParam, units: U, convert: boolean);
            convert: boolean;
            units: U;
            value: V;
        }

        // TODO: complete definition
        class Signal<U extends valueof<typeof Type>, V> extends Param<U, V> {
            linearRampToValue(value: V): this;
            exponentialRampToValue(value: V): this;
            rampTo(value: V): this;
        }

        type BPM = Signal<typeof Type.BPM, Types.BPM>;

        // TODO: verify against docs
        type State = string;

        class TransportClass extends Emitter {
            constructor();
            PPQ: number;
            bpm: BPM;
            timeSignature: number | number[];
            start(time?: Types.Time, offset?: Types.TransportTime): Transport;
            stop(time?: Types.Time): Transport;
            readonly state: State;
        }


        /**
         * ========================================================
         * Sources
         * ========================================================
         */

        // TODO: complete definition
        class Source extends AudioNode {
            volume: Signal<typeof Type.Decibels, Types.Decibels>;
            start(time?: Types.Time): this;
            stop(time?: Types.Time): this;

        }

        // TODO: complete definition
        class Player extends Source {

        }

        // TODO: complete definition
        class Players extends AudioNode {
            /**
             * Tone.Players combines multiple Tone.Player objects.
             * @param urls An object mapping a name to a url.
             * @param onload The function to invoke when all buffers are loaded.
             */
            constructor(urls: { [key: string]: string }, onload?: Function);
        }

        // TODO: complete definition
        class Oscillator extends Source {
            constructor(frequency?: Types.Frequency, type?: string);
        }


        /**
         * ========================================================
         * Instrument
         * ========================================================
         */

        // TODO: complete definition
        class Instrument extends AudioNode {
            triggerAttackRelease(note: Types.Frequency, duration: Types.Time, time?: Types.Time, velocity?: Types.NormalRange): this;
            volume: Signal<typeof Type.Decibels, Types.Decibels>;
            sync(): this;
            unsync(): this;
        }

        interface IMonophonicOptions {
            portamento?: Types.Time;
        }

        interface MonophonicConstructor {
            new(options?: IMonophonicOptions): Monophonic;
        }

        // TODO: complete definition
        class Monophonic extends Instrument {
            constructor(options?: IMonophonicOptions);
            portamento: Types.Time;
        }

        interface IEnvelope {
            attack?: number;
            decay?: number;
            sustain?: number;
            release?: number;
        }

        // TODO: complete definition
        class Synth extends Monophonic {
            constructor(options?: IMonophonicOptions & {
                oscillator?: {
                    modulationType?: string;
                    type: string;
                },
                envelope?: IEnvelope;
            });
            frequency: Signal<typeof Type.Frequency, Types.Frequency>;
            envelope: AmplitudeEnvelope;
        }

        // TODO: complete definition
        class PluckSynth extends Tone.Instrument {
            constructor(options?: {
                attackNoise?: number,
                dampening?: Types.Frequency,
                resonance?: Types.NormalRange,
            });
            attackNoise: number;
            dampening: Signal<typeof Type.Frequency, Types.Frequency>;
            resonance: Signal<typeof Type.NormalRange, Types.NormalRange>;
        }

        // TODO: complete definition
        class PolySynth<V extends Monophonic> extends Instrument {
            constructor(polyphony?: number | object, voice?: { new(): V });
            detune: Signal<typeof Type.Cents, Types.Cents>;
            voices: V[];
            triggerAttackRelease(notes: Types.Frequency | Types.Frequency[], durations: Types.Time | Types.Time[], time?: Types.Time, velocity?: Types.NormalRange): this;
            triggerAttack(notes: Types.Frequency | Types.Frequency[], time?: Types.Time, velocity?: Types.NormalRange): this;
            triggerRelease(notes: Types.Frequency | Types.Frequency[], time?: Types.Time): this;
            releaseAll(): this;
        }

        /**
         * ========================================================
         * Event
         * ========================================================
         */

        type CtrlPattern = string;

        // TODO: complete definition
        class Loop extends Tone {
            constructor(callback: Function, interval: Types.Time);
            start(): this;
            stop(): this;
        }

        // TODO: complete definition
        class Pattern extends Loop {
            constructor(callback: Function, values: Types.Note[], pattern?: CtrlPattern);
        }


        /**
         * ========================================================
         * Component
         * ========================================================
         */

        // TODO: complete definition
        class Envelope extends AudioNode {
            constructor(envelope: IEnvelope);
            constructor(atatck?: number, sustain?: number, decay?: number, release?: number);
            triggerAttackRelease(time?: Types.Time): this;
        }

        // TODO: complete definition
        class AmplitudeEnvelope extends Envelope {
            readonly value: number;
        }
    }

    export default Tone;
}
