import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";

import { DESCRIPTIONS, LABELS } from "../config.js";
import { ACTIVITY_LAYOUT as LAYOUT, CANVAS, ENCODING, STATS_RULES, TYPE } from "../constants.js";
import { contributionLevel, toUtcDate } from "../stats.js";
import { escapeXml, panel, svgDocument } from "../svg.js";

const CONTENT_WIDTH = CANVAS.width - LAYOUT.side * 2;

async function nestedSnake(file) {
    const raw = (await readFile(file, ENCODING)).replace(/<\?xml[^>]*>/, "");
    const [, , width, height] = raw.match(/viewBox="([^"]+)"/)[1].split(/[\s,]+/).map(Number);
    const contentHeight = Math.round((CONTENT_WIDTH * height) / width);
    const content = raw.replace(/<svg\b[^>]*?>/, (tag) =>
        tag
            .replace(/\s(width|height|x|y)="[^"]*"/g, "")
            .replace("<svg", `<svg x="${LAYOUT.side}" y="${LAYOUT.header}" width="${CONTENT_WIDTH}" height="${contentHeight}"`),
    );
    return { content, contentHeight };
}

function placeDays(days) {
    const { daysPerWeek } = STATS_RULES;
    const firstWeekday = toUtcDate(days[0].date).getUTCDay();
    return days.map((day, index) => ({
        ...day,
        week: Math.floor((index + firstWeekday) / daysPerWeek),
        weekday: toUtcDate(day.date).getUTCDay(),
    }));
}

function staticGrid(theme, days) {
    const { grid } = LAYOUT;
    const placed = placeDays(days);
    const weeks = placed.at(-1).week + 1;
    const left = (CANVAS.width - weeks * grid.step + (grid.step - grid.cell)) / 2;
    const content = placed
        .map(({ count, week, weekday }) => {
            const x = left + week * grid.step;
            const y = LAYOUT.header + grid.top + weekday * grid.step;
            const fill = theme.levels[contributionLevel(count)];
            return `<rect x="${x}" y="${y}" width="${grid.cell}" height="${grid.cell}" rx="${grid.radius}" fill="${fill}"/>`;
        })
        .join("");
    return { content, contentHeight: STATS_RULES.daysPerWeek * grid.step };
}

function header(theme, total) {
    const title = `<text x="${LAYOUT.side}" y="${LAYOUT.headingY}" font-size="${TYPE.heading}" fill="${theme.accent}">${escapeXml(LABELS.activity)}</text>`;
    const count = `<text x="${CANVAS.width - LAYOUT.side}" y="${LAYOUT.headingY}" font-size="${TYPE.caption}" text-anchor="end" fill="${theme.muted}">${total} ${escapeXml(LABELS.activityTotal)}</text>`;
    return title + count;
}

export async function activity(theme, stats, snakeFile) {
    const { content, contentHeight } = existsSync(snakeFile)
        ? await nestedSnake(snakeFile)
        : staticGrid(theme, stats.days);
    const height = LAYOUT.header + contentHeight + LAYOUT.bottom;
    const frame = panel({ width: CANVAS.width, height, fill: theme.surface, stroke: theme.line });
    return svgDocument({
        height,
        title: DESCRIPTIONS.activity(stats.contributions),
        body: `<g class="p-rise">${frame}\n${header(theme, stats.contributions)}\n${content}</g>`,
    });
}
