import { DESCRIPTIONS, TERMINAL } from "../config.js";
import { CANVAS, NBSP, SPACE_RUN, TERMINAL_LAYOUT as LAYOUT, TERMINAL_MOTION as MOTION, TYPE } from "../constants.js";
import { BLINK } from "../styles.js";
import { delayed, escapeXml, panel } from "../svg.js";

const FIRST_LINE = LAYOUT.barHeight + LAYOUT.firstLineOffset;

const keepSpaces = (text) => text.replace(SPACE_RUN, (run) => NBSP.repeat(run.length));

function typed(text, start) {
    return [...text]
        .map((char, index) => `<tspan class="p-in" ${delayed(start + index * MOTION.charDelay)}>${escapeXml(char)}</tspan>`)
        .join("");
}

function commandLine(theme, command, y, time) {
    const prompt = `<tspan fill="${theme.accent}" class="p-in" ${delayed(time - MOTION.promptLead)}>${LAYOUT.prompt}</tspan>`;
    return `<text x="${LAYOUT.padX}" y="${y}" font-size="${TYPE.terminal}">${prompt}<tspan fill="${theme.text}">${typed(command, time)}</tspan></text>`;
}

function outputLine(theme, { output, tone }, y, time) {
    return `<text x="${LAYOUT.padX}" y="${y}" font-size="${TYPE.terminal}" fill="${theme[tone]}" class="p-in" ${delayed(time)}>${keepSpaces(escapeXml(output))}</text>`;
}

function cursorLine(theme, y, time) {
    const { cursor } = LAYOUT;
    const block = `<rect class="p-blink" x="${LAYOUT.padX + cursor.offset}" y="${y - cursor.rise}" width="${cursor.width}" height="${cursor.height}" fill="${theme.accent}"/>`;
    const prompt = `<text x="${LAYOUT.padX}" y="${y}" font-size="${TYPE.terminal}" fill="${theme.accent}">${LAYOUT.prompt.trim()}</text>`;
    return `<g class="p-fade" ${delayed(time)}>${prompt}${block}</g>`;
}

function session(theme, start) {
    let y = FIRST_LINE;
    let time = start + MOTION.start;
    const lines = [];
    for (const line of TERMINAL.lines) {
        lines.push(commandLine(theme, line.command, y, time));
        time += line.command.length * MOTION.charDelay + MOTION.afterCommand;
        y += LAYOUT.lineHeight;
        lines.push(outputLine(theme, line, y, time));
        time += MOTION.afterOutput;
        y += LAYOUT.lineHeight;
    }
    lines.push(cursorLine(theme, y, time));
    return lines.join("\n");
}

function titleBar(theme) {
    const { width, radius, hairline } = CANVAS;
    const edge = width - hairline * 2;
    const divider = LAYOUT.barHeight + hairline;
    const shape = `<path d="M${hairline} ${radius + hairline}a${radius} ${radius} 0 0 1 ${radius}-${radius}h${edge - radius * 2}a${radius} ${radius} 0 0 1 ${radius} ${radius}v${LAYOUT.barHeight - radius}h-${edge}z" fill="${theme.surface}"/>`;
    const line = `<line x1="${hairline}" y1="${divider}" x2="${width - hairline}" y2="${divider}" stroke="${theme.line}"/>`;
    const dots = TERMINAL.dots
        .map(
            (color, index) =>
                `<circle cx="${LAYOUT.padX + index * LAYOUT.dotStep}" cy="${LAYOUT.barHeight / 2}" r="${LAYOUT.dotRadius}" fill="${color}"/>`,
        )
        .join("");
    const title = `<text x="${LAYOUT.titleX}" y="${LAYOUT.titleBaseline}" font-size="${TYPE.windowTitle}" fill="${theme.muted}">${escapeXml(TERMINAL.title)}</text>`;
    return shape + line + dots + title;
}

export function terminal(theme, start) {
    const rows = TERMINAL.lines.length * LAYOUT.linesPerEntry + 1;
    const height = FIRST_LINE + (rows - 1) * LAYOUT.lineHeight + LAYOUT.padBottom;
    const frame = panel({ width: CANVAS.width, height, fill: theme.bg, stroke: theme.line });
    return {
        height,
        title: DESCRIPTIONS.terminal(TERMINAL.lines),
        style: BLINK,
        body: `<g class="p-rise" ${delayed(start)}>\n${frame}\n${titleBar(theme)}\n${session(theme, start)}\n</g>`,
    };
}
