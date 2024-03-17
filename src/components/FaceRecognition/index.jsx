import React, { useState, useEffect, useRef } from "react";
import * as faceapi from "face-api.js";
import axios from "axios";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import face from "../../page/image/2.jpg";

const FaceRecognition = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isWebcamOn, setIsWebcamOn] = useState(false);
  const [detectedPeople, setDetectedPeople] = useState([]);

  useEffect(() => {
    loadModels();
  }, []);

  async function loadModels() {
    const MODEL_URL = "/models";
    await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
    await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
    await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
  }

  async function startVideo() {
    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(function (stream) {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.onloadedmetadata = function () {
              videoRef.current.play();
              setIsWebcamOn(true);
              detectFace();
            };
          }
        })
        .catch(function (err) {
          console.log("An error occurred: " + err);
        });
    }
  }

  async function detectFace() {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      const detections = await faceapi
        .detectAllFaces(video)
        .withFaceLandmarks()
        .withFaceDescriptors();

      const labeledDescriptors = await Promise.all(
        [
          "Nguyễn Minh Hiếu",
          "Văn Bảo Tâm",
          "Phan Đức Tiến",
          "Trần Đức Hải",
          "Nguyễn Đăng Khoa",
          "Dương Trung Quốc"
        ].map(async (personName) => {
          const descriptors = await Promise.all(
            Array.from(Array(1).keys()).map(async (__, i) => {
              const imagePath = `/images/${personName}/${i + 1}.jpg`;
              const img = await faceapi.fetchImage(imagePath);
              const detectedFace = await faceapi
                .detectSingleFace(img)
                .withFaceLandmarks()
                .withFaceDescriptor();
              return detectedFace.descriptor;
            })
          );
          return new faceapi.LabeledFaceDescriptors(personName, descriptors);
        })
      );

      const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors);
      const newDetectedPeople = [];

      faceapi.matchDimensions(canvas, video, true);

      const resizedDetections = faceapi.resizeResults(detections, {
        width: video.width,
        height: video.height,
      });
      resizedDetections.forEach((detection) => {
        const bestMatch = faceMatcher.findBestMatch(detection.descriptor);
        const personName = bestMatch.label;

        newDetectedPeople.push(personName);
         const box = detection.detection.box;
         const text = bestMatch.toString();
         const drawBox = new faceapi.draw.DrawBox(box, { label: text });
         drawBox.draw(canvas);
      });

      setDetectedPeople(newDetectedPeople);
    }

    requestAnimationFrame(detectFace);
  }

  const handleStartWebcam = () => {
    startVideo();
  };

  const handleStopWebcam = () => {
    const stream = videoRef.current.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach((track) => {
      track.stop();
    });
    setIsWebcamOn(false);
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
        NHẬN DIỆN KHUÔN MẶT BẰNG WEBCAM
      </h1>
      <Row className="mt-5 pb-5">
        <Col className="col-md-3 col-12">
          <Row className="d-flex flex-column">
            <Col>
              {" "}
              {isWebcamOn ? (
                <Button
                  onClick={handleStopWebcam}
                  size="lg"
                  className="py-3"
                  style={{
                    background:
                      "linear-gradient(to top, #f43b47 0%, #453a94 100%)",
                  }}
                >
                  <p className="h4">Stop Webcam</p>
                </Button>
              ) : (
                <Button
                  onClick={handleStartWebcam}
                  style={{
                    background:
                      "linear-gradient(147deg, #FFE53B 0%, #FF2525 74%)",
                    border: "0px",
                  }}
                  size="lg"
                  className="py-3"
                >
                  <p className="h4">Start Webcam</p>
                </Button>
              )}
            </Col>
            <Col>
              <p className="fw-bold mt-3" style={{ fontSize: "2rem" }}>
                Xin chào:
              </p>
              {detectedPeople.map((person, index) => (
                <p
                  key={index}
                  style={{ color: "black", fontSize: "2rem" }}
                  className="fw-bold mt-1"
                >
                  {person}
                </p>
              ))}
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
          {" "}
          <video
            ref={videoRef}
            id="video"
            width="720"
            height="560"
            style={{
              borderRadius: "10px",
              display: isWebcamOn ? "block" : "none",
              width: "100%",
              height: "34rem",
              border: "2px solid",
            }}
          />
          <canvas
            ref={canvasRef}
            style={{
              position: "absolute",
              display: isWebcamOn ? "block" : "none",
            }}
          />
        </Col>
      </Row>
    </>
  );
};

export default FaceRecognition;
