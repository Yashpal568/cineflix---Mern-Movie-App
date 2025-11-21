import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import Sidebar from "../../components/sidebar/Sidebar";
import "./AdminMovieEdit.css";

const AdminMovieEdit = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editMovie, setEditMovie] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    ratings: "",
    duration: "",
    releaseYear: "",
  });

  // Fetch movies
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await api.get("/movies?limit=100");
        setMovies(res.data.data.movies || []);
      } catch (err) {
        console.error("Failed to fetch movies", err);
        setError("Failed to load movies");
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleEditClick = (movie) => {
    setEditMovie(movie._id);
    setFormData({
      name: movie.name || "",
      description: movie.description || "",
      ratings: movie.ratings || "",
      duration: movie.duration || "",
      releaseYear: movie.releaseYear || "",
    });
  };

  const handleSave = async (id) => {
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        ratings: Number(formData.ratings),
        duration: Number(formData.duration),
        releaseYear: Number(formData.releaseYear),
      };

      const res = await api.patch(`/movies/${id}`, payload);

      const updated =
        res?.data?.data?.updateMovie ||
        res?.data?.data?.movie ||
        res?.data?.data?.updatedMovie;

      if (!updated) {
        alert("Backend did not return updated movie!");
        return;
      }

      setMovies((prev) => prev.map((m) => (m._id === id ? updated : m)));

      setEditMovie(null);
    } catch (err) {
      console.error("Update failed:", err.response?.data || err);
      alert(err.response?.data?.message || "Update failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this movie permanently?")) return;

    try {
      await api.delete(`/movies/${id}`);
      setMovies((prev) => prev.filter((m) => m._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete movie");
    }
  };

  return (
    <div className="admin-edit-wrapper">
      <Sidebar />

      <div className="admin-edit-main">
        <h1 className="admin-edit-title">Edit Movies</h1>

        {loading ? (
          <p className="text-gray-400">Loading movies...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <>
            {/* =======================
                DESKTOP TABLE VIEW
            ======================== */}
            <div className="table-box desktop-table">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Rating</th>
                    <th>Duration</th>
                    <th>Year</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {movies.map((movie, index) => (
                    <tr key={movie._id}>
                      <td>{index + 1}</td>

                      <td>
                        {editMovie === movie._id ? (
                          <input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="table-input"
                          />
                        ) : (
                          movie.name
                        )}
                      </td>

                      <td>
                        {editMovie === movie._id ? (
                          <input
                            name="ratings"
                            type="number"
                            value={formData.ratings}
                            onChange={handleChange}
                            className="table-input"
                          />
                        ) : (
                          movie.ratings
                        )}
                      </td>

                      <td>
                        {editMovie === movie._id ? (
                          <input
                            name="duration"
                            type="number"
                            value={formData.duration}
                            onChange={handleChange}
                            className="table-input"
                          />
                        ) : (
                          movie.duration
                        )}
                      </td>

                      <td>
                        {editMovie === movie._id ? (
                          <input
                            name="releaseYear"
                            type="number"
                            value={formData.releaseYear}
                            onChange={handleChange}
                            className="table-input"
                          />
                        ) : (
                          movie.releaseYear
                        )}
                      </td>

                      <td className="text-center">
                        {editMovie === movie._id ? (
                          <>
                            <button
                              className="action-btn save-btn"
                              onClick={() => handleSave(movie._id)}
                            >
                              Save
                            </button>
                            <button
                              className="action-btn cancel-btn"
                              onClick={() => setEditMovie(null)}
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              className="action-btn edit-btn"
                              onClick={() => handleEditClick(movie)}
                            >
                              Edit
                            </button>
                            <button
                              className="action-btn del-btn"
                              onClick={() => handleDelete(movie._id)}
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* =======================
                MOBILE CARD VIEW
            ======================== */}
            <div className="mobile-edit-list">
              {movies.map((movie) => (
                <div className="mobile-card" key={movie._id}>
                  <h4>{movie.name}</h4>

                  <div className="mobile-field">
                    <label>Rating</label>
                    <input
                      className="mobile-input"
                      disabled={editMovie !== movie._id}
                      value={
                        editMovie === movie._id
                          ? formData.ratings
                          : movie.ratings
                      }
                      name="ratings"
                      onChange={handleChange}
                    />
                  </div>

                  <div className="mobile-field">
                    <label>Duration</label>
                    <input
                      className="mobile-input"
                      disabled={editMovie !== movie._id}
                      value={
                        editMovie === movie._id
                          ? formData.duration
                          : movie.duration
                      }
                      name="duration"
                      onChange={handleChange}
                    />
                  </div>

                  <div className="mobile-field">
                    <label>Year</label>
                    <input
                      className="mobile-input"
                      disabled={editMovie !== movie._id}
                      value={
                        editMovie === movie._id
                          ? formData.releaseYear
                          : movie.releaseYear
                      }
                      name="releaseYear"
                      onChange={handleChange}
                    />
                  </div>

                  <div className="mobile-actions">
                    {editMovie === movie._id ? (
                      <>
                        <button
                          className="mobile-btn save"
                          onClick={() => handleSave(movie._id)}
                        >
                          Save
                        </button>
                        <button
                          className="mobile-btn cancel"
                          onClick={() => setEditMovie(null)}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="mobile-btn edit"
                          onClick={() => handleEditClick(movie)}
                        >
                          Edit
                        </button>
                        <button
                          className="mobile-btn delete"
                          onClick={() => handleDelete(movie._id)}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminMovieEdit;
