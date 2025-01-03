import "../../App.css";
import "../Room/Room.css";
import { SiLivewire } from "react-icons/si";
import { FiMic, FiMicOff } from "react-icons/fi";
import { BsCameraVideo, BsCameraVideoOff } from "react-icons/bs";
import { RxExit } from "react-icons/rx";
import { MdOutlineChatBubbleOutline } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
const Clock = React.lazy(() => import("../Clock.js"));
const Participant = React.lazy(() => import("../Participant.js"));



const Meet = () => {
    
    const navigate = useNavigate();
    const [chatView, setChatView] = useState(false);
    const [showChats, setShowChats] = useState(true);
    const redirect = () => {
        navigate("/");
    }
    const hh = Array.from({ length: 16 }, (_, i) => ({
        id: i,
        username: `User${i + 1}`,
    }));;

    document.title = 'Meet | abc-def-ghi'

    return (
        <div id="meet-container"> 
            <div id="info">
                <div id="name"><SiLivewire style={{color: "#fff", fontSize: "calc(10px + 3vmin)"}}/>&nbsp;&nbsp;&nbsp;Heelo</div>
                <div id="time-roomid">
                    {<Clock/>} &nbsp; | &nbsp; abc-def-ghi
                </div>
            </div>
            <div id="participants">
                <div id="content">
                {hh.map(({ id, username }) => (
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
                                        { hh.map((key) => 
                                            (<div className="black">{key}</div>)
                                        )}
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
export default Meet;

/*
    Things to do here : 
    1. Fetch time and put it - Done
    2. Fetch the roomId and put it - Done
    3. Fetch the username and put it - Done
    4. slider thing
    5. Footer - Done
    6. Audio Video
    7. Exit button - Done
    8. Chat option
    9. View Participants - Done
    10. In while sending the list do something to indicate the current usrr like (You)
    10. Ui changes when chat and view cicked - Done
    11. Screen Share
    12. All the boxes getting re-rendered on chat-view section is opened prevent it as colours are also changing - See below and make it on another component. - Done
    The issue arises because useState and useEffect cause re-renders whenever the state changes, which is the default behavior of React. If you're displaying time but want to avoid unnecessary re-renders of other components (like map-based divs)
    13. join by type
*/

// When the buttons are clicked the color is changed the circle colours so do something to prevent rendering it