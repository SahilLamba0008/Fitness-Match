import { useState } from "react";
import AuthModal from "../components/AuthModal";
import Nav from "../components/Nav";

const Home = () => {
  const [showModel, setShowModel] = useState(false);
  const [isSignUp, setIsSignUp] = useState(true);
  const authToken = false;

  const handleClick = () => {
    console.log("clicked");
    setShowModel(true);
    setIsSignUp(true);
  };

  return (
    <div className="overlay">
      <Nav
        minimal={false}
        authToken={authToken}
        setShowModel={setShowModel}
        setIsSignUp={setIsSignUp}
      />
      <div className="home">
        <h1 className="primary-title">Swipe Right & Connect</h1>
        <h1 className="secondary-title">
          A find your fitness Partner and go gym together
        </h1>
        <button className="primary-button" onClick={handleClick}>
          {authToken ? "SignOut" : "Create Account"}
        </button>

        {showModel && (
          <AuthModal setShowModel={setShowModel} isSignUp={isSignUp} />
        )}
      </div>
    </div>
  );
};

export default Home;
