import { defineCommand } from "citty";
import { listArticles } from "../../lib/news";

export const listCommand = defineCommand({
  meta: {
    name: "list",
    description: "List stored news articles and sentiment records from local SQLite",
  },
  args: {
    json: {
      type: "boolean",
      description: "Output in clean JSON format for automated pipelines and AI sessions",
      default: false,
    },
  },
  run({ args }) {
    try {
      const articles = listArticles();

      if (args.json) {
        // Output clean JSON to stdout for piping and AI analysis
        console.log(JSON.stringify(articles, null, 2));
        return;
      }

      if (articles.length === 0) {
        console.log("No news articles stored in database yet. Run 'fetch' first!");
        return;
      }

      console.log(`Stored News Articles (${articles.length} records):`);
      console.log("=".repeat(80));

      for (const art of articles) {
        const sentimentStr =
          art.sentiment > 0.1
            ? `🟢 POSITIVE (+${art.sentiment.toFixed(2)})`
            : art.sentiment < -0.1
              ? `🔴 NEGATIVE (${art.sentiment.toFixed(2)})`
              : `⚪️ NEUTRAL (${art.sentiment.toFixed(2)})`;

        console.log(`Title:    ${art.title}`);
        console.log(`Link:     ${art.url}`);
        console.log(`Status:   ${sentimentStr}`);
        console.log(`Time:     ${art.publishedAt}`);
        console.log("-".repeat(80));
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.error(`Error listing articles: ${errorMsg}`);
      process.exit(1); // Standard exit code failure
    }
  },
});
