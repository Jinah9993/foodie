import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req: Request, context: { params: { id: string } }) {
  let client;

  try {
    const { id } = context.params;
    client = await pool.connect();
    
    const reviewId = parseInt(id, 10);
    const reviewResult = await client.query("SELECT * FROM reviews WHERE id = $1", [reviewId]);

    if (!reviewResult || !reviewResult.rows || reviewResult.rows.length === 0) {
      return NextResponse.json({ success: false, error: "Review not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, review: reviewResult.rows[0] });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message });
  } finally {
    if (client) client.release();
  }
}

export async function DELETE(req: Request, context: { params: { id: string } }) {
    let client;
  
    try {
      const params = await context.params; 
      const { id } = params; 
  
      client = await pool.connect();
      
      const reviewId = parseInt(id, 10);
      const reviewResult = await client.query("SELECT * FROM reviews WHERE id = $1", [reviewId]);
  
      if (!reviewResult.rows.length) {
        return NextResponse.json({ success: false, error: "Review not found" }, { status: 404 });
      }
  
      await client.query("DELETE FROM reviews WHERE id = $1", [reviewId]);
  
      return NextResponse.json({ success: true, message: "Review deleted successfully!" });
    } catch (error) {
      return NextResponse.json({ success: false, error: (error as Error).message });
    } finally {
      if (client) client.release();
    }
  }
  

export async function PUT(req: Request, context: { params: { id: string } }) {
  let client;

  try {
    const { id } = context.params;
    const body = await req.json();
    const { content, rating } = body;

    if (!content || isNaN(rating)) {
      return NextResponse.json({ success: false, error: "Invalid input" }, { status: 400 });
    }

    client = await pool.connect();
    const result = await client.query(
      "UPDATE reviews SET content = $1, rating = $2 WHERE id = $3 RETURNING *",
      [content, rating, id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ success: false, error: "Review not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Review updated successfully!", updatedReview: result.rows[0] });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  } finally {
    if (client) client.release();
  }
}
