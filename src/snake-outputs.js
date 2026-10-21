import { THEMES } from "./config.js";
import { PATHS, SNAKE_OUTPUT } from "./constants.js";

const { name, delimiter, snakeParam, dotsParam } = SNAKE_OUTPUT;

const lines = Object.entries(THEMES).map(([mode, theme]) => {
    const params = new URLSearchParams({ [snakeParam]: theme.glow, [dotsParam]: theme.levels.join() });
    return `${PATHS.snake(mode)}?${decodeURIComponent(params)}`;
});

console.log(`${name}<<${delimiter}\n${lines.join("\n")}\n${delimiter}`);
