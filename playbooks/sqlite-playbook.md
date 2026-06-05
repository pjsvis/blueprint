---
date: 2026-05-20
status: canonical
tags: [playbook, database, sqlite, bun]
---

# SQLite Best Practices Playbook (Modern bun:sqlite Setup)

## Purpose
This playbook establishes the architectural design patterns, configurations, and coding practices for managing data storage using **modern `bun:sqlite`**. It details the non-legacy database configuration to ensure high-performance, single-connection safety, and type coherence between TypeScript/Bun and the database.

---

## Non-Legacy Setup Configuration

Legacy Node setups rely on complex ORMs or asynchronous native wrappers (like `sqlite3` or `better-sqlite3`). In our modern stack, we utilize **`bun:sqlite`** which provides direct, sync, ultra-high-speed bindings compiled directly into the Bun runtime.

### 1. Connection Management (`DatabaseFactory`)
To prevent connection leaks, lock contentions, and handle busy-states correctly, we **NEVER** instantiate the database via raw `new Database()` calls inside individual services. We manage database instances strictly using a unified `DatabaseFactory`.

```typescript
import { Database } from "bun:sqlite";

export class DatabaseFactory {
  private static instance: Database | null = null;

  public static getDatabase(filepath = "storage.db"): Database {
    if (!DatabaseFactory.instance) {
      DatabaseFactory.instance = new Database(filepath);
      
      // CRITICAL: Configure performance and concurrency pragmas
      DatabaseFactory.instance.exec("PRAGMA journal_mode = WAL;");
      DatabaseFactory.instance.exec("PRAGMA synchronous = NORMAL;");
      DatabaseFactory.instance.exec("PRAGMA busy_timeout = 5000;"); // 5s timeout to avoid lock errors
    }
    return DatabaseFactory.instance;
  }
}
```

> [!IMPORTANT]
> **WAL Mode (Write-Ahead Logging):** Allows concurrent readers and a single writer to operate simultaneously without locking the database.
> **Synchronous Normal:** Offers high performance while remaining extremely resilient to crashes.
> **Busy Timeout:** Configures SQLite to wait for up to 5000ms when a database file is locked before throwing a `SQLITE_BUSY` error.

---

## Schema Drift Guard & Migration

* Keep database schema in a central SQL file (e.g. `src/server/lib/schema.sql`).
* On application startup, ensure the database initialization script executes the schema using `Database.exec(schemaText)` to guarantee database structures are in sync, or run schema checks inside dry-runs.
* Store workspace database location settings under a standardized `semantic-graph.settings.json` file to allow local overrides.

---

## Strict Type Coherence & Precisions

SQLite has dynamic typing (Integer, Real, Text, Blob, Null). In TypeScript development, mismatching types between dynamic query outcomes and strict schemas causes subtle bugs. Follow these rules:

### 1. Ensure Exact Number Types on REAL columns
SQLite represents floats as `REAL`. By default, queries on `REAL` columns can occasionally yield representation issues or be interpreted strictly as generic numbers. Always parse or map real database columns explicitly inside data interfaces.
* **Rule:** If a column represents exact numerical coordinates, pricing metrics, or float data types, always execute a type assertion or run a helper mapper (e.g. `parseFloat()`) to guarantee correct TypeScript types.

```typescript
interface DBRow {
  id: number;
  symbol: string;
  price: number; // REAL column in SQLite
}

export function fetchSymbolPrice(db: Database, symbol: string): number {
  const query = db.prepare("SELECT price FROM prices WHERE symbol = ? LIMIT 1");
  const result = query.get(symbol) as { price: unknown } | undefined;

  if (!result) throw new Error(`Symbol price not found: ${symbol}`);
  
  // Rule: Guarantee standard float type parsing
  return parseFloat(String(result.price));
}
```

### 2. Standardized Boolean Management
SQLite does not have a native `Boolean` datatype. Boolean values must be saved as integers (`1` for true, `0` for false).
* **Rule:** Map columns explicitly to `boolean` values on fetch and cast them to `0` or `1` during parameters binding.
```typescript
interface UserRecord {
  id: number;
  name: string;
  is_active: boolean;
}

// Fetch Mapper
const rawUser = query.get(userId) as { id: number; name: string; is_active: number };
const user: UserRecord = {
  ...rawUser,
  is_active: rawUser.is_active === 1,
};
```
