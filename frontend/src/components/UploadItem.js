import React, { useState } from "react";
import axios from "axios";

function UploadItem() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("lost");
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("location", location);
    formData.append("status", status);
    if (image) formData.append("image", image);

    try {
      await axios.post("http://localhost:5000/api/items", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Item uploaded!");
      setTitle("");
      setDescription("");
      setLocation("");
      setStatus("lost");
      setImage(null);
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="upload-form">
      <div className="form-row">
        <label>
          Title
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Black Samsung Phone" required />
        </label>
        <label>
          Status
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="lost">Lost</option>
            <option value="found">Found</option>
          </select>
        </label>
      </div>
      <label>
        Description
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe where and when it was lost/found" required />
      </label>
      <div className="form-row">
        <label>
          Location
          <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Campus cafe, office, park..." required />
        </label>
        <label>
          Photo
          <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
        </label>
      </div>
      <button type="submit">Post item</button>
    </form>
  );
}

export default UploadItem;
