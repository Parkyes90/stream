import React, { useEffect, useRef } from "react";
import { socket } from "../../../../index";
const Video: React.FC = () => {
  const local = useRef<HTMLVideoElement>(null);
  const remote = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const connectMedia = () => {
      navigator.mediaDevices
        .getUserMedia({ audio: true, video: { width: 1280, height: 720 } })
        .then((stream) => {
          if (local.current) {
            local.current.srcObject = stream;
            local.current.play().then();
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };
    socket.emit("join", "video");
    socket.on("created", () => {
      connectMedia();
    });
    socket.on("joined", () => {
      connectMedia();
    });
    socket.on("full", () => {
      window.alert("Room is Full");
    });
    socket.on("candidate", () => {});
    socket.on("offer", () => {});
    socket.on("answer", () => {});
  }, []);
  return (
    <div>
      <div>
        <div>Local</div>
        <div>
          <video ref={local} />
        </div>
      </div>
      <div>Remote</div>
      <div>
        <video ref={remote} />
      </div>
    </div>
  );
};

export default Video;
