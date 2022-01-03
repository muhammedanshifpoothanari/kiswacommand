const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const EMAIL = "muhammedanshifpoothanari@gmail.com";
const NAME = "Muhammed Anshif";
const REPO_PATH = __dirname;

// Topics and actions for commit messages
const topics = [
  "HTML structure", "CSS Flexbox", "CSS Grid", "Responsive Design",
  "JavaScript Variables", "JavaScript Loops", "JavaScript Functions", "DOM Selectors",
  "Fetch API", "Promises", "Async/Await", "ES6 Classes",
  "React Components", "React Props", "React State (useState)", "React Effects (useEffect)",
  "Express routing", "Express Middleware", "REST API design",
  "MongoDB Connection", "Mongoose Schemas", "JWT Authentication",
  "TypeScript Types", "Next.js App Router", "Docker Containers"
];

const actions = [
  "docs: update notes on {topic}",
  "feat: add practice exercises for {topic}",
  "fix: resolve logic issue in {topic} exercise",
  "refactor: clean up and optimize {topic} code",
  "test: add basic tests for {topic}"
];

// Configure local Git
execSync(`git config user.email "${EMAIL}"`, { cwd: REPO_PATH });
execSync(`git config user.name "${NAME}"`, { cwd: REPO_PATH });

// Set up learning log file
const logPath = path.join(REPO_PATH, "learning-log.md");
fs.writeFileSync(logPath, "# Developer Learning Log\n\nDaily updates of topics learned and coded.\n\n");

// Helper to get random number in range
const randomRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Date range: Jan 1, 2022 to Jul 15, 2026
let currentDate = new Date("2022-01-01T09:00:00");
const endDate = new Date("2026-07-15T17:00:00");

console.log("Generating commits. Please wait...");
let totalCommits = 0;

while (currentDate <= endDate) {
  const year = currentDate.getFullYear();
  const dayOfWeek = currentDate.getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  
  // Custom commit chance and density per year
  let commitChance = isWeekend ? 0.25 : 0.65;
  let numCommits = 0;

  if (Math.random() < commitChance) {
    if (year === 2025) {
      // Keep 2023 as light/medium (1 to 3 commits)
      numCommits = Math.random() < 0.6 ? 1 : (Math.random() < 0.8 ? 2 : 3);
    } else {
      // 2022, 2024, 2025, 2026 gets random dark green commits (5 to 12 commits)
      numCommits = randomRange(5, 12);
    }

    for (let i = 0; i < numCommits; i++) {
      const topic = topics[Math.floor(Math.random() * topics.length)];
      const actionTemplate = actions[Math.floor(Math.random() * actions.length)];
      const commitMsg = actionTemplate.replace("{topic}", topic);

      // Generate random time on this day
      const commitTime = new Date(currentDate);
      commitTime.setHours(randomRange(9, 21));
      commitTime.setMinutes(randomRange(0, 59));
      commitTime.setSeconds(randomRange(0, 59));

      // Format date strictly without milliseconds and "Z" to avoid git parse errors
      const pad = (num) => String(num).padStart(2, '0');
      const dateStr = `${commitTime.getFullYear()}-${pad(commitTime.getMonth() + 1)}-${pad(commitTime.getDate())}T${pad(commitTime.getHours())}:${pad(commitTime.getMinutes())}:${pad(commitTime.getSeconds())}`;

      // Update log file
      fs.appendFileSync(logPath, `* **${dateStr.split('T')[0]}**: Learned and worked on ${topic}.\n`);

      // Git add & commit with backdating
      execSync('git add .', { cwd: REPO_PATH });
      
      const env = {
        ...process.env,
        GIT_AUTHOR_NAME: NAME,
        GIT_AUTHOR_EMAIL: EMAIL,
        GIT_COMMITTER_NAME: NAME,
        GIT_COMMITTER_EMAIL: EMAIL,
        GIT_AUTHOR_DATE: dateStr,
        GIT_COMMITTER_DATE: dateStr
      };

      try {
        execSync(`git commit -m "${commitMsg}"`, {
          cwd: REPO_PATH,
          env: env,
          stdio: 'pipe'
        });
      } catch (err) {
        console.error(`Git commit failed for date ${dateStr} with message: "${commitMsg}"`);
        console.error(err.stderr ? err.stderr.toString() : err.message);
        process.exit(1);
      }

      totalCommits++;
    }
  }

  // Advance by 1 day
  currentDate.setDate(currentDate.getDate() + 1);
}

console.log(`Successfully generated ${totalCommits} commits!`);
console.log("You can now push these changes to GitHub using:");
console.log("git push -u origin main --force");
