// Import dependencies
import * as Realm from "realm-web";
import React, { useRef, useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import * as cocossd from "@tensorflow-models/coco-ssd";
import Webcam from "react-webcam";
import "./App.css";

function App() {
  
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
 
  // Main function
  const runCoco = async () => {
    const net = await cocossd.load();
    console.log("Handpose model loaded.");
    //  Loop and detect hands
    setInterval(() => {
      detect(net);
    }, 10);
  };

   // Realm login
   const mongoDBRealm = async (text,perc,x, y, width, height) => {
    // add your Realm App Id to the .env.local file
    const REALM_APP_ID = "<<MongoDB Relam ID>>";
    const app = new Realm.App({ id: REALM_APP_ID });
    const credentials = Realm.Credentials.anonymous();
    try {
      const user = await app.logIn(credentials);
      await user.functions.update(text, perc , x , y , width , height);
    } catch (error) {
      console.error(error);
    }
 };

  const drawRect = (detections, ctx) =>{
    // Loop through each prediction
    detections.forEach(prediction => {
  
      // Extract boxes and classes
      console.log(prediction);
      const [x, y, width, height] = prediction['bbox']; 
      const text = prediction['class']; 
      const score = prediction['score'];
      const scorePerc = Number.parseFloat(score * 100).toFixed(0);
      const perc = scorePerc + "%";
      const textScore = text + " " + perc;
      mongoDBRealm(text,perc,x, y, width, height)
     
      // Set styling
      const color = Math.floor(Math.random()*16777215).toString(16);
      ctx.strokeStyle = '#' + color
      ctx.font = '18px Arial';
  
      // Draw rectangles and text
      ctx.beginPath();   
      ctx.fillStyle = '#' + color
      ctx.fillText(textScore, x, y);
      ctx.rect(x, y, width, height); 
      ctx.stroke();
    });
  };
  const detect = async (net) => {
    // Check data is available
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Set canvas height and width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // Make Detections
      const obj = await net.detect(video);

      // Draw mesh
      const ctx = canvasRef.current.getContext("2d");
      drawRect(obj, ctx); 
    }
  };

  useEffect(()=>{
    runCoco()
    //mongoDBRealm()
  },[]);

  const videoConstraints = {
      facingMode: { exact: "environment" }
  };

  return (
    <div className="App">
      <header className="App-header">
        <Webcam
          ref={webcamRef}
          muted={true} 
          videoConstraints = {videoConstraints}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 720,
            height: 1080,
            
          }}
        />

        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            top : 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 700,
            height: 600,
          }}
        />
      </header>
    </div>
  );
}

export default App;
