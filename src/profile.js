import { activity } from "./blocks/activity.js";
import { cards } from "./blocks/cards.js";
import { stack } from "./blocks/stack.js";
import { terminal } from "./blocks/terminal.js";
import { DESCRIPTIONS } from "./config.js";
import { GAP, SEQUENCE } from "./constants.js";
import { svgDocument } from "./svg.js";

async function renderBlocks(theme, stats) {
    return [
        terminal(theme, SEQUENCE.terminal),
        await stack(theme, SEQUENCE.stack),
        cards(theme, stats, SEQUENCE.cards),
        activity(theme, stats, SEQUENCE.activity),
    ];
}

function stackVertically(blocks) {
    let y = 0;
    const placed = blocks.map(({ height, body }) => {
        const group = `<g transform="translate(0 ${y})">\n${body}\n</g>`;
        y += height + GAP;
        return group;
    });
    return { body: placed.join("\n"), height: y - GAP };
}

export async function profile(theme, stats) {
    const blocks = await renderBlocks(theme, stats);
    const { body, height } = stackVertically(blocks);
    return svgDocument({
        height: Math.ceil(height),
        title: DESCRIPTIONS.profile(blocks.map(({ title }) => title)),
        style: blocks.map(({ style }) => style ?? "").join("\n"),
        body,
    });
}
