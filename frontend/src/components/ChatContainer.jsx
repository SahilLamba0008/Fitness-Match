import { useState } from "react";
import ChatDisplay from "./ChatDisplay";
import ChatHeader from "./ChatHeader";
import MatchesDisplay from "./MatchesDisplay";

const ChatContainer = ({ user }) => {
  const [clickedUser, setClickedUser] = useState(null);

  console.log("chat container:", user);
  console.log("chat container user Matches:", user?.matches);

  const matches = user?.matches;

  return (
    <div className="chat-container">
      <ChatHeader user={user} />
      <div>
        <button className="option cur-po" onClick={() => setClickedUser(null)}>
          Matches
        </button>
        <button className="option cur-po" disabled={!clickedUser}>
          Chats
        </button>
      </div>

      {!clickedUser && (
        <MatchesDisplay matches={matches} setClickedUser={setClickedUser} />
      )}
      {clickedUser && <ChatDisplay user={user} clickedUser={clickedUser} />}
    </div>
  );
};

export default ChatContainer;
