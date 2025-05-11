const env = process.env.NODE_ENV;
if (env !== "production") {
  process.exit(0);
}

const execSync = (await import("child_process")).execSync;
execSync("npx prisma migrate deploy && npm run seed && npm run build", {
  stdio: "inherit",
});
