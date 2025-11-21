import { Link, useNavigate } from "react-router-dom";
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

  // Disable page scroll when menu is open
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
      {/* NAVBAR */}
      <nav className="dark-nav">
        <Link to="/" className="nav-logo">🎬 Cineflix</Link>

        {/* DESKTOP LINKS */}
        <div className="nav-links">
          {token ? (
            <>
              <Link to="/profile" className="nav-item">Profile</Link>

              {user?.role === "admin" && (
                <Link to="/add" className="nav-item">Add Movie</Link>
              )}

              {user?.role === "admin" && (
                <Link to="/admin" className="nav-item">Admin</Link>
              )}

              <button className="nav-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-item">Login</Link>
              <Link to="/signup" className="nav-item">Signup</Link>
            </>
          )}
        </div>

        {/* MOBILE HAMBURGER */}
        <div className="menu-btn" onClick={() => setMenuOpen(true)}>☰</div>
      </nav>

      {/* BACKDROP */}
      <div
        className={`mobile-backdrop ${menuOpen ? "show" : ""}`}
        onClick={() => setMenuOpen(false)}
      ></div>

      {/* NETFLIX-STYLE DRAWER */}
      <div className={`mobile-drawer ${menuOpen ? "open" : ""}`}>
        <button className="drawer-close" onClick={() => setMenuOpen(false)}>✕</button>

        {/* PROFILE SECTION */}
        {user && (
          <div className="drawer-profile">
            <div className="drawer-avatar">
              {user.name?.charAt(0)?.toUpperCase()}
            </div>
            <p className="drawer-username">{user.name}</p>
            <p className="drawer-email">{user.email}</p>
          </div>
        )}

        {/* NAV ITEMS */}
        <div className="drawer-links">
          <Link to="/" className="drawer-item" onClick={() => setMenuOpen(false)}>
            Home
          </Link>

          {token && (
            <Link to="/profile" className="drawer-item" onClick={() => setMenuOpen(false)}>
              Profile
            </Link>
          )}

          {user?.role === "admin" && (
            <>
              <Link to="/add" className="drawer-item" onClick={() => setMenuOpen(false)}>
                Add Movie
              </Link>

              <Link to="/admin" className="drawer-item" onClick={() => setMenuOpen(false)}>
                Admin Panel
              </Link>
            </>
          )}

          {!token && (
            <>
              <Link to="/login" className="drawer-item" onClick={() => setMenuOpen(false)}>
                Login
              </Link>
              <Link to="/signup" className="drawer-item" onClick={() => setMenuOpen(false)}>
                Signup
              </Link>
            </>
          )}
        </div>

        {/* LOGOUT */}
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
