// netlify/functions/get-followup-entries.js

import { createClient } from "@libsql/client/node";

exports.handler = async (event, context) => {
    if (event.httpMethod !== "GET") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        const client = createClient({
            url: process.env.TURSO_DATABASE_URL,
            authToken: process.env.TURSO_AUTH_TOKEN,
        });

        // The SELECT * query automatically picks up all columns, including 'teamMember'
        const rs = await client.execute("SELECT * FROM followups ORDER BY sNo ASC");

        const data = rs.rows.map(row => {
            const entry = {};
            rs.columns.forEach((col, index) => {
                entry[col] = row[index];
            });

            // Parse JSON fields
            if (entry.updateHistory) {
                entry.updateHistory = JSON.parse(entry.updateHistory);
            }
            // Ensure sNo is a number
            if (entry.sNo) {
                 entry.sNo = Number(entry.sNo);
            }

            return entry;
        });

        return {
            statusCode: 200,
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
            },
        };

    } catch (error) {
        console.error("Database error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to retrieve entries: " + error.message }),
        };
    }
};
