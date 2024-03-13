import React, { useState, useEffect, useRef } from "react";
import * as faceapi from "face-api.js";
import axios from "axios";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";


const FacialExpressions = () => {
   const [modelsLoaded, setModelsLoaded] = useState(false);
   const [captureVideo, setCaptureVideo] = useState(false);
   const [detectedExpression, setDetectedExpression] = useState("");

   const videoRef = useRef(null);
   const videoHeight = 560;
   const videoWidth = 720;
   const canvasRef = useRef(null);

   React.useEffect(() => {
     const loadModels = async () => {
       const MODEL_URL = process.env.PUBLIC_URL + "/models";

       Promise.all([
         faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
         faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
         faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
         faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
       ]).then(setModelsLoaded(true));
     };
     loadModels();
   }, []);

   const startVideo = () => {
     setCaptureVideo(true);
     navigator.mediaDevices
       .getUserMedia({ video: { width: 300 } })
       .then((stream) => {
         let video = videoRef.current;
         video.srcObject = stream;
         video.play();
       })
       .catch((err) => {
         console.error("error:", err);
       });
   };

   const handleVideoOnPlay = () => {
     setInterval(async () => {
       if (canvasRef && canvasRef.current) {
         canvasRef.current.innerHTML = faceapi.createCanvasFromMedia(
           videoRef.current
         );
         const displaySize = {
           width: videoWidth,
           height: videoHeight,
         };

         faceapi.matchDimensions(canvasRef.current, displaySize);

         const detections = await faceapi
           .detectAllFaces(
             videoRef.current,
             new faceapi.TinyFaceDetectorOptions()
           )
           .withFaceLandmarks()
           .withFaceExpressions();

         const resizedDetections = faceapi.resizeResults(
           detections,
           displaySize
         );

         canvasRef &&
           canvasRef.current &&
           canvasRef.current
             .getContext("2d")
             .clearRect(0, 0, videoWidth, videoHeight);
         canvasRef &&
           canvasRef.current &&
           faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
         canvasRef &&
           canvasRef.current &&
           faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);
         canvasRef &&
           canvasRef.current &&
           faceapi.draw.drawFaceExpressions(
             canvasRef.current,
             resizedDetections
           );

         // Lấy biểu cảm phát hiện được và cập nhật state
         if (resizedDetections && resizedDetections.length > 0) {
           const expressions = resizedDetections[0].expressions;
           const sortedExpressions = Object.keys(expressions).sort(
             (a, b) => expressions[b] - expressions[a]
           );
           setDetectedExpression(sortedExpressions[0]);
         } else {
           setDetectedExpression("");
         }
       }
     }, 100);
   };

   const closeWebcam = () => {
     const stream = videoRef.current.srcObject;
     const tracks = stream.getTracks();
     tracks.forEach((track) => {
       track.stop();
     });
     setCaptureVideo(false);

     // Load lại trang web
     window.location.reload();
   };



  return (
    <>
      <h1
        className="mx-auto col-12 text-center pt-4"
        style={{
          color: "#ff9128",
          fontSize: "2.5rem",
        }}
      >
        NHẬN DIỆN BIỂU CẢM KHUÔN MẶT
      </h1>
      <Row className="mt-5 pb-5">
        <Col className="col-md-3 col-12">
          <Row className="d-flex flex-column">
            <Col>
              {captureVideo && modelsLoaded ? (
                <Button
                  onClick={closeWebcam}
                  size="lg"
                  className="py-3"
                  style={{
                    background:
                      "linear-gradient(to top, #f43b47 0%, #453a94 100%)",
                  }}
                >
                  <p className="h4">Dừng Webcam</p>
                </Button>
              ) : (
                <Button
                  onClick={startVideo}
                  style={{
                    background:
                      "linear-gradient(147deg, #FFE53B 0%, #FF2525 74%)",
                    border: "0px",
                  }}
                  size="lg"
                  className="py-3"
                >
                  <p className="h4">Bắt Đầu Webcam</p>
                </Button>
              )}
            </Col>
            <Col>
              <p className="h1 mt-3">
                Biểu cảm: {detectedExpression}
              </p>
            </Col>
          </Row>
        </Col>
        <Col
          className="col-9 ml-2"
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          {captureVideo ? (
            modelsLoaded ? (
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    padding: "10px",
                  }}
                >
                  <video
                    ref={videoRef}
                    height={videoHeight}
                    width={videoWidth}
                    onPlay={handleVideoOnPlay}
                    style={{ borderRadius: "10px", border: "1px solid" }}
                  />
                  <canvas ref={canvasRef} style={{ position: "absolute" }} />
                </div>
              </div>
            ) : (
              <div>Đang tải...</div>
            )
          ) : (
            <></>
          )}
        </Col>
      </Row>
    </>
  );
};

export default FacialExpressions;
