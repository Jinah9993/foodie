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

  const onDeleteReview = (reviewId: number) => {
    console.log(`Removing review ID ${reviewId} from state`);
    setReviews((prevReviews) => prevReviews.filter((review) => review.id !== reviewId));
};


  
  const handleUpdateReview = async (updatedReview: Review) => {
    try {
      const res = await fetch(`/api/reviews/${updatedReview.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: updatedReview.content, rating: updatedReview.rating }),
      });

      if (!res.ok) {
        console.error("Failed to update review");
        return;
      }

      setReviews((prevReviews) =>
        prevReviews.map((r) => (r.id === updatedReview.id ? updatedReview : r))
      );
    } catch (error) {
      console.error("Error updating review:", error);
    }
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
              <ReviewItem
                key={review.id}
                review={review}
                onDeleteReview={onDeleteReview}
                onUpdateReview={handleUpdateReview}
              />
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
