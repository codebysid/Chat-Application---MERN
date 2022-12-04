const express = require('express')
const cors = require('cors')
const mongoClient = require('mongodb').MongoClient
const app = express()
const server = require("http").Server(app)
const io = require("socket.io")(server, {
    cors: {
        origin: '*'
    }
})

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://sid:sid5263@cluster0.jhbls8m.mongodb.net/?retryWrites=true&w=majority`
const client = new mongoClient(uri)

var newMemberNotification

const saveDataToDB = async (body,responseServer2) => {
    const roomName = body.roomName
    const roomKey = body.roomKey
    const date=new Date()
    const formattedDate = date.toLocaleString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZone: 'Asia/Kolkata',
    });
    const member = [`${body.member} joined chat at ${formattedDate} `]
    
    
    try {
        // console.log(roomName, roomKey)
        await client.connect()
        const db = client.db('whatsappdb')

        const collection = db.collection('users')

        await collection.insertOne({
            roomName,
            roomKey,
            member
        })
        responseServer2.json(
            {
                roomName,
                roomKey,
                member
            })
        client.close()
    } catch (err) {
        responseServer2.send(false)
        console.log(`Error in saveToDataDB function in backend ${err}`)
    }

}

const joinRoomData = async (data,responseServer) => {
    const roomname = data.roomName
    const roomkey = data.roomKey
    const date = new Date()
    const formattedDate = date.toLocaleString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZone: 'Asia/Kolkata',
    });
    const newMember = [`${data.newMember} joined at ${formattedDate}`]

    try {
        await client.connect()
        const db = client.db('whatsappdb')

        const collection = db.collection('users')

        let res = await collection.findOne({
            roomName: roomname,
            roomKey: roomkey
        })

        if (res) {
            res.member.push(newMember)
            responseServer.json(res)
        }
        
        await collection.updateOne({
            roomName: roomname,
            roomKey: roomkey
        }, {
            $set: res
        }, {})
        
        client.close()
    } catch (err) {
        console.log(`Error in joinRoomData function in Backend ${err}`)
        responseServer.send(false)
    }
}

app.post('/saveData', (req, res) => {
    saveDataToDB(req.body,res)
})

app.post('/joinRoom', (req, res) => {
    newMemberNotification=req.body.newMember
    joinRoomData(req.body,res)
})

server.listen(8000, () => {
    console.log("Server started at 8000")
})


io.on('connection', socket => {

    console.log(`${newMemberNotification} connects`)
    socket.on("disconnect",()=>{
        console.log(`${newMemberNotification} disconnects`)
    
    })
    socket.on("sendMessage",msg=>{
        io.emit('Message',msg)
    })
})
