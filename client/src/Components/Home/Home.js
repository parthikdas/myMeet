import { useState } from "react";
import axios from 'axios';
import "../../App.css";
import "./Home.css";
const Home = () => {
    document.title = "myMeet";
    const [roomId, setRoomId] = useState("");

    // Method to generate a unique UUID
    const generateUUID = () => {
        return Math.random().toString(36).substring(2, 11); // Generates a 9-character unique ID
    };

    // Method to format UUID (abc-def-ghi)
    const formatUUID = (UUID) => {
        return UUID.match(/.{1,3}/g).join('-');
    }


    const newRoom = async () => {
        // create a unique uuid here of 9 characters
        // Send it to backend to check whether a room of that name exists 
        // if not create that room and redirect there
        // if yes do it in a loop till a new room eligible unique uuid is available
        const UUID = formatUUID(generateUUID());
        alert(UUID);
        try {
            const response = await axios.post(`http://localhost:5001/rooms?name=${UUID}`);
            const { name } = response.data; // Extract room name
            if (name) {
                window.location.href = `/room/${name}`; // Redirect to the room page
            }
        } catch (error) {
            console.log(error);
            alert("Failed to create room. Please try again.");
        }
    }


    const joinRoom = () => {
        // Edge case Need to be checked : if user put 1 - and other one as alphabet like abc-defghij
        const validRoomId = roomId.indexOf('-') === -1 ? formatUUID(roomId) : roomId;
        alert(validRoomId);
    }

    
    return (
        <div id="container">
            <h1>Home Page</h1>
            <div className="box">
                <button className="button" id="newRoomButton" type="button" onClick={newRoom}>New Meeting</button>
                <input id="roomId" 
                    type="text" 
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)} 
                    placeholder="abc-def-ghi"
                    maxLength={roomId.indexOf('-') === -1 ? 9 : 11}/>
                <button className="button" 
                        id={roomId==="" ? "disabled" : "existingRoomButton"}
                        onClick={joinRoom}
                        type="button" disabled = {roomId===""}>Join</button>
            </div>
        </div>
    )
};
export default Home;