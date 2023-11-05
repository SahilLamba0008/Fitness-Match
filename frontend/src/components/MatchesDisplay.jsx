import axios from "axios";
import { useEffect, useState } from "react";

const MatchesDisplay = ({ matches, setClickedUser }) => {
  const [matchedProfiles, setMatchedProfiles] = useState([]);
  const matchedUserIds = matches?.map(({ user_id }) => user_id);

  useEffect(() => {
    const fetchMatchedUsers = async () => {
      if (matches && matches.length > 0) {
        const matchedUserIds = matches.map((match) => match.user_id);

        try {
          const response = await axios.get(
            "http://localhost:8000/matchedUsers",
            {
              params: { userIds: JSON.stringify(matchedUserIds) },
            }
          );
          setMatchedProfiles(response.data);
        } catch (error) {
          console.error("Error in MatchesDisplay", error);
        }
      }
    };

    fetchMatchedUsers();
  }, [matches]);

  console.log("matched profiles : ", matchedProfiles);

  return (
    <div className="matches-display">
      {matchedProfiles && matchedProfiles.length > 0 ? (
        matchedProfiles.map((profile, index) => (
          <div
            key={index}
            className="match-card"
            onClick={() => setClickedUser(profile)}
          >
            <div className="img-container">
              <img src={profile?.url} alt={profile?.name} />
            </div>
            <h4>
              {profile?.first_name} {profile?.last_name}
            </h4>
          </div>
        ))
      ) : (
        <p>No matched profiles available</p>
      )}
    </div>
  );
};

export default MatchesDisplay;
