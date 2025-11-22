import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      if (raw) setUser(JSON.parse(raw));
    } catch (err) {
      console.log("Error reading user:", err);
    }
  }, [token]);

  // Disable scroll on mobile drawer open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "auto";
  }, [menuOpen]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <>
      {/* ------------------------ NAVBAR ------------------------ */}
      <nav className="dark-nav">
        <NavLink to="/" className="nav-logo">🎬 Cineflix</NavLink>

        {/* ------------------ DESKTOP LINKS ------------------ */}
        <div className="nav-links">
          {token ? (
            <>
              <NavLink to="/" className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}>
                Home
              </NavLink>

              <NavLink to="/profile" className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}>
                Profile
              </NavLink>

              {/* ADMIN ONLY */}
              {user?.role === "admin" && (
                <>
                  <NavLink to="/add" className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}>
                    Add Movie
                  </NavLink>

                  <NavLink to="/admin" className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}>
                    Admin
                  </NavLink>

                  <NavLink to="/editmovies" className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}>
                    Edit Movies
                  </NavLink>

                  <NavLink to="/users" className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}>
                    Manage Users
                  </NavLink>

                  <NavLink to="/stats" className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}>
                    Stats
                  </NavLink>
                </>
              )}

              <button className="nav-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="nav-item">Login</NavLink>
              <NavLink to="/signup" className="nav-item">Signup</NavLink>
            </>
          )}
        </div>

        {/* ------------------ MOBILE MENU BUTTON ------------------ */}
        <div className="menu-btn" onClick={() => setMenuOpen(true)}>☰</div>
      </nav>

      {/* ------------------ BACKDROP ------------------ */}
      <div
        className={`mobile-backdrop ${menuOpen ? "show" : ""}`}
        onClick={() => setMenuOpen(false)}
      ></div>

      {/* ------------------ MOBILE DRAWER ------------------ */}
      <div className={`mobile-drawer ${menuOpen ? "open" : ""}`}>
        <button className="drawer-close" onClick={() => setMenuOpen(false)}>
          ✕
        </button>

        {/* ----------- PROFILE ----------- */}
        {user && (
          <div className="drawer-profile">
            <div className="drawer-avatar">
              {user.name?.charAt(0)?.toUpperCase()}
            </div>
            <p className="drawer-username">{user.name}</p>
            <p className="drawer-email">{user.email}</p>
          </div>
        )}

        {/* ------------------ DRAWER LINKS ------------------ */}
        <div className="drawer-links">

          <NavLink to="/" className="drawer-item" onClick={() => setMenuOpen(false)}>
            Home
          </NavLink>

          {token && (
            <NavLink to="/profile" className="drawer-item" onClick={() => setMenuOpen(false)}>
              Profile
            </NavLink>
          )}

          {user?.role === "admin" && (
            <>
              <NavLink to="/add" className="drawer-item" onClick={() => setMenuOpen(false)}>
                Add Movie
              </NavLink>

              <NavLink to="/admin" className="drawer-item" onClick={() => setMenuOpen(false)}>
                Admin Dashboard
              </NavLink>

              <NavLink to="/editmovies" className="drawer-item" onClick={() => setMenuOpen(false)}>
                Edit Movies
              </NavLink>

              <NavLink to="/users" className="drawer-item" onClick={() => setMenuOpen(false)}>
                Manage Users
              </NavLink>

              <NavLink to="/stats" className="drawer-item" onClick={() => setMenuOpen(false)}>
                Movie Stats
              </NavLink>
            </>
          )}

          {!token && (
            <>
              <NavLink to="/login" className="drawer-item" onClick={() => setMenuOpen(false)}>
                Login
              </NavLink>

              <NavLink to="/signup" className="drawer-item" onClick={() => setMenuOpen(false)}>
                Signup
              </NavLink>
            </>
          )}
        </div>

        {/* ------------------ LOGOUT ------------------ */}
        {token && (
          <button
            className="drawer-logout"
            onClick={() => {
              handleLogout();
              setMenuOpen(false);
            }}
          >
            Logout
          </button>
        )}
      </div>
    </>
  );
}
