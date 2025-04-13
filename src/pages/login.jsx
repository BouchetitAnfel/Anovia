import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import "../styles/login.css";
import Group2 from "../assets/Group 2.svg";
import Group3 from "../assets/Group 3.svg";
import Laptop from "../assets/Laptop.svg";
import Logo from "../assets/logo.svg";
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setIsLoading(true);
    setError(""); 

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      const errorMessage = err.response?.data?.error || 
                           err.message || 
                           "Login failed. Please check your credentials.";
      setError(errorMessage);
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="imagegroup">
        <img src={Group2} alt="Group2" className="groupe2" />
        <img src={Group3} alt="Group3" className="groupe3" />
      </div>
      <div className="login-container">
        <img src={Logo} alt="logo" className="logo" />
        <div className="half-circle-one"></div>
        <div className="half-circle-two"></div>
        <div className="half-circle-three"></div>
        <img src={Laptop} alt="laptop" className="laptop" />
        <div className="form-container">
          <h1>WELCOME</h1>
          <p>Login to your working space in Anovia</p>
          {error && <p style={{ color: "red", marginBottom: "15px" }}>{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="inputcss">
              <input
                type="email" id="email"
                placeholder="Write your email here"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <div className="password-container">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Write your password here"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="password-options">
              <a href="#">Forgot your password?</a>
            </div>
            <button 
              type="submit" 
              disabled={isLoading}
              className={isLoading ? "loading" : ""}
            >
              {isLoading ? "LOADING..." : "SIGN IN"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;