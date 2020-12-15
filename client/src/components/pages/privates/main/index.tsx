import React, { useEffect, useRef, useState } from "react";
import { getDevice } from "../../../../utils";
import Peer from "simple-peer";

const Main: React.FC = () => {
  const ref = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream>();
  console.log("test");
  useEffect(() => {
    const constraints = {
      // audio: {
      //   autoGainControl: true,
      //   echoCancellation: true,
      //   noiseSuppression: true,
      //   googNoiseSuppression: true,
      //   sampleSize: 16,
      //   channelCount: 2,
      //   volume: 1.0,
      // },
      video: {
        facingMode: "user",
      },
    };

    const device = getDevice();
    if (!device) {
      window.alert("지원하는 기기가 없습니다.");
    } else {
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then(function (mStream: MediaStream) {
          setStream(() => {
            ref.current!.srcObject = mStream;
            return mStream;
          });
        })
        .catch(function (err0r: Error) {
          console.log("Something went wrong!");
        });
    }
  }, []);
  return (
    <div>
      <video ref={ref} playsInline autoPlay width={200} height={200} muted />
      <button
        onClick={() => {
          const peer = new Peer({
            initiator: true,
            trickle: false,
            stream,
          });
          peer.on("signal", (stream) => {
            console.log(stream);
          });
          peer.on("error", (err) => {
            console.log(err);
          });
        }}
      >
        연결 요청
      </button>
    </div>
  );
};

export default Main;
