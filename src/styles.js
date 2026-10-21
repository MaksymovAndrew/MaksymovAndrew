import { CANVAS, COUNT_UP } from "./constants.js";

const EASE = "cubic-bezier(.2,.8,.2,1)";
const REVEAL_DELAY = ".5s";

export const BASE = `text{font-family:${CANVAS.font}}
.p-rise{animation:p-rise .7s ${EASE} both}
.p-pop{transform-box:fill-box;transform-origin:center;animation:p-pop .5s ${EASE} both}
.p-in{animation:p-in .01s linear both}
.p-fade{animation:p-fade .45s ease both}
.p-flash{fill-opacity:0;animation:p-flash ${COUNT_UP.frameDuration}s linear}
@keyframes p-rise{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
@keyframes p-pop{0%{opacity:0;transform:translateY(8px) scale(.6)}70%{opacity:1;transform:translateY(-2px) scale(1.06)}100%{opacity:1;transform:none}}
@keyframes p-in{from{fill-opacity:0}to{fill-opacity:1}}
@keyframes p-fade{from{opacity:0;transform:translateX(-6px)}to{opacity:1;transform:none}}
@keyframes p-flash{from,to{fill-opacity:1}}`;

export const BLINK = ".p-blink{animation:p-blink 1s steps(1) infinite}@keyframes p-blink{50%{opacity:0}}";

export const RING = `.p-ring{animation:p-ring 1.4s ${EASE} ${REVEAL_DELAY} both}@keyframes p-ring{from{stroke-dashoffset:var(--c)}}`;

export const GROW = `.p-grow{transform-box:fill-box;transform-origin:left;animation:p-grow .9s ${EASE} ${REVEAL_DELAY} both}@keyframes p-grow{from{transform:scaleX(0)}}`;

export const REDUCED_MOTION = "@media (prefers-reduced-motion:reduce){*{animation:none!important}}";
