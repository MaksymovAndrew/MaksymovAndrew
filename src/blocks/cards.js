import { DESCRIPTIONS, LABELS, LANGUAGE_COLORS, STATS_ROWS } from "../config.js";
import { CANVAS, CARDS_LAYOUT as LAYOUT, PERCENT, PRECISION, TYPE } from "../constants.js";
import { GLYPHS } from "../glyphs.js";
import { shortDate, streaks, topLanguages } from "../stats.js";
import { GROW, RING } from "../styles.js";
import { countUp, delayed, escapeXml, panel, svgDocument } from "../svg.js";

const COLUMNS = Object.keys(LAYOUT.slots).length;
const CARD_WIDTH = (CANVAS.width - LAYOUT.gap * (COLUMNS - 1)) / COLUMNS;
const VALUE_X = CARD_WIDTH - LAYOUT.pad;

const fixed = (value) => value.toFixed(PRECISION.geometry);

const heading = (theme, x, label) =>
    `<text x="${x + LAYOUT.pad}" y="${LAYOUT.headingY}" font-size="${TYPE.heading}" fill="${theme.accent}">${escapeXml(label)}</text>`;

function card(theme, slot, label, content) {
    const x = slot * (CARD_WIDTH + LAYOUT.gap);
    const frame = panel({ x, width: CARD_WIDTH, height: LAYOUT.height, fill: theme.surface, stroke: theme.line });
    return `<g class="p-rise" ${delayed(slot * LAYOUT.cardStagger)}>${frame}${heading(theme, x, label)}${content(x)}</g>`;
}

function statRow(theme, x, { glyph, label, value }, index) {
    const { stats } = LAYOUT;
    const y = stats.firstRow + index * stats.rowHeight;
    const delay = stats.start + index * stats.stagger;
    const icon = `<g transform="translate(${x + LAYOUT.pad} ${y - stats.glyphRise})">${GLYPHS[glyph](theme.accent)}</g>`;
    const name = `<text x="${x + stats.labelX}" y="${y}" font-size="${TYPE.body}" fill="${theme.muted}">${escapeXml(label)}</text>`;
    const figure = countUp({
        x: x + VALUE_X,
        y,
        value,
        delay: delay + stats.countLead,
        attributes: `font-size="${TYPE.body}" text-anchor="end" fill="${theme.text}"`,
    });
    return `<g class="p-fade" ${delayed(delay)}>${icon}${name}</g>${figure}`;
}

function statsCard(theme, stats) {
    const rows = STATS_ROWS.map(({ glyph, label, field }) => ({ glyph, label: LABELS[label], value: stats[field] }));
    return card(theme, LAYOUT.slots.stats, LABELS.stats, (x) =>
        rows.map((row, index) => statRow(theme, x, row, index)).join(""),
    );
}

function ring(theme, cx, progress) {
    const { ring: spec } = LAYOUT;
    const circumference = 2 * Math.PI * spec.radius;
    const dash = fixed(circumference);
    const shape = `cx="${cx}" cy="${spec.y}" r="${spec.radius}" fill="none" stroke-width="${spec.stroke}"`;
    const track = `<circle ${shape} stroke="${theme.line}"/>`;
    const arc = `<circle class="p-ring" ${shape} stroke="${theme.accent}" stroke-linecap="round" stroke-dasharray="${dash}" stroke-dashoffset="${fixed(circumference * (1 - progress))}" transform="rotate(${spec.rotation} ${cx} ${spec.y})" style="--c:${dash}"/>`;
    return track + arc;
}

function caption(theme, cx, y, content) {
    return `<text x="${cx}" y="${y}" font-size="${TYPE.caption}" text-anchor="middle" fill="${theme.muted}">${content}</text>`;
}

function streakCard(theme, { current, best }) {
    const { ring: spec, streakCaption } = LAYOUT;
    const progress = best.length ? Math.max(spec.min, Math.min(1, current / best.length)) : 0;
    const range = best.start ? [best.start, best.end].map(shortDate).join(LABELS.rangeSeparator) : LABELS.noStreak;
    return card(theme, LAYOUT.slots.streak, LABELS.streak, (x) => {
        const cx = x + CARD_WIDTH / 2;
        const figure = countUp({
            x: cx,
            y: spec.y + spec.figureDrop,
            value: current,
            delay: spec.countStart,
            attributes: `font-size="${TYPE.figure}" text-anchor="middle" fill="${theme.text}"`,
        });
        const now = `${escapeXml(LABELS.streakNow)} <tspan fill="${theme.glow}">${best.length}</tspan>`;
        return (
            ring(theme, cx, progress) +
            figure +
            caption(theme, cx, streakCaption.nowY, now) +
            caption(theme, cx, streakCaption.rangeY, escapeXml(range))
        );
    });
}

function languageBar(x, languages, colors) {
    const { bar } = LAYOUT;
    const usable = CARD_WIDTH - LAYOUT.pad * 2 - (languages.length - 1) * bar.gap - languages.length * bar.min;
    let offset = x + LAYOUT.pad;
    const segments = languages.map((language, index) => {
        const width = bar.min + (usable * language.share) / PERCENT;
        const segment = `<rect x="${fixed(offset)}" y="${bar.y}" width="${fixed(width)}" height="${bar.height}" rx="${bar.radius}" fill="${colors[index]}"/>`;
        offset += width + bar.gap;
        return segment;
    });
    return `<g class="p-grow">${segments.join("")}</g>`;
}

function languageRow(theme, x, language, color, index) {
    const { languages: rows } = LAYOUT;
    const y = rows.firstRow + index * rows.rowHeight;
    const dot = `<circle cx="${x + rows.dotX}" cy="${y - rows.dotRise}" r="${rows.dotRadius}" fill="${color}"/>`;
    const name = `<text x="${x + rows.labelX}" y="${y}" font-size="${TYPE.body}" fill="${theme.muted}">${escapeXml(language.name)}</text>`;
    const share = `<text x="${x + VALUE_X}" y="${y}" font-size="${TYPE.body}" text-anchor="end" fill="${theme.text}">${language.share.toFixed(PRECISION.share)}%</text>`;
    return `<g class="p-fade" ${delayed(rows.start + index * rows.stagger)}>${dot}${name}${share}</g>`;
}

function languagesCard(theme, languages) {
    const colors = LANGUAGE_COLORS.map((token) => theme[token]);
    return card(theme, LAYOUT.slots.languages, LABELS.languages, (x) => {
        const rows = languages.map((language, index) => languageRow(theme, x, language, colors[index], index));
        return languageBar(x, languages, colors) + rows.join("");
    });
}

export function cards(theme, stats) {
    const streak = streaks(stats.days);
    const languages = topLanguages(stats.languages);
    return svgDocument({
        height: LAYOUT.height,
        title: DESCRIPTIONS.cards({ stats, streak, language: languages[0]?.name }),
        style: `${RING}\n${GROW}`,
        body: [statsCard(theme, stats), streakCard(theme, streak), languagesCard(theme, languages)].join("\n"),
    });
}
