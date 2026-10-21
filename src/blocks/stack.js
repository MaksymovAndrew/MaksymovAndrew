import { readFile } from "node:fs/promises";

import { DESCRIPTIONS, STACK } from "../config.js";
import { CANVAS, GAP, PATHS, STACK_LAYOUT as LAYOUT, SVG_DATA_URI } from "../constants.js";
import { delayed, panel } from "../svg.js";

const SIZE = (CANVAS.width - GAP * (STACK.length - 1)) / STACK.length;
const ICON_SIZE = SIZE * LAYOUT.iconScale;
const INSET = (SIZE - ICON_SIZE) / 2;

const loadIcon = (name) => readFile(PATHS.icon(name));

function tile(theme, icon, index, start) {
    const x = index * (SIZE + GAP);
    const frame = panel({ x, width: SIZE, height: SIZE, fill: theme.tile, stroke: theme.line, radius: LAYOUT.tileRadius });
    const image = `<image x="${x + INSET}" y="${INSET}" width="${ICON_SIZE}" height="${ICON_SIZE}" href="${SVG_DATA_URI}${icon.toString("base64")}"/>`;
    return `<g class="p-pop" ${delayed(start + index * LAYOUT.stagger)}>${frame}${image}</g>`;
}

export async function stack(theme, start) {
    const icons = await Promise.all(STACK.map(loadIcon));
    return {
        height: SIZE,
        title: DESCRIPTIONS.stack(STACK),
        body: icons.map((icon, index) => tile(theme, icon, index, start)).join("\n"),
    };
}
