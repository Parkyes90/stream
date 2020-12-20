import React, { useEffect, useRef } from "react";
import { socket } from "../../../../index";

const Video: React.FC = () => {
  const local = useRef<HTMLVideoElement>(null);
  const remote = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const roomName = "video";
    let created = false;
    let rtcPeerConnection: RTCPeerConnection;
    const iceServers = {
      iceServers: [
        {
          urls: "stun:stun.services.mozilla.com",
        },
        {
          urls: "stun1.1.google.com:19302",
        },
      ],
    };
    const onIceCandidate = (event: any) => {
      if (event.candidate) {
        socket.emit("candidate", event.candidate, roomName);
      }
    };
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
    socket.emit("join", roomName);
    socket.on("created", () => {
      created = false;
      connectMedia();
    });
    socket.on("joined", () => {
      created = true;
      connectMedia();
    });
    socket.on("full", () => {
      window.alert("Room is Full");
    });
    socket.on("ready", () => {
      if (created) {
        rtcPeerConnection = new RTCPeerConnection(iceServers);
        rtcPeerConnection.onicecandidate = onIceCandidate;
      }
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
