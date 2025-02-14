"use client";

import { useState } from "react";

interface ReviewFormProps {
  cafeId: string;
  onReviewAdded: (newReview: { id: number; cafeId: number; reviewer: string; content: string; rating: number }) => void;
}

const ReviewForm = ({ cafeId, onReviewAdded }: ReviewFormProps) => {
  const [reviewer, setReviewer] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState<number | "">("");

  const addReview = async () => {
    if (!reviewer || !content || !rating) {
      alert("Please fill in all fields!");
      return;
    }

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cafeId,
          reviewer,
          content,
          rating: Number(rating),
        }),
      });

      if (!res.ok) {
        const errorMessage = await res.text();
        throw new Error(errorMessage || "Failed to add review");
      }

      const data = await res.json();
      onReviewAdded(data.newReview);
      setReviewer("");
      setContent("");
      setRating("");
    } catch (error) {
      alert("An error occurred while adding the review.");
    }
  };

  return (
    <div style={{ marginTop: "20px", borderTop: "1px solid gray", paddingTop: "10px" }}>
      <h3>Add a Review</h3>
      <input
        type="text"
        placeholder="Your Name"
        value={reviewer}
        onChange={(e) => setReviewer(e.target.value)}
        style={{ display: "block", marginBottom: "5px" }}
      />
      <textarea
        placeholder="Write your review..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        style={{ display: "block", marginBottom: "5px" }}
      />
      <input
        type="number"
        placeholder="Rating (1-5)"
        value={rating}
        onChange={(e) => setRating(e.target.value ? Number(e.target.value) : "")}
        min="1"
        max="5"
        style={{ display: "block", marginBottom: "5px" }}
      />
      <button onClick={addReview}>Submit Review</button>
    </div>
  );
};

export default ReviewForm;
