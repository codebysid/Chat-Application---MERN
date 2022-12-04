import React, { useState } from "react";
import { TextField, Button ,Snackbar,Alert} from "@mui/material";
import "../styling/JoinARoom.css";
import AddIcon from "@mui/icons-material/Add";
import io from "socket.io-client";

export const JoinARoom = ({setChatCompo,setChatData,setSocketConnection,setYourName,yourName}) => {
  const [roomName, setRoomName] = useState("");
  const [roomKey, setRoomKey] = useState("");
  const [incorrecrSnackBar,setIncorrectSnackBar]=useState(false)

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setIncorrectSnackBar(false);
  };

  const handleForm = async (e) => {
    e.preventDefault();

    try{
        const res=await fetch('http://localhost:8000/joinRoom',{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({
                roomName:roomName,
                roomKey:roomKey,
                newMember:yourName
            })
        })
        const data=await res.json()
        console.log(data)
        if(data===false){
          setIncorrectSnackBar(true)
          return
        }
        if(data){
          let connection = io.connect("http://localhost:8000");
          setChatCompo(true)
          setChatData(data)
          setSocketConnection(connection)
        }
    }catch(err){
        console.log(`Error in Join A Room Handle Form ${err}`)
    }
  };
  return (
    <div>
      <form className="joinARoomForm" onSubmit={handleForm}>
        <TextField
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
          label="Room Key"
          variant="outlined"
          color="primary"
          value={roomKey}
          onChange={(e) => {
            setRoomKey(e.target.value);
          }}
          required
        />

        <TextField
          label="Your Name"
          variant="outlined"
          color="primary"
          value={yourName}
          onChange={(e) => {
            setYourName(e.target.value);
          }}
          required
        />

        <Button
          variant="contained"
          color="primary"
          endIcon={<AddIcon />}
          className="joinBtn"
          type="submit"
        >
          Join
        </Button>
      </form>
      <Snackbar
        open={incorrecrSnackBar}
        autoHideDuration={5000}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Alert onClose={handleClose} severity="info">
          Incorrect Room Name or Room Key
        </Alert>
      </Snackbar>
    </div>
  );
};
