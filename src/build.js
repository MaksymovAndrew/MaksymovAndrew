import { mkdir, readFile, writeFile } from "node:fs/promises";

import { THEMES } from "./config.js";
import { DATA_FLAG, ENCODING, PATHS, TOKEN_ENV } from "./constants.js";
import { fetchStats } from "./github.js";
import { profile } from "./profile.js";

async function loadStats() {
    const dataIndex = process.argv.indexOf(DATA_FLAG);
    if (dataIndex !== -1) {
        return JSON.parse(await readFile(process.argv[dataIndex + 1], ENCODING));
    }
    const token = process.env[TOKEN_ENV];
    if (!token) throw new Error(`Set ${TOKEN_ENV} or pass ${DATA_FLAG} <file>`);
    return fetchStats(token);
}

async function build() {
    const stats = await loadStats();
    await mkdir(PATHS.out, { recursive: true });
    for (const [mode, theme] of Object.entries(THEMES)) {
        await writeFile(PATHS.profile(mode), await profile(theme, stats));
    }
    console.log(`Profile written to ${PATHS.out}/`);
}

await build();
