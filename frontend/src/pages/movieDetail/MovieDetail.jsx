import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate, useParams } from "react-router-dom";
import "./movieDetail.css";

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    api
      .get(`/movies/${id}`)
      .then((res) => setMovie(res.data.data.movie))
      .catch((e) => setErr(e.response?.data?.message || "Movie not found"));
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Delete this movie?")) return;

    try {
      await api.delete(`/movies/${id}`);
      navigate("/");
    } catch (e) {
      alert("Failed to delete movie");
    }
  };

  if (err) return <div className="detail-error">{err}</div>;
  if (!movie) return <div className="detail-loading">Loading...</div>;

  return (
    <div className="detail-wrapper">
      <div className="detail-card">
        
        {movie.coverImage && (
          <div className="detail-poster">
            <img src={movie.coverImage} alt={movie.name} />
          </div>
        )}

        <h1 className="detail-title">{movie.name}</h1>

        <p className="detail-description">{movie.description}</p>

        <div className="detail-info">
          {movie.genres?.length > 0 && (
            <p><span>🎭 Genres:</span> {movie.genres.join(", ")}</p>
          )}

          {movie.directors?.length > 0 && (
            <p><span>🎬 Directors:</span> {movie.directors.join(", ")}</p>
          )}

          <p><span>⭐ Rating:</span> {movie.ratings} / 10</p>
        </div>

        <div className="detail-buttons">
          <button
            onClick={() => navigate(`/edit/${movie._id}`)}
            className="detail-btn edit-btn"
          >
            Edit Movie
          </button>

          <button
            onClick={handleDelete}
            className="detail-btn delete-btn"
          >
            Delete Movie
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
