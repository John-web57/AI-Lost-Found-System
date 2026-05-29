import React, { useEffect, useState } from "react";
import axios from "axios";

function ItemList() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    axios.get("http://localhost:5000/api/items")
      .then((res) => setItems(res.data))
      .catch((err) => console.error(err));
  }, []);

  const filteredItems = items.filter((item) => filter === "all" || item.status === filter);

  return (
    <div className="item-list">
      <div className="item-list-header">
        <h2>Community Board</h2>
        <div className="status-filters">
          {['all', 'lost', 'found'].map((option) => (
            <button
              key={option}
              type="button"
              className={filter === option ? 'active' : ''}
              onClick={() => setFilter(option)}
            >
              {option === 'all' ? 'All' : option.charAt(0).toUpperCase() + option.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <p className="empty-state">No items yet. Add the first lost or found item!</p>
      ) : (
        <div className="item-grid">
          {filteredItems.map((item) => (
            <article key={item._id} className={`item-card ${item.status}`}>
              <div className="item-card-top">
                <span className="item-status">{item.status.toUpperCase()}</span>
                <h3>{item.title}</h3>
              </div>
              <p>{item.description}</p>
              <p className="item-meta">Location: {item.location}</p>
              {item.image && (
                <img src={`http://localhost:5000/uploads/${item.image}`} alt={item.title} />
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default ItemList;
