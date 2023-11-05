const Chat = ({ descendingOrderMessages }) => {
  return (
    <>
      <div className="chat-display">
        {descendingOrderMessages.map((message, index) => (
          <div key={index} className="chat-message-container">
            <div className="chat-message-header">
              <div className="img-container">
                <img src={message.img} alt={message.name + " profile"} />
              </div>
            </div>
            <p className="chat-message">{message.message}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default Chat;
