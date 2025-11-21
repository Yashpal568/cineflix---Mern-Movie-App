import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import "./editMovie.css";

export default function EditMovie() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [err, setErr] = useState("");

  // ---------------- Load Movie ----------------
  useEffect(() => {
    api
      .get(`/movies/${id}`)
      .then((res) => {
        const m = res.data.data.movie;
        setData({
          name: m.name || "",
          duration: m.duration || "",
          ratings: m.ratings || "",
          releaseYear: m.releaseYear || "",
          genres: (m.genres || []).join(", "),
          directors: (m.directors || []).join(", "),
          coverImage: m.coverImage || "",
          actors: (m.actors || []).join(", "),
          description: m.description || "",
          price: m.price || "",
        });
      })
      .catch((e) => setErr(e.response?.data?.message || "Failed to load movie"));
  }, [id]);

  const handleChange = (e) =>
    setData({ ...data, [e.target.name]: e.target.value });

  // ---------------- Update Movie ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    try {
      await api.patch(`/movies/${id}`, {
        ...data,
        genres: data.genres.split(",").map((s) => s.trim()),
        directors: data.directors.split(",").map((s) => s.trim()),
        actors: data.actors.split(",").map((s) => s.trim()),
        duration: Number(data.duration),
        ratings: Number(data.ratings),
        releaseYear: Number(data.releaseYear),
        price: Number(data.price),
      });

      navigate(`/movie/${id}`);
    } catch (e) {
      setErr(e.response?.data?.message || "Update failed");
    }
  };

  if (!data)
    return <div className="edit-loading">Loading movie details…</div>;

  return (
    <div className="edit-wrapper">
      <h2 className="edit-title">Edit Movie</h2>

      {err && <p className="edit-error">{err}</p>}

      <form onSubmit={handleSubmit} className="edit-form">

        {/* LEFT SIDE INPUTS */}
        <div className="edit-left">

          <input
            name="name"
            placeholder="Movie Name"
            value={data.name}
            onChange={handleChange}
            className="edit-input"
          />

          <input
            name="duration"
            placeholder="Duration (mins)"
            value={data.duration}
            onChange={handleChange}
            className="edit-input"
          />

          <input
            name="ratings"
            placeholder="Ratings (0–10)"
            value={data.ratings}
            onChange={handleChange}
            className="edit-input"
          />

          <input
            name="releaseYear"
            placeholder="Release Year"
            value={data.releaseYear}
            onChange={handleChange}
            className="edit-input"
          />

          <input
            name="genres"
            placeholder="Genres (comma separated)"
            value={data.genres}
            onChange={handleChange}
            className="edit-input"
          />

          <input
            name="directors"
            placeholder="Directors (comma separated)"
            value={data.directors}
            onChange={handleChange}
            className="edit-input"
          />

          <input
            name="actors"
            placeholder="Actors (comma separated)"
            value={data.actors}
            onChange={handleChange}
            className="edit-input"
          />

          <input
            name="coverImage"
            placeholder="Cover Image URL"
            value={data.coverImage}
            onChange={handleChange}
            className="edit-input"
          />

          <textarea
            name="description"
            placeholder="Movie Description"
            value={data.description}
            onChange={handleChange}
            className="edit-textarea"
          />

          <input
            name="price"
            placeholder="Price"
            value={data.price}
            onChange={handleChange}
            className="edit-input full"
          />

          <button className="edit-btn2 full">Save Changes</button>
        </div>

        {/* RIGHT SIDE — POSTER PREVIEW */}
        <div className="edit-right">
          <p className="preview-title">Poster Preview</p>

          <img
            src={data.coverImage}
            alt="Poster"
            className="preview-img"
            onError={(e) =>
              (e.target.src = "https://placehold.co/400x600?text=No+Image")
            }
          />
        </div>
      </form>
    </div>
  );
}
