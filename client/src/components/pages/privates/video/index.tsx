import React, { useEffect, useRef } from "react";
import { socket } from "../../../../index";

const Video: React.FC = () => {
  const local = useRef<HTMLVideoElement>(null);
  const remote = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const roomName = "video";
    let created = false;
    let rtcPeerConnection: RTCPeerConnection;
    let userStream: MediaStream;
    const iceServers = {
      iceServers: [
        {
          urls: "stun:stun.services.mozilla.com",
        },
        {
          urls: "stun:stun1.1.google.com:19302",
        },
      ],
    };
    const onIceCandidate = (event: any) => {
      if (event.candidate) {
        socket.emit("candidate", event.candidate, roomName);
      }
    };
    const onTrack = (event: any) => {
      if (remote.current) {
        remote.current.srcObject = event.streams[0];
        remote.current.onloadedmetadata = () => remote.current!.play();
      }
    };
    const connectMedia = () => {
      navigator.mediaDevices
        .getUserMedia({ audio: true, video: { width: 1280, height: 720 } })
        .then((stream) => {
          if (local.current) {
            userStream = stream;
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
        rtcPeerConnection.ontrack = onTrack;
        rtcPeerConnection.addTrack(userStream.getTracks()[0], userStream);
        rtcPeerConnection.addTrack(userStream.getTracks()[1], userStream);
        rtcPeerConnection
          .createOffer()
          .then((offer) => {
            socket.emit("offer", offer, roomName);
          })
          .catch((err) => {
            console.log(err);
          });
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
