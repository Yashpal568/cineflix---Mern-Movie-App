import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import "./Home.css";

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const [genre, setGenre] = useState("");
  const [rating, setRating] = useState("");
  const [year, setYear] = useState("");
  const [sort, setSort] = useState("-ratings");

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const limit = 6;

  const years = useMemo(() => {
    const list = [];
    const current = new Date().getFullYear();
    for (let y = current; y >= 2000; y--) list.push(y);
    return list;
  }, []);

  const buildQuery = () => {
    const params = [];

    if (genre) params.push(`genres=${genre}`);
    if (rating) params.push(`ratings[gte]=${rating}`);
    if (year) params.push(`releaseYear=${year}`);
    if (sort) params.push(`sort=${sort}`);

    params.push(`page=${page}`);
    params.push(`limit=${limit}`);

    return `/movies?${params.join("&")}`;
  };

  const fetchMovies = async (append = false) => {
    try {
      setLoading(true);
      const res = await api.get(buildQuery());
      const newMovies = res.data?.data?.movies || [];

      setHasMore(newMovies.length === limit);

      setMovies((prev) => (append ? [...prev, ...newMovies] : newMovies));
      setErr("");
    } catch (e) {
      setErr("Failed to load movies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchMovies(false);
  }, [genre, rating, year, sort]);

  useEffect(() => {
    if (page !== 1) fetchMovies(true);
  }, [page]);

  useEffect(() => {
    fetchMovies(false);
  }, []);

  return (
    <div className="home-wrapper">

      {/* FILTER SECTION */}
      <div className="filters-container">

        <select value={genre} onChange={(e) => setGenre(e.target.value)} className="filter-select">
          <option value="">All Genres</option>
          <option value="Action">Action</option>
          <option value="Sci-Fi">Sci-Fi</option>
          <option value="Drama">Drama</option>
          <option value="Thriller">Thriller</option>
        </select>

        <select value={rating} onChange={(e) => setRating(e.target.value)} className="filter-select">
          <option value="">Ratings</option>
          <option value="9">9+ ⭐</option>
          <option value="8">8+ ⭐</option>
          <option value="7">7+ ⭐</option>
          <option value="6">6+ ⭐</option>
          <option value="5">5+ ⭐</option>
        </select>

        <select value={year} onChange={(e) => setYear(e.target.value)} className="filter-select">
          <option value="">All Years</option>
          {years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>

        <select value={sort} onChange={(e) => setSort(e.target.value)} className="filter-select">
          <option value="-ratings">Highest Rated</option>
          <option value="ratings">Lowest Rated</option>
          <option value="-releaseYear">Newest</option>
          <option value="releaseYear">Oldest</option>
        </select>

      </div>

      {err && <p className="error-text">{err}</p>}

      {/* MOVIE GRID */}
      <div className="movie-grid">
        {movies.map((m) => (
          <Link key={m._id} to={`/movie/${m._id}`} className="movie-card">
            <div className="poster-box">
              <img src={m.coverImage} alt={m.name} className="poster-img" />
            </div>

            <h3 className="movie-title">{m.name}</h3>
            <p className="movie-rating">⭐ {m.ratings}/10</p>
            <p className="movie-genres">{m.genres?.join(", ")}</p>
          </Link>
        ))}
      </div>

      {/* LOAD MORE */}
      {hasMore && !loading && (
        <div className="load-more-container">
          <button onClick={() => setPage((p) => p + 1)} className="load-more-btn">
            Load More
          </button>
        </div>
      )}

      {loading && <p className="loading-text">Loading…</p>}
    </div>
  );
}
