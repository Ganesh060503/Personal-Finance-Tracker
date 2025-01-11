import React from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const isLoggedIn = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <a href="/">Personal Finance Tracker</a>
      </div>
      <div className="links">
        {!isLoggedIn && location.pathname !== "/login" && (
          <Link to="/login">Login</Link>
        )}
        {!isLoggedIn && location.pathname !== "/register" && (
          <Link to="/register">Register</Link>
        )}
        {isLoggedIn && (
          <>
            {/* <button onClick={handleLogout}>Logout</button> */}
            <Link to="/login" onClick={handleLogout}>logout</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

