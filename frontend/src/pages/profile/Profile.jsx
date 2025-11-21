import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import "./profile.css";

// Read token
function useAuthHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `bearer ${token}` } : {};
}

/* ------------------------------------------------------------------
   TABS COMPONENT
------------------------------------------------------------------ */
function Tabs({ active, setActive }) {
  const tabs = [
    { id: "info", label: "Profile Info" },
    { id: "password", label: "Change Password" },
    { id: "delete", label: "Delete Account" },
  ];

  return (
    <>
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => setActive(t.id)}
          className={`profile-tab ${active === t.id ? "active" : ""}`}
        >
          {t.label}
        </button>
      ))}
    </>
  );
}

/* ------------------------------------------------------------------
   UPDATE PROFILE INFO
------------------------------------------------------------------ */
function UpdateInfo({ onUpdated }) {
  const headers = useAuthHeader();
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // Load local user data
  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      if (raw) {
        const u = JSON.parse(raw);
        setName(u.name || "");
        setEmail(u.email || "");
      }
    } catch {}
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.patch(
        "/users/updateMe",
        { name, email },
        { headers }
      );

      if (res.data?.data?.user) {
        localStorage.setItem("user", JSON.stringify(res.data.data.user));
      }

      onUpdated && onUpdated();
      alert("Profile updated successfully.");
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-card">
      <h2 className="profile-card-title">Update Profile Info</h2>

      <form onSubmit={handleSubmit}>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="profile-input"
          placeholder="Your Name"
        />

        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="profile-input"
          placeholder="Your Email"
        />

        <button disabled={loading} className="profile-btn">
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}

/* ------------------------------------------------------------------
   CHANGE PASSWORD
------------------------------------------------------------------ */
function ChangePassword() {
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);

  const [currentPassword, setCurrent] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirm] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("New password & confirm password do not match.");
      return;
    }

    setLoading(true);

    try {
      await api.patch(
        "/users/updatePassword",
        { currentPassword, password, confirmPassword },
        { headers: { Authorization: `bearer ${token}` } }
      );

      alert("Password updated! Login again.");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to update password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-card">
      <h2 className="profile-card-title">Change Password</h2>

      <form onSubmit={handleSubmit}>
        <input
          required
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrent(e.target.value)}
          className="profile-input"
          placeholder="Current Password"
        />

        <input
          required
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="profile-input"
          placeholder="New Password"
        />

        <input
          required
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirm(e.target.value)}
          className="profile-input"
          placeholder="Confirm New Password"
        />

        <button disabled={loading} className="profile-btn">
          {loading ? "Saving..." : "Update Password"}
        </button>
      </form>
    </div>
  );
}

/* ------------------------------------------------------------------
   DELETE ACCOUNT
------------------------------------------------------------------ */
function DeleteAccount() {
  const headers = useAuthHeader();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure? This cannot be undone.")) return;

    setLoading(true);

    try {
      await api.delete("/users/deleteMe", { headers });
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      alert("Account deleted.");
      navigate("/signup");
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to delete account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-card">
      <h2 className="profile-card-title" style={{ color: "#ff4b4b" }}>
        Delete Account
      </h2>

      <p className="text-sm text-gray-400 mb-4">
        This action is permanent and cannot be undone.
      </p>

      <button
        onClick={handleDelete}
        disabled={loading}
        className="profile-btn delete-btn"
      >
        {loading ? "Deleting..." : "Delete My Account"}
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------
   MAIN PROFILE PAGE
------------------------------------------------------------------ */
export default function Profile() {
  const [activeTab, setActiveTab] = useState("info");
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="profile-wrapper">
      <div className="profile-container">
        {/* TITLE */}
        <h1 className="profile-title">My Profile</h1>

        {/* TABS */}
        <div className="profile-tabs-box">
          <Tabs active={activeTab} setActive={setActiveTab} />
        </div>

        {/* TAB CONTENT */}
        {activeTab === "info" && (
          <UpdateInfo
            key={refreshKey}
            onUpdated={() => setRefreshKey((k) => k + 1)}
          />
        )}

        {activeTab === "password" && (
          <ChangePassword key={refreshKey} />
        )}

        {activeTab === "delete" && (
          <DeleteAccount key={refreshKey} />
        )}
      </div>
    </div>
  );
}
