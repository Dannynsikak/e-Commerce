import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signIn } from "../slices/userSlice";
import { AppDispatch, RootState } from "../store";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import LoadingBox from "../components/LoadingBox";
import "./styles.css";

const SignInComponent = () => {
  const dispatch: AppDispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const loading = useSelector((state: RootState) => state.user.loading); // Loading state
  const userError = useSelector((state: RootState) => state.user.error); // Get error from user state
  const userInfo = useSelector((state: RootState) => state.user.userInfo); // Get user info from state
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get("redirect");
  const redirect = redirectInUrl ? redirectInUrl : "/";
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(signIn({ email, password }));
  };

  useEffect(() => {
    if (userError) {
      toast.error(userError);
    } else {
      setError(null); // Reset error if successful
    }
  }, [userError]); // Dependency array with userError

  // Redirect logic based on userInfo
  useEffect(() => {
    if (userInfo) {
      navigate(redirect); // Redirect after successful sign-in
    }
  }, [navigate, redirect, userInfo]); // Dependencies for redirecting

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email">Email:</label>
        <input
          id="email" // Set the ID to match the htmlFor in the label
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      {error && <div className="error">{error}</div>}
      <button type="submit" disabled={loading}>
        {loading && <LoadingBox />}
        Sign In
      </button>
      <div>
        New customer?{" "}
        <Link to={`/signup?redirect=${redirect}`}>Create your account</Link>
      </div>
    </form>
  );
};

export default SignInComponent;
