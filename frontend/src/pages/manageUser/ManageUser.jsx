import { useEffect, useState } from "react";
import api from "../../api/axios";
import Sidebar from "../../components/sidebar/Sidebar";
import "./manageUsers.css";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/users/getAllUsers")
      .then((res) => {
        setUsers(res.data.data?.users || []);
      })
      .catch(() => setError("Failed to load users"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="admin-users-containe">
      <Sidebar />

      <div className="admin-users-wrapper">
        <h1 className="admin-users-title">Manage Users</h1>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-400">{error}</p>
        ) : (
          <div className="admin-users-card">
            <table className="admin-users-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user, index) => (
                  <tr key={user._id} className="admin-users-row">
                    <td>{index + 1}</td>

                    <td>{user.name}</td>

                    <td>{user.email}</td>

                    <td>
                      <span
                        className={`admin-role-badge ${
                          user.role === "admin"
                            ? "admin-role-admin"
                            : "admin-role-user"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>

                    <td className="text-center">
                      <button
                        className="admin-delete-btn"
                        onClick={() => alert(`Delete user ${user.name}?`)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
