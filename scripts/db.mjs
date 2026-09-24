// Starts and stops the local Supabase stack, which runs with Docker inside WSL
// (Docker Desktop does not work on this Windows/ARM64 setup).
//
// WSL shuts the distro down when no Windows process is attached to it, which
// would take the database down in the middle of development. `start` therefore
// keeps a hidden `sleep infinity` session open until `stop` ends it.
//
// Usage: node scripts/db.mjs <start|stop|status|reset|test|types>

import { spawn, spawnSync } from "node:child_process";
import { existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";

const DISTRO = process.env.WSL_DISTRO ?? "Ubuntu";
const PID_FILE = "supabase/.temp/wsl-keepalive.pid";
const TYPES_FILE = "lib/db/database.types.ts";

function wsl(args, options = {}) {
  return spawnSync("wsl.exe", ["-d", DISTRO, "--", ...args], { stdio: "inherit", ...options });
}

function keepAlivePid() {
  if (!existsSync(PID_FILE)) return undefined;
  const pid = Number(readFileSync(PID_FILE, "utf8"));
  try {
    process.kill(pid, 0); // throws if the process no longer exists
    return pid;
  } catch {
    return undefined;
  }
}

function startKeepAlive() {
  if (keepAlivePid()) return;
  const child = spawn("wsl.exe", ["-d", DISTRO, "--", "sleep", "infinity"], {
    detached: true,
    stdio: "ignore",
    windowsHide: true,
  });
  child.unref();
  writeFileSync(PID_FILE, String(child.pid));
}

function stopKeepAlive() {
  const pid = keepAlivePid();
  if (pid) process.kill(pid);
  rmSync(PID_FILE, { force: true });
}

function waitForDocker() {
  for (let attempt = 0; attempt < 30; attempt++) {
    if (wsl(["docker", "info"], { stdio: "ignore" }).status === 0) return;
    spawnSync("powershell.exe", ["-NoProfile", "-Command", "Start-Sleep -Seconds 1"]);
  }
  console.error(`Docker in WSL (${DISTRO}) is not responding. See README → Local database.`);
  process.exit(1);
}

const command = process.argv[2];

switch (command) {
  case "start": {
    startKeepAlive();
    waitForDocker();
    const result = wsl(["supabase", "start"]);
    if (result.status !== 0) stopKeepAlive();
    process.exit(result.status ?? 1);
  }
  case "stop": {
    const result = wsl(["supabase", "stop"]);
    stopKeepAlive();
    process.exit(result.status ?? 1);
  }
  case "status":
    process.exit(wsl(["supabase", "status"]).status ?? 1);
  case "reset":
    process.exit(wsl(["supabase", "db", "reset"]).status ?? 1);
  case "test":
    process.exit(wsl(["supabase", "test", "db"]).status ?? 1);
  case "types": {
    // Generates TypeScript types from the local database schema.
    const result = wsl(["supabase", "gen", "types", "typescript", "--local"], {
      stdio: ["ignore", "pipe", "inherit"],
      encoding: "utf8",
    });
    if (result.status !== 0) process.exit(result.status ?? 1);
    writeFileSync(TYPES_FILE, result.stdout);
    console.log(`Wrote ${TYPES_FILE}`);
    break;
  }
  default:
    console.error("Usage: node scripts/db.mjs <start|stop|status|reset|test|types>");
    process.exit(1);
}
