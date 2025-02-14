"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Cafe = { id: number; name: string; location: string };

export const CafeList = () => {
  const [cafes, setCafes] = useState<Cafe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/cafes")
    .then((res) => res.json())
      .then((data) => {
        setCafes(data.cafes);
        setLoading(false);
      })
      .catch((error) => console.error("Error fetching cafes:", error));
  }, []);

  return (
    <div>
      <h1>Cafes</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {cafes.map((cafe) => (
            <Link key={cafe.id} href={`/cafes/${cafe.id}`}>
              <div 
                style={{ cursor: "pointer", padding: "10px", border: "1px solid white", margin: "5px" }}
              >
                <h2>{cafe.name}</h2>
                <p>{cafe.location}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default CafeList;
