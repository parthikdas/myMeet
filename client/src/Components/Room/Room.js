import { useParams, useNavigate } from "react-router-dom";
import { io } from 'socket.io-client';
import "../../App.css";
import "./Room.css";
import React, { useEffect, useState } from "react";
import { SiLivewire } from "react-icons/si";
import { FiMic, FiMicOff } from "react-icons/fi";
import { BsCameraVideo, BsCameraVideoOff } from "react-icons/bs";
import { RxExit } from "react-icons/rx";
import { MdOutlineChatBubbleOutline } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
const Clock = React.lazy(() => import("../Clock.js"));
const Participant = React.lazy(() => import("../Participant.js"));

const socket = io('http://localhost:5001');

const Room = () => {
    const { roomId } = useParams(); // The useParams hook extracts the route parameters defined in the path, such as :roomId in /room/:roomId.
    const [username, setUsername] = useState("");
    const [users, setUsers] = useState([]);

    const navigate = useNavigate();
    const [chatView, setChatView] = useState(false);
    const [showChats, setShowChats] = useState(true);
    const redirect = () => {
        alert("Meet Ended..");
        navigate("/");
    }

    document.title = `Meet | ${roomId}`

    useEffect(() => {
        console.log(users)
    },[users])
    useEffect(() => {
        const username = prompt("Enter your name:");
        setUsername(username);
        alert(username)

        // Emit joinRoom event
        socket.emit("joinRoom", { roomId, username });

        // Listen for updated user list
        socket.on("roomUsers", (updatedUsers) => {
            setUsers(updatedUsers);
        });

        // Listen for userJoined message
        socket.on("userJoined", (newUser) => {
            console.log(`${newUser} joined the room`);
        });

        return () => {
            socket.disconnect();
        };
    }, [roomId]);

    return (
        <div id="meet-container"> 
            <div id="info">
                <div id="name"><SiLivewire style={{color: "#fff", fontSize: "calc(10px + 3vmin)"}}/>&nbsp;&nbsp;&nbsp;{username}</div>
                <div id="time-roomid">
                    {<Clock/>} &nbsp; | &nbsp; {roomId}
                </div>
            </div>
            <div id="participants">
                <div id="content">
                    {users.map(({ id, username }) => (
                                            <React.Suspense fallback={<div key={id}>Loading...</div>} key={id}>
                                                <Participant username={username} />
                                            </React.Suspense>
                                        ))}
                </div>
                <div className={`grey ${chatView ? "visible" : ""}`} style={{display:`${chatView ? "block" : "none"}`}} id="chat-view-section">
                    <div id="options">
                        <div id="user-chat" className={showChats ? "show" : ""} onClick={() => setShowChats(true)}>Chat</div>
                        <div id="user-list" className={showChats ? "" : "show"} onClick={() => setShowChats(false)}>Participants</div>
                    </div>
                    {
                            showChats ? (
                                <>
                                    <div id="chats"></div>
                                    <div id="sendMsg">
                                        <input type="text" id="msg" placeholder="Send message.." />
                                    </div>
                                </>
                            ) : (
                                <div id="list"> 
                                    <div id="child">
                                    {users.map(({ id, username }) => (
                                        <div className="black" key={id}>
                                            {username}
                                        </div>
                                    ))}
                                    </div>
                                </div>
                            )
                        }
                </div>
            </div>
            <div id="footer">
                <div id="io-permission">
                    <div id="mic" className="grey">
                        <FiMic/>
                    </div>
                    <div id="camera" className="border-grey">
                        <BsCameraVideo/>
                    </div>
                </div>
                <div id="exit">
                    <div id="exit-btn" onClick={redirect}>
                        <RxExit/>
                    </div>
                </div>
                <div id="users-chat">
                    <div id="chat-btn" className="border-grey" onClick={() => {setChatView(!chatView);setShowChats(true);}}>
                        <MdOutlineChatBubbleOutline/>
                    </div>
                    <div id="users-btn" className="border-grey" onClick={() => {setChatView(!chatView);setShowChats(false);}}>
                        <FaUsers/>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Room;