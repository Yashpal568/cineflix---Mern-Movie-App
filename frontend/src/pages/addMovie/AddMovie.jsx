import React, { useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import "./addMovie.css";

const initial = {
  name: "",
  duration: "",
  ratings: "",
  releaseYear: "",
  genres: "",
  directors: "",
  coverImage: "",
  actors: "",
  description: "",
  price: "",
};

const AddMovie = () => {
  const [data, setData] = useState(initial);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setData({ ...data, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    try {
      const payload = {
        ...data,
        genres: data.genres?.split(",").map((s) => s.trim()),
        directors: data.directors?.split(",").map((s) => s.trim()),
        actors: data.actors?.split(",").map((s) => s.trim()),
        duration: Number(data.duration),
        ratings: Number(data.ratings),
        releaseYear: Number(data.releaseYear),
        price: Number(data.price),
      };

      await api.post("/movies", payload);
      navigate("/");
    } catch (err) {
      setErr(err.response?.data?.message || "Failed to add movie");
    }
  };

  return (
    <div className="add-wrapper">

      <h2 className="add-title">Add New Movie</h2>
      {err && <p className="add-error">{err}</p>}

      <form onSubmit={handleSubmit} className="add-form">

        <input name="name" placeholder="Movie Name" value={data.name}
          onChange={handleChange} className="add-input" />

        <input name="duration" placeholder="Duration (mins)" value={data.duration}
          onChange={handleChange} className="add-input" />

        <input name="ratings" placeholder="Ratings (0-10)" value={data.ratings}
          onChange={handleChange} className="add-input" />

        <input name="releaseYear" placeholder="Release Year" value={data.releaseYear}
          onChange={handleChange} className="add-input" />

        <input name="genres" placeholder="Genres (comma separated)" value={data.genres}
          onChange={handleChange} className="add-input" />

        <input name="directors" placeholder="Directors (comma separated)" value={data.directors}
          onChange={handleChange} className="add-input" />

        <input name="actors" placeholder="Actors (comma separated)" value={data.actors}
          onChange={handleChange} className="add-input" />

        <input name="coverImage" placeholder="Cover Image URL" value={data.coverImage}
          onChange={handleChange} className="add-input" />

        <textarea name="description" placeholder="Movie Description"
          value={data.description} onChange={handleChange}
          className="add-textarea"></textarea>

        <input name="price" placeholder="Price" value={data.price}
          onChange={handleChange} className="add-input full-width" />

        <button className="add-btn full-width">Save Movie</button>
      </form>

      {/* Poster Preview */}
      {data.coverImage && (
        <div className="preview-container">
          <p className="preview-text">Poster Preview:</p>
          <img
            src={data.coverImage}
            alt="Preview"
            className="preview-img"
            onError={(e) =>
              (e.target.src = "https://placehold.co/400x600?text=No+Image")
            }
          />
        </div>
      )}
    </div>
  );
};

export default AddMovie;
