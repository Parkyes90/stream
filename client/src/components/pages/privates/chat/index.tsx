import React from "react";

const Chat: React.FC = () => {
  return (
    <div>
      <div>채팅 내용</div>
      <div>어쩌고 저쩌고</div>
      <input type="text" placeholder="사용자" />
      <input type="text" placeholder="내용" />
    </div>
  );
};

export default Chat;
