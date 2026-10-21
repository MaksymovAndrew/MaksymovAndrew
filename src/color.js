import { PERCENT } from "./constants.js";

const HEX_RADIX = 16;
const CHANNELS = [1, 3, 5];
const CHANNEL_LENGTH = 2;

const channels = (hex) => CHANNELS.map((start) => parseInt(hex.slice(start, start + CHANNEL_LENGTH), HEX_RADIX));

export function mixColor(color, base, percent) {
    const weight = percent / PERCENT;
    const [from, to] = [channels(color), channels(base)];
    const mixed = from.map((value, index) => Math.round(value * weight + to[index] * (1 - weight)));
    return `#${mixed.map((value) => value.toString(HEX_RADIX).padStart(CHANNEL_LENGTH, "0")).join("").toUpperCase()}`;
}
