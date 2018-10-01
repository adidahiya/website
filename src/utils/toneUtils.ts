export const createLoopWithPlayers = (
    Tone: any,
    players: any,
    interval: string,
    onInterval: (
        args: {
            time: number;
            bar: number;
            beat: number;
            sixteenth: number;
            trigger: (playerName: string) => void;
        },
    ) => void,
) => {
    return new Tone.Loop((time: number) => {
        if (!players.loaded) {
            return;
        }

        const [bar, beat, sixteenth] = Tone.Transport.position.split(":");
        const trigger = (playerName: string) => players.get(playerName).start(time);
        onInterval({
            time,
            bar: parseInt(bar, 10),
            beat: parseInt(beat, 10),
            sixteenth: parseInt(sixteenth, 10),
            trigger,
        });
    }, interval);
};
