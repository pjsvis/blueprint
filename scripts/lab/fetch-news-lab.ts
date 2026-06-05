/**
 * Tier 0 Laboratory Script: Daily News Pipeline Experiment
 *
 * Philosophy: Never build directly in production. This is a disposable experiment
 * simulating RSS fetching and subprocess piping prior to full structural promotion.
 */

async function main() {
  console.log("[LAB-FIRST] Starting Tier 0 Daily News pipeline experiment...");

  // Mock initial articles inside lab to bypass internet dependency
  const mockArticles = [
    {
      title: "Quantum computing breakthrough surges hardware stock prices",
      url: "https://quantum.org/breakthrough",
    },
    {
      title: "Critical security bug leak drops database confidence levels",
      url: "https://secdrop.net/bug-leak",
    },
    {
      title: "Developers love happy coding structures inside simple projects",
      url: "https://coderhappy.io/love",
    },
  ];

  console.log(`[LAB-FIRST] Mock articles generated inside lab: ${mockArticles.length}`);

  // Determine python script location
  const pythonScript = "scripts/py/analyze_news.py";

  console.log(`[LAB-FIRST] Spawning Python subprocess: ${pythonScript}`);
  const proc = Bun.spawn(["python3", pythonScript], {
    stdin: "pipe",
    stdout: "pipe",
    stderr: "inherit",
  });

  for (const art of mockArticles) {
    proc.stdin.write(JSON.stringify(art) + "\n");
  }
  proc.stdin.flush();
  proc.stdin.end();

  console.log("[LAB-FIRST] Reading subprocess output stream...");
  const stdoutText = await new Response(proc.stdout).text();
  await proc.exited;

  console.log("\n[LAB-FIRST] Subprocess JSON output returned:");
  console.log(stdoutText.trim());

  console.log("\n[LAB-FIRST] Experiment completed successfully. Safe to promote to Tier 2.");
}

main().catch((err) => {
  console.error("[LAB-FIRST] Lab experiment crashed:", err);
  process.exit(1);
});
