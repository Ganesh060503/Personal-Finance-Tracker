import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const mes = await axios.post("http://localhost:5000/api/users/register", formData);
      setMessage(mes.data.message);
      alert(mes.data.message)
      navigate("/login");
    } catch (err) {
      setError(err.response.data.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Register</h2>
        {error ? <p style={{ color: "red" }}>{error}</p> : <p style={{ color: "green" }}>{message}</p>} 
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit">Register</button>
        </form>
        <a href="/login">Already have an account? Login</a>
      </div>
    </div>
  );
};

export default Register;
