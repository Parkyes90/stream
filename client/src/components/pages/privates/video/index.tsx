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
          urls: "stun:stun.1.google.com:19302",
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
    const connectMedia = (isReady: boolean = false) => {
      navigator.mediaDevices
        .getUserMedia({ audio: true, video: { width: 1280, height: 720 } })
        .then((stream) => {
          if (local.current) {
            userStream = stream;
            local.current.srcObject = stream;
            local.current.play().then();
            if (isReady) {
              socket.emit("ready", roomName);
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };
    const rtcEvent = (
      flag: boolean,
      stream: any,
      isAnswer: boolean = false
    ) => {
      console.log(flag, "created", isAnswer);
      if (flag) {
        rtcPeerConnection = new RTCPeerConnection(iceServers);
        rtcPeerConnection.onicecandidate = onIceCandidate;
        rtcPeerConnection.ontrack = onTrack;
        rtcPeerConnection.addTrack(userStream.getTracks()[0], userStream);
        rtcPeerConnection.addTrack(userStream.getTracks()[1], userStream);

        if (isAnswer) {
          rtcPeerConnection.setRemoteDescription(stream).then();

          rtcPeerConnection
            .createAnswer()
            .then((answer) => {
              rtcPeerConnection.setLocalDescription(answer).then();

              socket.emit("answer", answer, roomName);
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          console.log("ready offer");
          rtcPeerConnection
            .createOffer()
            .then((offer) => {
              rtcPeerConnection.setLocalDescription(offer).then();

              socket.emit("offer", offer, roomName);
            })
            .catch((err) => {
              console.log(err);
            });
        }
      }
    };
    socket.emit("join", roomName);
    socket.on("created", () => {
      created = true;
      console.log("created");

      connectMedia();
    });
    socket.on("joined", () => {
      created = false;
      console.log("joined");
      connectMedia(true);
    });
    socket.on("full", () => {
      window.alert("Room is Full");
    });
    socket.on("ready", (ready: any) => {
      console.log("ready");
      rtcEvent(created, ready);
    });
    socket.on("candidate", (candidate: any) => {
      const iceCandidate = new RTCIceCandidate(candidate);
      rtcPeerConnection.addIceCandidate(iceCandidate).then();
    });
    socket.on("offer", (offer: any) => {
      rtcEvent(!created, offer, true);
    });
    socket.on("answer", (answer: any) => {
      rtcPeerConnection.setRemoteDescription(answer).then();
    });
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
