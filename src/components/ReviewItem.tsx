"use client";

import { useState } from "react";

type Review = {
  id: number;
  cafeId: number;
  reviewer: string;
  content: string;
  rating: number;
};

interface ReviewItemProps {
  review: Review;
  onDeleteReview: (id: number) => void;
  onUpdateReview: (updatedReview: Review) => void;
}

const ReviewItem = ({ review, onDeleteReview, onUpdateReview }: ReviewItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(review.content);
  const [editedRating, setEditedRating] = useState(review.rating);

  const deleteReview = async () => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      const res = await fetch(`/api/reviews/${review.id}`, { method: "DELETE" });

      if (!res.ok) {
        console.error("Failed to delete review");
        return;
      }

      onDeleteReview(review.id);
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  const saveEdit = async () => {
    try {
      const res = await fetch(`/api/reviews/${review.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: editedContent, rating: editedRating }),
      });

      const data = await res.json();
      if (data.success) {
        onUpdateReview(data.updatedReview);
        setIsEditing(false);
      } else {
        console.error("Failed to update review");
      }
    } catch (error) {
      console.error("Error updating review:", error);
    }
  };

  return (
    <div className="border p-2 m-2">
      {isEditing ? (
        <div>
          <input
            type="text"
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
          />
          <input
            type="number"
            value={editedRating}
            onChange={(e) => setEditedRating(Number(e.target.value))}
          />
          <button onClick={saveEdit}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      ) : (
        <div>
          <p>{review.content} - {review.reviewer} (⭐ {review.rating})</p>
          <button onClick={() => setIsEditing(true)}>Edit</button>
          <button onClick={deleteReview} className="text-red-500">Delete</button>
        </div>
      )}
    </div>
  );
};

export default ReviewItem;
