import { useState } from "react";

export default function FilterBar({ filters, setFilters }) {
  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const baseSelect =
    "border border-gray-200 bg-white p-2 rounded-xl shadow-sm focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all duration-200 outline-none";

  return (
    <div className="bg-white p-4 rounded-2xl shadow-lg mb-6 flex gap-4 flex-wrap">

      {/* ⭐ Genre Filter */}
      <select
        name="genre"
        value={filters.genre}
        onChange={handleChange}
        className={baseSelect}
      >
        <option value="">All Genres</option>
        <option value="Action">Action</option>
        <option value="Adventure">Adventure</option>
        <option value="Sci-Fi">Sci-Fi</option>
        <option value="Drama">Drama</option>
        <option value="Crime">Crime</option>
      </select>

      {/* ⭐ Release Year */}
      <select
        name="releaseYear"
        value={filters.releaseYear}
        onChange={handleChange}
        className={baseSelect}
      >
        <option value="">All Years</option>
        {Array.from({ length: 25 }, (_, i) => 2024 - i).map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>

      {/* ⭐ Rating */}
      <select
        name="rating"
        value={filters.rating}
        onChange={handleChange}
        className={baseSelect}
      >
        <option value="">Rating ≥</option>
        <option value="9">9+</option>
        <option value="8">8+</option>
        <option value="7">7+</option>
        <option value="6">6+</option>
      </select>

      {/* ⭐ Duration */}
      <select
        name="duration"
        value={filters.duration}
        onChange={handleChange}
        className={baseSelect}
      >
        <option value="">Duration ≤</option>
        <option value="90">90 mins</option>
        <option value="120">120 mins</option>
        <option value="150">150 mins</option>
      </select>

      {/* ⭐ Sort */}
      <select
        name="sort"
        value={filters.sort}
        onChange={handleChange}
        className={baseSelect}
      >
        <option value="">Sort By</option>
        <option value="-ratings">Top Rated</option>
        <option value="-releaseYear">Newest</option>
        <option value="releaseYear">Oldest</option>
        <option value="-duration">Longest</option>
      </select>
    </div>
  );
}
