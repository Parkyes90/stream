import React, { useEffect, useRef } from "react";
const Video: React.FC = () => {
  const local = useRef<HTMLVideoElement>(null);
  const remote = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    navigator.getUserMedia(
      { audio: true, video: { width: 1280, height: 720 } },
      (stream) => {
        if (local.current) {
          console.log(stream);
          local.current.srcObject = stream;
          local.current.play().then();
        }
      },
      (error) => {
        console.log(error);
      }
    );
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
