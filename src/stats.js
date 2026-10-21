import { LABELS } from "./config.js";
import { PERCENT, STATS_RULES } from "./constants.js";

export function topLanguages(languages) {
    const sorted = [...languages].sort((a, b) => b.size - a.size);
    const total = sorted.reduce((sum, language) => sum + language.size, 0) || 1;
    const top = sorted
        .slice(0, STATS_RULES.topLanguages)
        .map(({ name, size }) => ({ name, share: (size / total) * PERCENT }));
    const rest = PERCENT - top.reduce((sum, language) => sum + language.share, 0);
    return rest >= STATS_RULES.minOtherPercent ? [...top, { name: LABELS.otherLanguages, share: rest }] : top;
}

function bestStreak(days) {
    let best = { length: 0, start: null, end: null };
    let run = 0;
    let start = null;
    for (const day of days) {
        if (day.count === 0) {
            run = 0;
            continue;
        }
        if (run === 0) start = day.date;
        run += 1;
        if (run > best.length) best = { length: run, start, end: day.date };
    }
    return best;
}

function currentStreak(days) {
    const today = days.length - 1;
    let length = 0;
    for (let index = today; index >= 0; index -= 1) {
        if (days[index].count > 0) length += 1;
        else if (index !== today) break;
    }
    return length;
}

export function streaks(days) {
    return { current: currentStreak(days), best: bestStreak(days) };
}

export function contributionLevel(count) {
    if (count === 0) return 0;
    const { levelThresholds } = STATS_RULES;
    const index = levelThresholds.findIndex((threshold) => count <= threshold);
    return index === -1 ? levelThresholds.length + 1 : index + 1;
}

export const toUtcDate = (date) => new Date(`${date}${STATS_RULES.utcMidnight}`);

export function shortDate(date) {
    return toUtcDate(date).toLocaleString(STATS_RULES.dateLocale, STATS_RULES.dateFormat).toLowerCase();
}
