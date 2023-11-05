import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

const AuthModal = ({ setShowModel, isSignUp }) => {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [error, setError] = useState(null);
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);

  const navigate = useNavigate();

  console.log(email, password, confirmPassword);

  const handleClick = () => {
    console.log("clicked");
    setShowModel(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isSignUp && password !== confirmPassword) {
        setError("Password need to match");
        return;
      }

      const response = await axios.post(
        `http://localhost:8000/${isSignUp ? "signup" : "login"}`,
        {
          email,
          password,
        }
      );

      setCookie("UserId", response.data.userId);
      setCookie("AuthToken", response.data.token);

      const success = response.status === 201;

      if (success && isSignUp) navigate("/onboarding");
      if (success && !isSignUp) navigate("/dashboard");
      window.location.reload();
    } catch (error) {
      setError("Invalid email or password");
      console.log(error);
    }
  };

  return (
    <div className="auth-model">
      <div onClick={handleClick} className="cur-po">
        <i className="fa-regular fa-circle-xmark"></i>
      </div>
      <h2>{isSignUp ? "CREATE ACCOUNT" : "LOG IN"}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="email"
          required={true}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          id="password"
          name="password"
          placeholder="password"
          required={true}
          onChange={(e) => setPassword(e.target.value)}
        />

        {isSignUp && (
          <input
            type="password"
            id="password-check"
            name="password-check"
            placeholder="confirm password"
            required={true}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        )}

        <input type="submit" className="secondary-button" />
        <p>{error}</p>
      </form>
    </div>
  );
};

export default AuthModal;
