/** LeetCode — single source of truth for resume + chat */
export const leetcodeProfile = {
  username: "divyansh_raj_02",
  profileUrl: "https://leetcode.com/u/divyansh_raj_02/",
  totalSolved: 125,
  displayTotal: "125+",
  easy: 52,
  medium: 64,
  hard: 9,
  consistencyBadge: "50 Days Badge 2026",
} as const;

export function leetcodeSummaryLine(): string {
  const p = leetcodeProfile;
  return `LeetCode: ${p.totalSolved} problems solved (${p.displayTotal} on profile) — Easy ${p.easy}, Medium ${p.medium}, Hard ${p.hard}. Profile: ${p.profileUrl}`;
}
