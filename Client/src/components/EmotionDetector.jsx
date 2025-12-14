import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import { getEmotionRecommendations } from "../api/emotionService";

export default function EmotionDetector({ onSongs }) {
  const videoRef = useRef(null);
  const intervalRef = useRef(null);

  const [emotion, setEmotion] = useState("Waiting...");
  const [status, setStatus] = useState("Starting camera...");

  useEffect(() => {
    const init = async () => {
      try {
        // Camera
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
        await new Promise(r => videoRef.current.onloadedmetadata = r);

        // Models
        setStatus("Loading AI models...");
        const MODEL_URL = "/models";
        await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
        await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);

        setStatus("Detecting emotion every 5 seconds...");
        intervalRef.current = setInterval(detectEmotion, 5000);
      } catch (err) {
        console.error(err);
        setStatus("ERROR: " + err.message);
      }
    };

    init();
    return () => clearInterval(intervalRef.current);
  }, []);

  const detectEmotion = async () => {
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
    <div className="flex flex-col items-center gap-4">
      <p className="text-sm opacity-70">{status}</p>

      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="w-72 rounded-xl border border-gray-700"
      />

      <p className="text-lg font-semibold">
        Emotion: <span className="text-green-400">{emotion}</span>
      </p>
    </div>
  );
}
