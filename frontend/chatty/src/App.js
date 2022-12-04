import "./App.css";
import { createTheme,colors,ThemeProvider } from "@mui/material";
import Button from "@mui/material/Button";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom";
import CreateARoom from "./components/CreateARoom";
import { JoinARoom } from "./components/JoinARoom";
import {useState} from 'react'
import { Chat } from "./components/Chat";

const theme=createTheme({
  palette:{
    primary:{
      main:colors.blue[900]
    },
  },
})

function App() {
  const [createARoom,setCreateARoom]=useState(false)
  const [joinARoom,setJoinARoom]=useState(false)
  const [chatCompo, setChatCompo] = useState(false);
  const [chatData,setChatData]=useState()
  const [socketConnection,setSocketConnection]=useState()
  const [yourName, setYourName] = useState("");
  const [members,setMembers]=useState([])


  // if(chatCompo){
  //   setCreateARoom(false)
  //   setJoinARoom(false)
  // }



  return (
    <ThemeProvider theme={theme}>
      <div className="exceptChat">
      <div className="App">
          <div className="btn">
            <Button
              color="success"
              size="large"
              variant="contained"
              endIcon={<DriveFileRenameOutlineIcon />}
              onClick={() => {
                setCreateARoom(true);
                setJoinARoom(false);
              }}
            >
              Create A Room
            </Button>

            <Button
              color="success"
              endIcon={<FamilyRestroomIcon />}
              size="large"
              variant="contained"
              onClick={() => {
                setJoinARoom(true);
                setCreateARoom(false);
              }}
            >
              Join A Room
            </Button>
          </div>
          {createARoom ? 
          <CreateARoom 
          setChatCompo={setChatCompo} 
          setChatData={setChatData} 
          setSocketConnection={setSocketConnection}
          setYourName={setYourName}
          yourName={yourName}
          /> : null}

          {joinARoom ? 
          <JoinARoom 
          setChatCompo={setChatCompo} 
          setChatData={setChatData} 
          setSocketConnection={setSocketConnection}
          setYourName={setYourName}
          yourName={yourName}
          /> : null}
        </div>
        {chatCompo && chatData ? 
        <Chat 
        chatData={chatData} 
        socketConnection={socketConnection}
        yourName={yourName}
        members={members}
        setMembers={setMembers}
        /> : null}
      </div>
    </ThemeProvider>
  );
}

export default App;
