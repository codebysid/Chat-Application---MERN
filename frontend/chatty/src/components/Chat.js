import React,{useState,useEffect} from "react";
import '../styling/Chat.css'
import { TextField, Button } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";

export const Chat = ({chatData,socketConnection,yourName,members,setMembers
}) => {

  const [msg,setMsg]=useState('')
  const [allChat,setAllChat]=useState([])
  setMembers(chatData.member)

  var classMessage
  var messageLabel

  const scrolTo = () => {
    let ele = document.getElementById("chatDisplay");
    ele.scrollTop = ele.scrollHeight;
  };

  const handleForm=(e)=>{
    e.preventDefault()
    socketConnection.emit('sendMessage',{name:yourName,msg:msg})
    setMsg("")
  }
  
  useEffect(()=>{
    socketConnection.on('Message',msg=>{
      setAllChat([...allChat,msg])
    })

    scrolTo()
  })


  return (
    <div className="compo">
      <div className="mainDiv">
        <div className="members">
  
          <h3 className="roomMemberHeading">
            Room Members History
          </h3>
          {members.length > 0
            ? members.map((ele, key) => {
                return <div className="memberName"><NotificationsNoneIcon/><p>{ele}</p></div>;
              })
            : null}
        </div>

        <div className="chatDisplay" id="chatDisplay">
          {allChat
            ? allChat.map((ele, key) => {
                if (ele.name === yourName) {
                  classMessage = "rightMessage";
                  messageLabel = "right";
                } else {
                  classMessage = "leftMessage";
                  messageLabel = "left";
                }
                return (
                  <div>
                    <p className={classMessage} id="msgPara">
                      {ele.msg} <br></br>
                    </p>
                    <sub className={messageLabel}>from {ele.name} </sub>
                  </div>
                );
              })
            : null}
        </div>
      </div>

      <form className="chatForm" onSubmit={handleForm}>
        <TextField
          label="Write Message"
          color="primary"
          variant="outlined"
          value={msg}
          autoComplete="off"
          fullWidth
          onChange={(e) => {
            setMsg(e.target.value);
          }}
          required
        />
        <Button
          className="sendMessageBTN"
          variant="contained"
          color="primary"
          type="submit"
          size="large"
          endIcon={<SendIcon />}
        >
          Send
        </Button>
      </form>
    </div>
  );
};
