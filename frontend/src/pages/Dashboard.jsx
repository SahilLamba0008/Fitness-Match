import React, { useEffect, useState } from "react";
import TinderCard from "react-tinder-card";
import ChatContainer from "../components/ChatContainer";
import axios from "axios";
import { useCookies } from "react-cookie";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [allUsers, setAllUsers] = useState(null);
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  const userId = cookies.UserId;

  const getUser = async () => {
    try {
      const response = await axios.get("http://localhost:8000/user", {
        params: { userId },
      });
      setUser(response.data);
    } catch (error) {
      console.log("Get User Req on dashboard", error);
    }
  };

  const getAllUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8000/users");
      setAllUsers(response.data);
    } catch (error) {
      console.log("Get All users Req on dashboard", error);
    }
  };
  useEffect(() => {
    getUser();
    getAllUsers();
  }, []);

  console.log("user ->", user);
  console.log("All users ->", allUsers);
  const db = [
    {
      name: "Richard Hendricks",
      url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=60&w=500&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHBlb3BsZXxlbnwwfHwwfHx8MA%3D%3D",
    },
    {
      name: "Erlich Bachman",
      url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=60&w=500&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHBlb3BsZXxlbnwwfHwwfHx8MA%3D%3D",
    },
    {
      name: "Monica Hall",
      url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=60&w=500&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHBlb3BsZXxlbnwwfHwwfHx8MA%3D%3D",
    },
    {
      name: "Jared Dunn",
      url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=60&w=500&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHBlb3BsZXxlbnwwfHwwfHx8MA%3D%3D",
    },
    {
      name: "Dinesh Chugtai",
      url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=60&w=500&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHBlb3BsZXxlbnwwfHwwfHx8MA%3D%3D",
    },
  ];

  const characters = db;
  const [lastDirection, setLastDirection] = useState();

  const updateMatches = async (matchedUserId) => {
    try {
      await axios.put("http://localhost:8000/addmatch", {
        userId,
        matchedUserId,
      });
      getUser();
    } catch (error) {
      console.log("error on dashboard while addMatch put req", error);
    }
  };

  const swiped = (direction, swipedUserId) => {
    if (direction === "right") {
      updateMatches(swipedUserId);
    }
    setLastDirection(direction);
  };

  const outOfFrame = (name) => {
    console.log(name + " left the screen!");
  };

  const matchedUserIds = user?.matches
    .map(({ user_id }) => user_id)
    .concat(userId);

  const filteredUsersAfterMatch = allUsers?.filter(
    (allUsers) => !matchedUserIds?.includes(allUsers.user_id)
  );
  return (
    <div className="dashboard">
      <ChatContainer user={user} />
      <div className="swipe-container">
        <div className="card-container">
          {filteredUsersAfterMatch?.map((currUser, index) => (
            <TinderCard
              className="swipe"
              key={index}
              onSwipe={(dir) => swiped(dir, currUser.user_id)}
              onCardLeftScreen={() => outOfFrame(currUser.first_name)}
            >
              <div
                style={{ backgroundImage: "url(" + currUser.url + ")" }}
                className="card"
              >
                <h3>Name: {currUser.first_name}</h3>
                <p>About: {currUser.about}</p>
              </div>
            </TinderCard>
          ))}
          <div className="swipe-info">
            {lastDirection ? <p>you swiped {lastDirection}</p> : <p />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
