import { USER } from "./config.js";
import { GITHUB_API, GITHUB_QUERY_LIMITS } from "./constants.js";

const QUERY = `query($login: String!) {
    user(login: $login) {
        contributionsCollection {
            totalCommitContributions
            contributionCalendar {
                totalContributions
                weeks { contributionDays { date contributionCount } }
            }
        }
        pullRequests { totalCount }
        repositories(first: ${GITHUB_QUERY_LIMITS.repositories}, ownerAffiliations: OWNER, isFork: false) {
            nodes {
                isPrivate
                stargazerCount
                languages(first: ${GITHUB_QUERY_LIMITS.languages}, orderBy: { field: SIZE, direction: DESC }) {
                    edges { size node { name } }
                }
            }
        }
    }
}`;

async function query(token) {
    const response = await fetch(GITHUB_API, {
        method: "POST",
        headers: { authorization: `bearer ${token}`, "content-type": "application/json" },
        body: JSON.stringify({ query: QUERY, variables: { login: USER } }),
    });
    const body = await response.json();
    if (!response.ok || body.errors) {
        throw new Error(`GitHub API: ${JSON.stringify(body.errors ?? body)}`);
    }
    return body.data.user;
}

function sumLanguages(repositories) {
    const sizes = new Map();
    for (const { languages } of repositories) {
        for (const { size, node } of languages.edges) {
            sizes.set(node.name, (sizes.get(node.name) ?? 0) + size);
        }
    }
    return [...sizes].map(([name, size]) => ({ name, size }));
}

export async function fetchStats(token) {
    const user = await query(token);
    const { contributionCalendar, totalCommitContributions } = user.contributionsCollection;
    const repositories = user.repositories.nodes;
    const publicRepositories = repositories.filter((repository) => !repository.isPrivate);

    return {
        contributions: contributionCalendar.totalContributions,
        commits: totalCommitContributions,
        pullRequests: user.pullRequests.totalCount,
        stars: publicRepositories.reduce((sum, repository) => sum + repository.stargazerCount, 0),
        publicRepos: publicRepositories.length,
        languages: sumLanguages(repositories),
        days: contributionCalendar.weeks.flatMap((week) =>
            week.contributionDays.map((day) => ({ date: day.date, count: day.contributionCount })),
        ),
    };
}
