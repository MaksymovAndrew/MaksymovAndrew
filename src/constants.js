export const GITHUB_API = "https://api.github.com/graphql";
export const GITHUB_QUERY_LIMITS = { repositories: 100, languages: 10 };
export const TOKEN_ENV = "GITHUB_TOKEN";
export const DATA_FLAG = "--data";
export const ENCODING = "utf8";

const OUT_DIR = "dist";

export const PATHS = {
    out: OUT_DIR,
    block: (name, mode) => `${OUT_DIR}/${name}-${mode}.svg`,
    snake: (mode) => `${OUT_DIR}/snake-${mode}.svg`,
    icon: (name) => new URL(`../icons/${name}.svg`, import.meta.url),
};

export const BLOCKS = {
    terminal: "terminal",
    stack: "stack",
    cards: "cards",
    activity: "activity",
};

export const SNAKE_OUTPUT = {
    name: "outputs",
    delimiter: "SNAKE_OUTPUTS_EOF",
    snakeParam: "color_snake",
    dotsParam: "color_dots",
};

export const CANVAS = {
    width: 840,
    radius: 14,
    hairline: 0.5,
    font: "ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace",
};

export const TYPE = {
    heading: 15,
    body: 12.5,
    caption: 12,
    terminal: 14,
    windowTitle: 12.5,
    figure: 30,
};

export const PRECISION = {
    share: 1,
    geometry: 1,
    time: 2,
};

export const PERCENT = 100;

export const STATS_RULES = {
    topLanguages: 4,
    minOtherPercent: 0.05,
    levelThresholds: [2, 5, 9],
    daysPerWeek: 7,
    utcMidnight: "T00:00:00Z",
    dateLocale: "en-US",
    dateFormat: { month: "short", day: "numeric", timeZone: "UTC" },
};

export const SVG_DATA_URI = "data:image/svg+xml;base64,";
export const NBSP = " ";
export const SPACE_RUN = / {2,}/g;

export const GLYPH_STROKE = 1.4;

export const COUNT_UP = {
    frames: 12,
    frameDuration: 0.07,
    easePower: 3,
};

export const TERMINAL_LAYOUT = {
    barHeight: 36,
    padX: 20,
    padBottom: 20,
    lineHeight: 23,
    firstLineOffset: 30,
    linesPerEntry: 2,
    dotRadius: 6,
    dotStep: 18,
    titleX: 76,
    titleBaseline: 22.5,
    prompt: "$ ",
    cursor: { offset: 16, width: 8, height: 16, rise: 13 },
};

export const TERMINAL_MOTION = {
    start: 0.7,
    promptLead: 0.1,
    charDelay: 0.045,
    afterCommand: 0.25,
    afterOutput: 0.3,
};

export const STACK_LAYOUT = {
    gap: 8,
    top: 4,
    tileRadius: 9,
    iconScale: 0.52,
    start: 0.15,
    stagger: 0.05,
};

export const CARDS_LAYOUT = {
    gap: 12,
    height: 204,
    pad: 18,
    headingY: 32,
    cardStagger: 0.12,
    slots: { stats: 0, streak: 1, languages: 2 },
    stats: { firstRow: 66, rowHeight: 27, labelX: 42, glyphRise: 11, start: 0.35, stagger: 0.08, countLead: 0.1 },
    ring: { radius: 40, y: 98, stroke: 6, min: 0.04, figureDrop: 10, countStart: 0.45, rotation: -90 },
    streakCaption: { nowY: 166, rangeY: 185 },
    bar: { y: 48, height: 8, radius: 2, gap: 2, min: 3 },
    languages: { firstRow: 86, rowHeight: 24, dotX: 22, dotRadius: 4, dotRise: 4, labelX: 34, start: 0.6, stagger: 0.08 },
};

export const ACTIVITY_LAYOUT = {
    header: 48,
    headingY: 32,
    bottom: 18,
    side: 20,
    grid: { cell: 11, step: 14, top: 8, radius: 2 },
};
