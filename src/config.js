export const USER = "MaksymovAndrew";

export const THEMES = {
    dark: {
        bg: "#0B0E14",
        surface: "#11151E",
        tile: "#151A25",
        line: "#212837",
        text: "#E8EBF2",
        muted: "#97A0B3",
        faint: "#7A8496",
        accent: "#6FC7FF",
        glow: "#A78BFA",
        ok: "#7FD88F",
        warm: "#E9C46A",
        levels: ["#1A2030", "#3A5F7F", "#4D84AC", "#60A9DA", "#6FC7FF"],
    },
    light: {
        bg: "#F5F7FA",
        surface: "#FFFFFF",
        tile: "#EDF1F6",
        line: "#D9E0EA",
        text: "#111927",
        muted: "#4E5A6B",
        faint: "#606C7E",
        accent: "#0B66B5",
        glow: "#7C5CD6",
        ok: "#137A3D",
        warm: "#9A6B00",
        levels: ["#E3E9F1", "#91B7DA", "#619ACD", "#327EC0", "#0B66B5"],
    },
};

export const LANGUAGE_COLORS = ["accent", "glow", "warm", "ok", "faint"];

export const STATS_ROWS = [
    { glyph: "calendar", label: "contributions", field: "contributions" },
    { glyph: "commit", label: "commits", field: "commits" },
    { glyph: "pull", label: "pullRequests", field: "pullRequests" },
    { glyph: "star", label: "stars", field: "stars" },
    { glyph: "repo", label: "publicRepos", field: "publicRepos" },
];

export const TERMINAL = {
    title: "andrii@maksymov: ~",
    dots: ["#FF5F57", "#FEBC2E", "#28C840"],
    lines: [
        { command: "whoami", output: "andrii maksymov · frontend developer", tone: "muted" },
        { command: "cat stack.txt", output: "react · next.js · typescript · scss · jest", tone: "muted" },
        { command: "ls ~/projects", output: "portfolio/   cooking-assistant/", tone: "accent" },
        { command: "echo $STATUS", output: "● open to remote · wrocław, poland", tone: "ok" },
        { command: "open portfolio", output: "→ andrii-maksymov.tech", tone: "glow" },
    ],
};

export const STACK = [
    "javascript",
    "typescript",
    "react",
    "nextjs",
    "redux",
    "sass",
    "tailwindcss",
    "vitejs",
    "storybook",
    "jest",
    "playwright",
    "nodejs",
    "postgresql",
    "docker",
    "githubactions",
    "figma",
];

export const LABELS = {
    stats: "GitHub stats",
    contributions: "Contributions",
    commits: "Commits",
    pullRequests: "Pull requests",
    stars: "Stars",
    publicRepos: "Public repos",
    streak: "Streak",
    streakNow: "days now · best",
    noStreak: "no streak yet",
    rangeSeparator: " - ",
    languages: "Top languages",
    otherLanguages: "Other",
    activity: "Contribution snake",
    activityTotal: "contributions · last year",
};

export const DESCRIPTIONS = {
    profile: (titles) => titles.join(". "),
    terminal: (lines) => lines.map(({ output }) => output).join(" · "),
    stack: (names) => `Stack: ${names.join(", ")}`,
    cards: ({ stats, streak, language }) =>
        `${stats.contributions} contributions, ${stats.commits} commits, ${stats.pullRequests} pull requests; streak ${streak.current} days, best ${streak.best.length}; top language ${language ?? "none"}`,
    activity: (total) => `Contribution snake: ${total} contributions in the last year`,
};
