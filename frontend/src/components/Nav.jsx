// eslint-disable-next-line react/prop-types
const Nav = ({ minimal, authToken, setShowModel, setIsSignUp }) => {
  const handleClick = () => {
    console.log("clicked");
    setShowModel(true);
    setIsSignUp(false);
  };

  return (
    <nav>
      <div className="logo-container">
        <img
          src={minimal ? "/assets/logo-gradient.png" : "/assets/logo-white.png"}
          alt="logo"
          className="logo cur-po"
        />
      </div>

      {!authToken && !minimal && (
        <button className="nav-button" onClick={handleClick}>
          {" "}
          Log in
        </button>
      )}
    </nav>
  );
};

export default Nav;
