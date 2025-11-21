import { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import api from "../../api/axios";
import "./AdminPanel.css";

export default function AdminPanel() {
  const [totalMovies, setTotalMovies] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const movieRes = await api.get("/movies?limit=100");
        const movies = movieRes.data.data.movies;

        setTotalMovies(movies.length);
        const avg =
          movies.reduce((sum, m) => sum + (m.ratings || 0), 0) /
          movies.length;
        setAverageRating(avg.toFixed(1));

        const userRes = await api.get("/users/getAllUsers");
        setTotalUsers(userRes.data.data.users.length);
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="admin-wrapper">
      <Sidebar />

      <div className="admin-main">
        <h1 className="admin-title">Admin Dashboard</h1>

        <div className="admin-grid">
          <div className="stat-card">
            <p className="stat-label">Total Movies</p>
            <p className="stat-value">{totalMovies}</p>
          </div>

          <div className="stat-card">
            <p className="stat-label">Users Registered</p>
            <p className="stat-value">{totalUsers}</p>
          </div>

          <div className="stat-card">
            <p className="stat-label">Average Rating</p>
            <p className="stat-value">{averageRating}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
