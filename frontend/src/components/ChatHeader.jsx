import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

const ChatHeader = ({ user }) => {
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  const navigate = useNavigate();
  const logOut = () => {
    console.log("Logging out...");

    removeCookie("UserId");
    removeCookie("AuthToken");

    console.log("Cookies removed");
    navigate("/");
    window.location.reload();
  };
  return (
    <>
      {user && (
        <div className="chat-container-header">
          <div className="profile">
            <div className="img-container">
              <img src={user.url} alt={user.first_name} />
            </div>
            <h3>{user.first_name}</h3>
          </div>
          <i
            className="fa-solid fa-right-from-bracket cur-po log-out-icon "
            onClick={logOut}
          ></i>
        </div>
      )}
    </>
  );
};

export default ChatHeader;
