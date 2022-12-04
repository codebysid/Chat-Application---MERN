import React, { useState } from "react";
import KeyIcon from "@mui/icons-material/Key";
import BubbleChartIcon from "@mui/icons-material/BubbleChart";
import { TextField, Button, Snackbar, Alert } from "@mui/material";
import "../styling/CreateARoom.css";
import io from 'socket.io-client'

export default function CreateARoom({setChatCompo,setChatData,setSocketConnection,setYourName,yourName}) {
  const [roomName, setRoomName] = useState("");
  const [roomKey, setRoomKey] = useState("");
  const [copySnackBar, setCopySnackBar] = useState(false);
  const [generateKeySnackBar, setGenerateKeySnackBar] = useState(false);
  const [incorrectSnackBar,setIncorrectSnackBar]=useState(false)

  const generateKey = () => {
    if (roomName.length > 0) {
      let i;
      var key = "";
      let keyLength = 8;
      let chars =
        "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";

      for (i = 0; i <= keyLength; i++) {
        let random = Math.floor(Math.random() * chars.length);
        key += chars.substring(random, random + 1);
      }
      setRoomKey(key);
      document.getElementById('roomKey').classList.add('roomKey')
      setGenerateKeySnackBar(true);
    } else {
      setRoomKey("Enter Room Name");
    }
  };

  const copy = async () => {
    let text = document.getElementById("roomKey").innerHTML;
    try {
      await navigator.clipboard.writeText(text);
      setCopySnackBar(true);
    } catch (err) {
      console.log(`Not Copied , Error is ${err}`);
    }
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setCopySnackBar(false);
  };

  const handleClose3 = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setIncorrectSnackBar(false);
  };

  const handleKeyClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setGenerateKeySnackBar(false);
  };

  const handleForm=async(e)=>{
    e.preventDefault()
    try{
      const res=await fetch('http://localhost:8000/saveData',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({roomName:roomName,roomKey:roomKey,member:[yourName]})
    })

    const data=await res.json()
    if(data===false){
      setIncorrectSnackBar(true)
      return
    }
    if(data){
      let connection =io.connect('http://localhost:8000')
      setChatCompo(true)
      setChatData(data)
      setSocketConnection(connection)
    }
    }catch(err){
      console.log(`Error in handleForm Function ${err}`)
    }
    
  }

  return (
    <div className="container">
      <form className="createRoomForm" onSubmit={handleForm}>
        <TextField
          className="roomNameInput"
          label="Room Name"
          variant="outlined"
          color="primary"
          value={roomName}
          onChange={(e) => {
            setRoomName(e.target.value);
          }}
          required
        />

        <TextField
          className="memberNameinCreateRoom"
          label="Your Name"
          variant="outlined"
          color="primary"
          value={yourName}
          onChange={(e) => {
            setYourName(e.target.value);
          }}
          required
        />

        <Snackbar
          open={copySnackBar}
          autoHideDuration={5000}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
        >
          <Alert onClose={handleClose} severity="info">
            Copied
          </Alert>
        </Snackbar>

        <div>
          <Button
            className="keyBtn"
            size="small"
            variant="outlined"
            endIcon={<KeyIcon />}
            color="primary"
            onClick={generateKey}
          >
            Generate Room Key
          </Button>

          <span id="roomKey" onClick={copy}>
            {roomKey}
          </span>
        </div>

        <Snackbar
          open={generateKeySnackBar}
          handleClose={handleKeyClose}
          autoHideDuration={8000}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        >
          <Alert handleClose={handleKeyClose} severity="info">
            Click on Key to COPY
          </Alert>
        </Snackbar>

        <Button
          className="submitBtn"
          size="large"
          color="primary"
          endIcon={<BubbleChartIcon />}
          variant="contained"
          type="submit"
        >
          Create
        </Button>
      </form>

      <Snackbar
        open={incorrectSnackBar}
        autoHideDuration={5000}
        onClose={handleClose3}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Alert onClose={handleClose3} severity="info">
          Network Error
        </Alert>
      </Snackbar>
    </div>
  );
}
