import { DESCRIPTIONS, LABELS } from "../config.js";
import { mixColor } from "../color.js";
import { ACTIVITY_LAYOUT as LAYOUT, CANVAS, PERCENT, PRECISION, SNAKE_MOTION as MOTION, STATS_RULES, TYPE } from "../constants.js";
import { contributionLevel, toUtcDate } from "../stats.js";
import { snake } from "../styles.js";
import { escapeXml, panel, svgDocument } from "../svg.js";

const { grid } = LAYOUT;
const GRID_HEIGHT = STATS_RULES.daysPerWeek * grid.step;

function placeDays(days) {
    const { daysPerWeek } = STATS_RULES;
    const firstWeekday = toUtcDate(days[0].date).getUTCDay();
    return days.map((day, index) => ({
        level: contributionLevel(day.count),
        week: Math.floor((index + firstWeekday) / daysPerWeek),
        weekday: toUtcDate(day.date).getUTCDay(),
    }));
}

function snakePath(cells) {
    const downward = (cell) => cell.week % 2 === 0;
    return [...cells].sort(
        (a, b) => a.week - b.week || (downward(a) ? a.weekday - b.weekday : b.weekday - a.weekday),
    );
}

function keyframes(name, { origin, empty, tail, start, cycle }) {
    const at = (time) => `${((time / cycle) * PERCENT).toFixed(PRECISION.keyframe)}%`;
    const passing = tail.map((color, index) => `${at(start + index * MOTION.step)}{fill:${color}}`);
    const eaten = `${at(start + tail.length * MOTION.step)}{fill:${empty}}`;
    return `@keyframes ${name}{0%{fill:${origin}}${passing.join("")}${eaten}100%{fill:${origin}}}`;
}

function animatedGrid(theme, days) {
    const path = snakePath(placeDays(days));
    const weeks = path.at(-1).week + 1;
    const left = (CANVAS.width - weeks * grid.step + (grid.step - grid.cell)) / 2;
    const empty = theme.levels[0];
    const tail = MOTION.tail.map((strength) => mixColor(theme.glow, empty, strength));
    const cycle = (path.length + tail.length) * MOTION.step + MOTION.hold;

    const frames = [];
    const cells = path.map((cell, index) => {
        const name = `s${index}`;
        const origin = theme.levels[cell.level];
        frames.push(keyframes(name, { origin, empty, tail, start: index * MOTION.step, cycle }));
        const x = left + cell.week * grid.step;
        const y = LAYOUT.header + grid.top + cell.weekday * grid.step;
        return `<rect class="p-snake" x="${x}" y="${y}" width="${grid.cell}" height="${grid.cell}" rx="${grid.radius}" fill="${origin}" style="animation-name:${name}"/>`;
    });
    const style = `${snake({ duration: cycle.toFixed(PRECISION.time), delay: MOTION.start })}\n${frames.join("\n")}`;
    return { content: cells.join(""), style };
}

function header(theme, total) {
    const title = `<text x="${LAYOUT.side}" y="${LAYOUT.headingY}" font-size="${TYPE.heading}" fill="${theme.accent}">${escapeXml(LABELS.activity)}</text>`;
    const count = `<text x="${CANVAS.width - LAYOUT.side}" y="${LAYOUT.headingY}" font-size="${TYPE.caption}" text-anchor="end" fill="${theme.muted}">${total} ${escapeXml(LABELS.activityTotal)}</text>`;
    return title + count;
}

export function activity(theme, stats) {
    const { content, style } = animatedGrid(theme, stats.days);
    const height = LAYOUT.header + grid.top + GRID_HEIGHT + LAYOUT.bottom;
    const frame = panel({ width: CANVAS.width, height, fill: theme.surface, stroke: theme.line });
    return svgDocument({
        height,
        title: DESCRIPTIONS.activity(stats.contributions),
        style,
        body: `<g class="p-rise">${frame}\n${header(theme, stats.contributions)}\n${content}</g>`,
    });
}
