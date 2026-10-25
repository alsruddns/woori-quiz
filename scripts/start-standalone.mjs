import { cp, mkdir } from "node:fs/promises";
import { spawn } from "node:child_process";
import path from "node:path";

const root = process.cwd();
const standalone = path.join(root, ".next", "standalone");
await cp(path.join(root, "public"), path.join(standalone, "public"), { recursive: true, force: true });
await mkdir(path.join(standalone, ".next"), { recursive: true });
await cp(path.join(root, ".next", "static"), path.join(standalone, ".next", "static"), { recursive: true, force: true });

const server = spawn(process.execPath, ["server.js"], {
  cwd: standalone,
  env: { ...process.env, PORT: process.env.PORT ?? "3005", HOSTNAME: process.env.HOSTNAME ?? "127.0.0.1" },
  stdio: "inherit",
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => server.kill(signal));
}
server.on("error", (error) => {
  console.error(error);
  process.exitCode = 1;
});
server.on("exit", (code, signal) => {
  process.exitCode = code ?? (signal ? 1 : 0);
});
