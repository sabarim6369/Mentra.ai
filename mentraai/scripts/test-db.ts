import { db } from "../src/db";
import { sql } from "drizzle-orm";

async function testLatency() {
    console.log("Testing database latency...");
    const start = Date.now();
    try {
        await db.execute(sql`SELECT 1`);
        const end = Date.now();
        console.log(`Database connection successful.`);
        console.log(`Latency: ${end - start}ms`);
    } catch (error) {
        console.error("Database connection failed:", error);
    }
    process.exit(0);
}

testLatency();
