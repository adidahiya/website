/**
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padStart
 */
export function padStart(inputString: string | number, targetLength: number, padString: string) {
    if (typeof inputString === "number") {
        inputString = `${inputString}`;
    }

    // tslint:disable-next-line no-bitwise
    targetLength = targetLength >> 0; // truncate if number, or convert non-number to 0;
    padString = String(typeof padString !== "undefined" ? padString : " ");
    if (inputString.length >= targetLength) {
        return String(inputString);
    } else {
        targetLength = targetLength - inputString.length;
        if (targetLength > padString.length) {
            padString += padString.repeat(targetLength / padString.length); // append to original to ensure we are longer than needed
        }
        return padString.slice(0, targetLength) + String(inputString);
    }
}
