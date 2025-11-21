import { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import api from "../../api/axios";
import './stats.css';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function Stats() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true); // Ensure loading is true at the start
        const res = await api.get("/movies/movie-stats");
        // Safer data access and default to empty array
        setStats(res.data?.data?.stats || []); 
      } catch (err) {
        console.error("Failed to load stats", err);
        setStats([]); // Set to empty on error
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  // Format and sort the data. Sorting ensures "Top Genre" is correct.
  const formatted = stats.map((s) => ({
    genre: Array.isArray(s._id) ? s._id.join(", ") : s._id,
    count: s.movieCount,
    avgRating: Number(s.avgRating?.toFixed(1)),
  })).sort((a, b) => b.count - a.count); // Sort by count descending

  const totalMovies = formatted.reduce((sum, f) => sum + f.count, 0);

  return (
    <div className="flex">
      <Sidebar />

      <div className="lg:ml-60 flex-1 p-4 sm:p-6 lg:p-8 min-h-screen bg-[#0d0f14] text-white">
        
        {/* === LOADING STATE === */}
        {loading ? (
          <div className="flex justify-center items-center h-[calc(100vh-100px)]">
            <h2 className="text-2xl font-semibold text-gray-400">Loading Analytics...</h2>
          </div>
        ) : (
        
        /* === LOADED CONTENT === */
        <>
          <h1 className="text-3xl font-extrabold mb-6 text-[#9b5cff] tracking-wide">
            Movie Analytics
          </h1>

          {/* TOP CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            <div className="stats-card">
              <h3 className="stats-label">Total Movies</h3>
              <p className="stats-value">{totalMovies}</p>
            </div>
            <div className="stats-card">
              <h3 className="stats-label">Genres Count</h3>
              <p className="stats-value">{formatted.length}</p>
            </div>
            <div className="stats-card">
              <h3 className="stats-label">Top Genre</h3>
              <p className="stats-value text-xl">
                {/* This is now guaranteed to be the top one */}
                {formatted.length > 0 ? formatted[0].genre : "-"}
              </p>
            </div>
          </div>

          {/* BAR CHART */}
       
          <div className="stats-section"> 
            <h2 className="section-title">Movies Per Genre</h2>
            <div className="bg-[#0d0f14] p-1 rounded-xl">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={formatted}>
                  <XAxis dataKey="genre" stroke="#aaa" fontSize={12} />
                  <YAxis stroke="#aaa" />
                  <Tooltip
                    contentStyle={{
                      background: "#13151b",
                      border: "1px solid rgba(255,255,255,0.2)",
                      color: "white",
                      borderRadius: "8px"
                    }}
                    cursor={{ fill: 'rgba(155, 92, 255, 0.1)' }}
                  />
                  <Bar dataKey="count" fill="#9b5cff" radius={6} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* TABLE */}
          <div className="stats-section">
            <h2 className="section-title">Genre Breakdown</h2>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-gray-300 border-b border-gray-700">
                  <th className="table-head">Genre</th>
                  <th className="table-head">Movie Count</th>
                  <th className="table-head">Avg Rating</th>
                </tr>
              </thead>
              <tbody>
                {formatted.map((f) => (
                  <tr
                    key={f.genre}
                    className="border-b border-gray-800 hover:bg-[#181a20] transition"
                  >
                    <td className="table-cell">{f.genre}</td>
                    <td className="table-cell">{f.count}</td>
                    <td className="table-cell">{f.avgRating || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
        )}
      </div>
    </div>
  );
}