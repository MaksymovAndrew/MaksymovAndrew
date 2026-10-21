import { CANVAS, COUNT_UP, PRECISION } from "./constants.js";
import { BASE, REDUCED_MOTION } from "./styles.js";

export const escapeXml = (text) =>
    String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export const fixed = (value) => value.toFixed(PRECISION.geometry);

const seconds = (value) => `${value.toFixed(PRECISION.time)}s`;

export const delayed = (delay) => `style="animation-delay:${seconds(delay)}"`;

export function svgDocument({ height, title, body, style = "" }) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${CANVAS.width}" height="${height}" viewBox="0 0 ${CANVAS.width} ${height}" role="img" aria-label="${escapeXml(title)}">
<title>${escapeXml(title)}</title>
<style>
${BASE}
${style}
${REDUCED_MOTION}
</style>
${body}
</svg>
`;
}

export function panel({ x = 0, y = 0, width, height, fill, stroke, radius = CANVAS.radius }) {
    const { hairline } = CANVAS;
    return `<rect x="${x + hairline}" y="${y + hairline}" width="${width - hairline * 2}" height="${height - hairline * 2}" rx="${radius}" fill="${fill}" stroke="${stroke}"/>`;
}

export function countUp({ x, y, value, delay, attributes }) {
    const { frames, frameDuration, easePower } = COUNT_UP;
    const steps = [];
    for (let frame = 1; frame < frames; frame += 1) {
        const eased = 1 - Math.pow(1 - frame / frames, easePower);
        steps.push(`<text x="${x}" y="${y}" ${attributes} class="p-flash" ${delayed(delay + frame * frameDuration)}>${Math.round(value * eased)}</text>`);
    }
    steps.push(`<text x="${x}" y="${y}" ${attributes} class="p-in" ${delayed(delay + frames * frameDuration)}>${value}</text>`);
    return steps.join("");
}
