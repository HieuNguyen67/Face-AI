import React, { useState, useEffect, useRef } from "react";
import * as faceapi from "face-api.js";
import axios from "axios";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import defaultImg from "../image/user_new.png";
import FaceRecognition from "../../components/FaceRecognition";
import FacialExpressions from "../../components/FacialExpressions";
import FaceRecognitionImage from "../../components/FaceRecognitionImage";
import Navbar from "react-bootstrap/Navbar";
import logo from "../image/snapedit_1709921434442.png"
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import "./home.scss"
const Home = () => {


  return (
    <>
      <Navbar
        className="bg-body-tertiary"
        expand="lg"
        bg="dark"
        data-bs-theme="dark"
      >
        <Container>
          <Navbar.Brand href="#home">
            <img
              alt=""
              src={logo}
              width="60"
              height="60"
              className="d-inline-block align-top"
            />{" "}
            <h3 className="d-inline-block align-top mt-3">
              NHẬN DIỆN KHUÔN MẶT
            </h3>
          </Navbar.Brand>
        </Container>
      </Navbar>{" "}
      <Tabs
        defaultActiveKey="home"
        id="fill-tab-example "
        className="mb-3 nav-linkk back"
        fill
        style={{ fontSize: "1.3rem" }}
      >
        <Tab eventKey="home" title="NHẬN DIỆN BẰNG WEBCAM">
          <Container>
            <FaceRecognition />
          </Container>
        </Tab>
        <Tab eventKey="profile" title="NHẬN DIỆN BIỂU CẢM KHUÔN MẶT">
          <Container>
            <FacialExpressions />
          </Container>
        </Tab>
        <Tab eventKey="longer-tab" title="NHẬN DIỆN BẰNG HÌNH ẢNH">
          <Container>
            <FaceRecognitionImage />
          </Container>
        </Tab>
      </Tabs>
    </>
  );
};

export default Home;
