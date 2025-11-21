import api from "../../api/axios";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import "./Login.css";

export default function Login() {
  const [data, setData] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setData({ ...data, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    try {
      const res = await api.post("/auth/login", data);

      const token = res.data?.token;
      const user = res.data?.data?.user;

      if (!token || !user) {
        toast.error("Invalid server response");
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      toast.success("Login Successful!");
      navigate("/");
    } catch (err) {
      setErr(err.response?.data?.message || "Login failed");
      toast.error("Invalid credentials");
    }
  };

  return (
    <div className="login-wrapper">
      <form className="login-card" onSubmit={handleSubmit}>
        <h2 className="login-title">Welcome Back</h2>

        {err && <p className="login-error">{err}</p>}

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="login-input"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="login-input"
        />

        <button className="login-btn">Login</button>

        <div className="login-links">
          <Link to="/signup" className="login-link">
            Create Account
          </Link>
          <Link to="/forgot" className="login-link">
            Forgot Password?
          </Link>
        </div>
      </form>
    </div>
  );
}
