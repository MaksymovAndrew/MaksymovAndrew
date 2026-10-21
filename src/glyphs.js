import { GLYPH_STROKE } from "./constants.js";

const stroke = (color) => `fill="none" stroke="${color}" stroke-width="${GLYPH_STROKE}" stroke-linejoin="round"`;

export const GLYPHS = {
    calendar: (color) =>
        `<rect x="1" y="2.5" width="12" height="10.5" rx="2" ${stroke(color)}/><path d="M1 6h12M4.5 1v3M9.5 1v3" ${stroke(color)}/>`,
    commit: (color) => `<circle cx="7" cy="7" r="3" ${stroke(color)}/><path d="M0 7h4M10 7h4" ${stroke(color)}/>`,
    pull: (color) =>
        `<circle cx="3.5" cy="3" r="2" ${stroke(color)}/><circle cx="3.5" cy="11.5" r="2" ${stroke(color)}/><circle cx="10.5" cy="11.5" r="2" ${stroke(color)}/><path d="M3.5 5v4.5M10.5 9.5V5.5a2 2 0 0 0-2-2H6" ${stroke(color)}/>`,
    star: (color) => `<path d="M7 1l1.8 3.8 4.2.5-3.1 2.9.8 4.1L7 10.3 3.3 12.3l.8-4.1L1 5.3l4.2-.5z" ${stroke(color)}/>`,
    repo: (color) => `<path d="M3 1.5h8.5v11H3a1.5 1.5 0 0 1 0-3h8.5" ${stroke(color)}/>`,
};
