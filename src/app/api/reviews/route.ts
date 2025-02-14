import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req: Request) { 
  let client;

  try {
    const url = new URL(req.url);
    const cafeId = url.searchParams.get("cafeId");

    if (!cafeId) {
      return NextResponse.json({ success: false, error: "Missing cafeId in query parameters" }, { status: 400 });
    }

    client = await pool.connect();
    const reviewResult = await client.query("SELECT * FROM reviews WHERE cafeId = $1", [cafeId]);

    if (reviewResult.rows.length === 0) {
      return NextResponse.json({ success: false, error: "No reviews found for this cafe" }, { status: 404 });
    }

    return NextResponse.json({ success: true, reviews: reviewResult.rows });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message });
  } finally {
    if (client) client.release();
  }
}

export async function POST(req: Request) {
  let client;

  try {
    const body = await req.json();
    const { cafeId, reviewer, content, rating } = body;

    if (!cafeId || !reviewer || !content || isNaN(rating)) {
      return NextResponse.json({ success: false, error: "Invalid input" }, { status: 400 });
    }

    client = await pool.connect();
    const result = await client.query(
      "INSERT INTO reviews (cafeId, reviewer, content, rating) VALUES ($1, $2, $3, $4) RETURNING *",
      [cafeId, reviewer, content, rating]
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ success: false, error: "Failed to insert review" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Review added successfully!", newReview: result.rows[0] });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  } finally {
    if (client) client.release();
  }
}
