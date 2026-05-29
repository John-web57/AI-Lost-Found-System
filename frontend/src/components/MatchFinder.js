import React, { useEffect, useState } from "react";
import axios from "axios";

function MatchFinder() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/items?matches=true")
      .then((res) => {
        setItems(res.data);
      })
      .catch((err) => {
        console.error(err);
        setError("Unable to load match suggestions.");
      })
      .finally(() => setLoading(false));
  }, []);

  const matchedItems = items.filter((item) => item.matchSuggestions?.length > 0);
  const lostItems = matchedItems.filter((item) => item.status === "lost");
  const foundItems = matchedItems.filter((item) => item.status === "found");

  return (
    <section className="match-finder">
      <div className="match-header">
        <h2>Match Finder</h2>
        <p>See the most likely lost/found pairs based on item details.</p>
      </div>

      {loading ? (
        <p className="empty-state">Loading match suggestions…</p>
      ) : error ? (
        <p className="empty-state">{error}</p>
      ) : matchedItems.length === 0 ? (
        <p className="empty-state">No matches found yet. Add more lost or found reports to generate suggestions.</p>
      ) : (
        <div className="match-grid">
          {[...lostItems, ...foundItems].map((item) => (
            <article key={item._id} className={`item-card ${item.status}`}>
              <div className="item-card-top">
                <span className="item-status">{item.status.toUpperCase()}</span>
                <h3>{item.title}</h3>
              </div>
              <p>{item.description}</p>
              <p className="item-meta">Location: {item.location}</p>
              {item.matchSuggestions?.length > 0 && (
                <div className="match-suggestions">
                  <h4>Top matches</h4>
                  <ul>
                    {item.matchSuggestions.map((match) => (
                      <li key={match._id}>
                        <strong>{match.title}</strong>
                        <span>({match.status})</span>
                        <span>{match.location}</span>
                        <span className="match-score">Score: {match.score}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default MatchFinder;
