
import { useEffect, useState, useRef } from 'react'
import styles from '../../../styles/Chat.module.css'
import { IoSend } from "react-icons/io5";
import ChatMessage from '../../module/ChatMesaage/ChatMessage'
import axios from 'axios';
import { IoCloseSharp } from "react-icons/io5";
const apiUrl = import.meta.env.VITE_API_URL;


export default function Chat() {
    const messageEndRef = useRef(null);
    const [showChat, setShowChat] = useState(false);
    const [step, setStep] = useState(1);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const access_token = localStorage.getItem("access");
    const socketRef = useRef(null);

    const socketUrl = `wss://behrizanpanel.ariisco.com/ws/chat/?token=${access_token}`;

    useEffect(() => {
        socketRef.current = new WebSocket(socketUrl);

        socketRef.current.onopen = (event) => {
            console.log('WebSocket connection opened:', event);
        };

        socketRef.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setMessages((prevMessages) => [...prevMessages, data]);
        };

        socketRef.current.onerror = (error) => {
            console.log('WebSocket error:', error);
        };

        socketRef.current.onclose = (event) => {
            console.log('WebSocket connection closed:', event.code, event.reason);
        };
        return () => {
            if (socketRef.current) {
                socketRef.current.close();
            }
        };
    }, [socketUrl]);

    const getMessages = async () => {
        const headers = {
            Authorization: `Bearer ${access_token}`,
        };

        try {
            const response = await axios.get(`${apiUrl}/chat/get-message/`, { headers });

            if (response.status === 200) {
                setMessages(response.data)
            }
        } catch (e) {
            console.log(e);
            // if (e.response?.status === 401) {
            // }
        }
    };

    const sendMessage = () => {
        if (message.trim() !== '' && socketRef.current.readyState === WebSocket.OPEN) {
            const messagePayload = {
                message,
            };

            socketRef.current.send(JSON.stringify(messagePayload));
            setMessage('');
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    };

    useEffect(() => {
        getMessages();
    }, []);

    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <>
            <div className={`${styles.chat_container} ${step == 2 ? styles.openchat : ""} ${showChat ? styles.chat_container_active : ""}`}>
                <div className={`${styles.chat_header} ${step !== 1 ? styles.arrowshow : ""}`}>
                    {
                        step === 1 ?
                            <div className='d-flex'>
                                <span style={{ marginRight: "25px" }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className={`bi bi-chat-left`} viewBox="0 0 16 16">
                                        <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
                                    </svg>
                                </span>
                                <p style={{ marginBottom: "0", marginRight: "25px" }}>
                                    نوع چت خود را انتخاب کنید
                                </p>
                            </div> :
                            step == 2 ?
                                <>
                                    <p style={{ marginBottom: "0", marginRight: "20px" }}>
                                        چت با پشتیبان
                                    </p>
                                </>
                                :
                                <p style={{ marginBottom: "0", marginRight: "20px" }}>
                                    AI چت با هوش مصنوعی
                                </p>
                    }
                    {
                        step === 1 ?
                            <IoCloseSharp style={{ fontSize: "1.2rem", cursor: "pointer" }} onClick={() => setShowChat(false)} /> :

                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class={`bi bi-arrow-left `} viewBox="0 0 16 16" onClick={() => setStep(1)} style={{ cursor: "pointer" }}>
                                <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8" />
                            </svg>
                    }

                </div>
                {
                    step == 1 ?
                        <div className={styles.chat_hlep}>
                            <div className={styles.admin_text} onClick={() => setStep(2)}>
                                <span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-person" viewBox="0 0 16 16">
                                        <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z" />
                                    </svg>
                                </span>
                                <span className='mx-3'>چت با پشتیبان</span>
                            </div>
                            <div className='mt-4' style={{ cursor: "pointer" }} onClick={() => setStep(3)}>
                                <span>AI</span>
                                <span className='mx-3'> چت با هوش مصنوعی</span>
                            </div>
                        </div> :
                        step == 2 ?
                            <>
                                <div className={styles.chatbody_admin}>
                                    <div className={styles.chat_message_container}>
                                        {
                                            messages.length > 0 &&
                                            messages.map((message, i) => (
                                                <ChatMessage key={i} message={message} />
                                            ))
                                        }
                                        <div ref={messageEndRef} />
                                    </div>
                                </div>
                                <div className={styles.action}>
                                    <div className={styles.inputwrapper}>
                                        <input
                                            type="text"
                                            className={styles.inputchat}
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                        />
                                        <IoSend className={styles.iconsend} onClick={sendMessage} />
                                    </div>
                                </div>
                            </> :
                            null
                }
            </div>
            <div className={styles.chaticon_wrap} onClick={() => {
                setShowChat(prevChat => !prevChat)
                setStep(1)
            }
            } >
                {
                    showChat ?
                        <IoCloseSharp className={styles.icon_chat_close} /> :
                        <svg xmlns="http://www.w3.org/2000/svg" width="50%" height="50%" fill="currentColor" className={`bi bi-chat-left ${styles.Chaticon}`} viewBox="0 0 16 16">
                            <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
                        </svg>
                }

            </div>
        </>
    )
}










