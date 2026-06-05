import { Database } from "bun:sqlite";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";

// biome-ignore lint/complexity/noStaticOnlyClass: conforms to canonical SQLite playbook factory structure
export class DatabaseFactory {
  private static instance: Database | null = null;

  public static getDatabase(filepath = "data/news.db"): Database {
    if (!DatabaseFactory.instance) {
      // Ensure the parent directory of the database file exists
      const parentDir = dirname(filepath);
      try {
        mkdirSync(parentDir, { recursive: true });
      } catch {
        // Ignore folder already exists errors
      }

      DatabaseFactory.instance = new Database(filepath);

      // CRITICAL: Configure performance and concurrency pragmas in WAL mode
      DatabaseFactory.instance.exec("PRAGMA journal_mode = WAL;");
      DatabaseFactory.instance.exec("PRAGMA synchronous = NORMAL;");
      DatabaseFactory.instance.exec("PRAGMA busy_timeout = 5000;");

      // Auto-migrate schema on startup
      DatabaseFactory.instance.exec(`
        CREATE TABLE IF NOT EXISTS news (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          url TEXT NOT NULL,
          sentiment REAL NOT NULL,
          is_read INTEGER DEFAULT 0,
          published_at TEXT NOT NULL
        );
      `);
    }
    return DatabaseFactory.instance;
  }
}
