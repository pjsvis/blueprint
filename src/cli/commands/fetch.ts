import { defineCommand } from "citty";
import { analyzeSentimentSubprocess, fetchExternalNews, storeArticles } from "../../lib/news";

export const fetchCommand = defineCommand({
  meta: {
    name: "fetch",
    description: "Fetch news from RSS feed and run sentiment analysis via Python bridge",
  },
  args: {
    limit: {
      type: "string",
      description: "Maximum number of articles to fetch",
      default: "5",
      alias: "l",
    },
  },
  async run({ args }) {
    const limitNum = Number.parseInt(args.limit, 10) || 5;
    console.log(`Starting Daily News fetch process (limit: ${limitNum})...`);

    try {
      console.log("Fetching articles from Hacker News RSS...");
      const rawArticles = await fetchExternalNews(limitNum);
      console.log(`Successfully fetched ${rawArticles.length} raw articles.`);

      console.log("Spawning Python sentiment analysis subprocess bridge...");
      const processedArticles = await analyzeSentimentSubprocess(rawArticles);
      console.log("Sentiment processing completed.");

      console.log("Persisting processed articles to local WAL SQLite database...");
      storeArticles(processedArticles);

      console.log("\nFetched & Analyzed Articles:");
      for (const art of processedArticles) {
        const sentimentStr =
          art.sentiment > 0.1
            ? `🟢 +${art.sentiment.toFixed(2)}`
            : art.sentiment < -0.1
              ? `🔴 ${art.sentiment.toFixed(2)}`
              : `⚪️ ${art.sentiment.toFixed(2)}`;
        console.log(` - [${sentimentStr}] ${art.title}`);
      }

      console.log("\nPipeline execution completed successfully.");
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.error(`Pipeline failure: ${errorMsg}`);
      process.exit(1); // Explicit exit code on pipeline failures
    }
  },
});
