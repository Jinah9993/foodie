"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ReviewForm from "./ReviewForm";
import ReviewItem from "./ReviewItem";

type Cafe = { id: number; name: string; location: string };
type Review = { id: number; cafeId: number; reviewer: string; content: string; rating: number };

interface CafeDetailsProps {
  cafeId: string;
}

const CafeDetails = ({ cafeId }: CafeDetailsProps) => {
  const [cafe, setCafe] = useState<Cafe | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!cafeId) return;

    fetch(`/api/cafes/${cafeId}`)
      .then((res) => res.json())
      .then((data) => setCafe(data.cafe))
      .catch((error) => console.error("Error fetching cafe:", error));

    fetch(`/api/reviews?cafeId=${cafeId}`)
      .then((res) => res.json())
      .then((data) => {
        setReviews(data.reviews || []);
        setLoading(false);
      })
      .catch((error) => console.error("Error fetching reviews:", error));
  }, [cafeId]);

  const handleReviewAdded = (newReview: Review) => {
    setReviews([...reviews, newReview]);
  };

  const handleDeleteReview = async (reviewId: number) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      const res = await fetch(`/api/reviews/${reviewId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        console.error("Failed to delete review");
        return;
      }

      setReviews(reviews.filter((review) => review.id !== reviewId));
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  const handleUpdateReview = (updatedReview: Review) => {
    setReviews(reviews.map((r) => (r.id === updatedReview.id ? updatedReview : r)));
  };

  return (
    <div>
      <button onClick={() => router.push("/")}>← Back to List</button>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {cafe && (
            <div>
              <h1>{cafe.name}</h1>
              <p>{cafe.location}</p>
            </div>
          )}

        
          <ReviewForm cafeId={cafeId} onReviewAdded={handleReviewAdded} />

          <h2>Reviews</h2>
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review.id} style={{ border: "1px solid gray", padding: "10px", margin: "5px" }}>
                <p><strong>{review.reviewer}</strong></p>
                <p>{review.content}</p>
                <p>Rating: {review.rating}</p>
                <button onClick={() => handleDeleteReview(review.id)} className="text-red-500">Delete</button>
              </div>
            ))
          ) : (
            <p>No reviews yet.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CafeDetails;
