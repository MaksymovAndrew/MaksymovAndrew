import { DESCRIPTIONS, LABELS } from "../config.js";
import { mixColor } from "../color.js";
import { ACTIVITY_LAYOUT as LAYOUT, CANVAS, PERCENT, PRECISION, SNAKE_MOTION as MOTION, STATS_RULES, TYPE } from "../constants.js";
import { contributionLevel, toUtcDate } from "../stats.js";
import { snake } from "../styles.js";
import { delayed, escapeXml, fixed, panel } from "../svg.js";

const { grid } = LAYOUT;
const CONTENT_WIDTH = CANVAS.width - LAYOUT.pad * 2;

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

function animatedGrid(theme, path, start) {
    const weeks = path.at(-1).week + 1;
    const step = (CONTENT_WIDTH + grid.gap) / weeks;
    const cell = step - grid.gap;
    const empty = theme.levels[0];
    const tail = MOTION.tail.map((strength) => mixColor(theme.glow, empty, strength));
    const cycle = (path.length + tail.length) * MOTION.step + MOTION.hold;

    const frames = [];
    const cells = path.map((day, index) => {
        const name = `s${index}`;
        const origin = theme.levels[day.level];
        frames.push(keyframes(name, { origin, empty, tail, start: index * MOTION.step, cycle }));
        const x = fixed(LAYOUT.pad + day.week * step);
        const y = fixed(LAYOUT.header + day.weekday * step);
        return `<rect class="p-snake" x="${x}" y="${y}" width="${fixed(cell)}" height="${fixed(cell)}" rx="${grid.radius}" fill="${origin}" style="animation-name:${name}"/>`;
    });
    const timing = snake({ duration: cycle.toFixed(PRECISION.time), delay: start + MOTION.start });
    return {
        content: cells.join(""),
        style: `${timing}\n${frames.join("\n")}`,
        gridHeight: STATS_RULES.daysPerWeek * step - grid.gap,
    };
}

function header(theme, total) {
    const title = `<text x="${LAYOUT.pad}" y="${LAYOUT.headingY}" font-size="${TYPE.heading}" fill="${theme.accent}">${escapeXml(LABELS.activity)}</text>`;
    const count = `<text x="${CANVAS.width - LAYOUT.pad}" y="${LAYOUT.headingY}" font-size="${TYPE.caption}" text-anchor="end" fill="${theme.muted}">${total} ${escapeXml(LABELS.activityTotal)}</text>`;
    return title + count;
}

export function activity(theme, stats, start) {
    const path = snakePath(placeDays(stats.days));
    const { content, style, gridHeight } = animatedGrid(theme, path, start);
    const height = Math.ceil(LAYOUT.header + gridHeight + LAYOUT.pad);
    const frame = panel({ width: CANVAS.width, height, fill: theme.surface, stroke: theme.line });
    return {
        height,
        title: DESCRIPTIONS.activity(stats.contributions),
        style,
        body: `<g class="p-rise" ${delayed(start)}>${frame}\n${header(theme, stats.contributions)}\n${content}</g>`,
    };
}
