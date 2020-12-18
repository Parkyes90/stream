import React from "react";
import { useHistory } from "react-router-dom";
const Main: React.FC = () => {
  const history = useHistory();

  return (
    <div>
      <button
        onClick={() => {
          history.push("/chat");
        }}
      >
        채팅
      </button>
      <button
        onClick={() => {
          history.push("/video");
        }}
      >
        비디오
      </button>
    </div>
  );
};

export default Main;
