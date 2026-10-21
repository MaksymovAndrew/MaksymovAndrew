import { readFile } from "node:fs/promises";

import { DESCRIPTIONS, STACK } from "../config.js";
import { CANVAS, PATHS, STACK_LAYOUT as LAYOUT, SVG_DATA_URI } from "../constants.js";
import { delayed, panel, svgDocument } from "../svg.js";

const loadIcon = (name) => readFile(PATHS.icon(name));

function tile(theme, { x, size, icon, index }) {
    const iconSize = size * LAYOUT.iconScale;
    const inset = (size - iconSize) / 2;
    const frame = panel({
        x,
        y: LAYOUT.top,
        width: size,
        height: size,
        fill: theme.tile,
        stroke: theme.line,
        radius: LAYOUT.tileRadius,
    });
    const image = `<image x="${x + inset}" y="${LAYOUT.top + inset}" width="${iconSize}" height="${iconSize}" href="${SVG_DATA_URI}${icon.toString("base64")}"/>`;
    return `<g class="p-pop" ${delayed(LAYOUT.start + index * LAYOUT.stagger)}>${frame}${image}</g>`;
}

export async function stack(theme) {
    const size = (CANVAS.width - LAYOUT.gap * (STACK.length - 1)) / STACK.length;
    const icons = await Promise.all(STACK.map(loadIcon));
    const tiles = icons.map((icon, index) => tile(theme, { x: index * (size + LAYOUT.gap), size, icon, index }));
    return svgDocument({
        height: Math.ceil(size + LAYOUT.top * 2),
        title: DESCRIPTIONS.stack(STACK),
        body: tiles.join("\n"),
    });
}
