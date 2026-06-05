/**
 * Maintenance Script: Clean Merged Git Branches
 * Scans local git branches and safely deletes any that have already been merged
 * into the main/master integration branch.
 */

async function runCommand(cmd: string[]): Promise<string> {
  const process = Bun.spawn({
    cmd,
    stdout: "pipe",
    stderr: "pipe",
  });

  const stdout = await new Response(process.stdout).text();
  const stderr = await new Response(process.stderr).text();

  const exitCode = await process.exited;
  if (exitCode !== 0) {
    throw new Error(`Command failed: ${cmd.join(" ")}\nStderr: ${stderr}`);
  }

  return stdout.trim();
}

async function cleanMergedBranches(): Promise<boolean> {
  console.log("Auditing local git branches for merged process barnacles...");

  let integrationBranch = "main";

  try {
    const branchesList = await runCommand(["git", "branch", "--list"]);
    const hasMain = branchesList.includes("main");
    const hasMaster = branchesList.includes("master");

    if (!hasMain && hasMaster) {
      integrationBranch = "master";
    }

    console.log(`Using "${integrationBranch}" as the integration target branch.`);
  } catch (_error) {
    console.error(
      "Git repository not detected or git command is not available. Skipping branch cleanup.",
    );
    return true;
  }

  try {
    // Get list of local branches merged into the integration branch
    const mergedOutput = await runCommand(["git", "branch", "--merged", integrationBranch]);

    const branchesToDelete = mergedOutput
      .split("\n")
      .map((line) => line.trim().replace(/^\*\s+/, "")) // Strip current branch asterisk
      .filter((branch) => {
        return (
          branch.length > 0 &&
          branch !== integrationBranch &&
          branch !== "main" &&
          branch !== "master" &&
          !branch.startsWith("feat/keep-") // Standard convention to protect marked branches
        );
      });

    if (branchesToDelete.length === 0) {
      console.log("No merged branches found. Local git workspace is completely clean.");
      return true;
    }

    console.log(`Found ${branchesToDelete.length} merged branch(es) to clean up:`);
    for (const branch of branchesToDelete) {
      console.log(`  Cleaning: "${branch}"`);
      await runCommand(["git", "branch", "-d", branch]);
    }

    console.log("Safe branch cleanup successfully completed.");
    return true;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Error during branch cleanup: ${message}`);
    return false;
  }
}

const success = await cleanMergedBranches();
if (!success) {
  process.exit(1);
}
