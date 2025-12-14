import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import { getEmotionRecommendations } from "../api/emotionService";

export default function EmotionDetector({ onSongs }) {
  const videoRef = useRef(null);
  const intervalRef = useRef(null);
  const streamRef = useRef(null);

  const [emotion, setEmotion] = useState("Waiting...");
  const [status, setStatus] = useState("Starting camera...");
  const [cameraOn, setCameraOn] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
      
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = stream;
        videoRef.current.srcObject = stream;

        await new Promise(r => (videoRef.current.onloadedmetadata = r));

        setStatus("Loading AI models...");
        const MODEL_URL = "/models";
        await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
        await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);

        setStatus("Detecting emotion every 5 seconds...");
        intervalRef.current = setInterval(detectEmotion, 5000);
      } catch (err) {
        console.error(err);
        setStatus("Camera permission denied");
      }
    };

    init();

    const stopOnBack = () => stopCamera();
    window.addEventListener("STOP_CAMERA", stopOnBack);

    return () => {
      window.removeEventListener("STOP_CAMERA", stopOnBack);
      stopCamera();
    };
  }, []);

  
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setCameraOn(false);
    setStatus("Camera OFF");
  };

  
  const startCamera = async () => {
    if (cameraOn) return;

    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    streamRef.current = stream;
    videoRef.current.srcObject = stream;

    setCameraOn(true);
    setStatus("Camera ON");
  };

  const detectEmotion = async () => {
    if (!videoRef.current || !cameraOn) return;

    const detection = await faceapi
      .detectSingleFace(videoRef.current)
      .withFaceExpressions();

    if (!detection) {
      setEmotion("No face");
      return;
    }

    const expressions = detection.expressions;
    const mood = Object.keys(expressions).reduce((a, b) =>
      expressions[a] > expressions[b] ? a : b
    );

    setEmotion(mood);

    const data = await getEmotionRecommendations(mood);
    onSongs(data.songs || []);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center gap-4 w-full max-w-md mx-auto">
      
      <h2 className="text-lg font-semibold text-gray-800">
        Live Camera
      </h2>

      <p className="text-sm text-gray-500">{status}</p>

      <div className="w-full aspect-video bg-black rounded-xl overflow-hidden border">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover"
        />
      </div>

      <p className="text-base font-medium">
        Emotion:
        <span className="ml-2 text-green-600 font-semibold">
          {emotion}
        </span>
      </p>

   
      {!cameraOn ? (
        <button
          onClick={startCamera}
          className="w-full py-2 rounded-lg bg-green-600 text-white font-medium"
        >
          Turn Camera ON
        </button>
      ) : (
        <button
          onClick={stopCamera}
          className="w-full py-2 rounded-lg bg-red-600 text-white font-medium"
        >
          Turn Camera OFF
        </button>
      )}
    </div>
  );
}
