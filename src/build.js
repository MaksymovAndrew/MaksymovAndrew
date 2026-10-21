import { mkdir, readFile, writeFile } from "node:fs/promises";

import { activity } from "./blocks/activity.js";
import { cards } from "./blocks/cards.js";
import { stack } from "./blocks/stack.js";
import { terminal } from "./blocks/terminal.js";
import { THEMES } from "./config.js";
import { BLOCKS, DATA_FLAG, ENCODING, PATHS, TOKEN_ENV } from "./constants.js";
import { fetchStats } from "./github.js";

async function loadStats() {
    const dataIndex = process.argv.indexOf(DATA_FLAG);
    if (dataIndex !== -1) {
        return JSON.parse(await readFile(process.argv[dataIndex + 1], ENCODING));
    }
    const token = process.env[TOKEN_ENV];
    if (!token) throw new Error(`Set ${TOKEN_ENV} or pass ${DATA_FLAG} <file>`);
    return fetchStats(token);
}

async function renderTheme(theme, stats) {
    return {
        [BLOCKS.terminal]: terminal(theme),
        [BLOCKS.stack]: await stack(theme),
        [BLOCKS.cards]: cards(theme, stats),
        [BLOCKS.activity]: activity(theme, stats),
    };
}

async function build() {
    const stats = await loadStats();
    await mkdir(PATHS.out, { recursive: true });
    for (const [mode, theme] of Object.entries(THEMES)) {
        const blocks = await renderTheme(theme, stats);
        for (const [name, content] of Object.entries(blocks)) {
            await writeFile(PATHS.block(name, mode), content);
        }
    }
    console.log(`Cards written to ${PATHS.out}/`);
}

await build();
