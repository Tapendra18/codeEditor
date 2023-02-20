import React, { useEffect, useRef, useState } from 'react';
import ACTIONS from '../Actions';
import Client from '../components/Client';
import EditorPage from '../components/EditorPage';
import {initSocket} from '../socket';
import { Navigate, useLocation , useNavigate ,useParams} from 'react-router-dom';
import { toast } from 'react-hot-toast';

const Editor = () => {
    const socketRef = useRef(null);
    const location  = useLocation();
    const reactNavigator = useNavigate();
    const codeRef = useRef(null);

    const {roomId} = useParams();

    useEffect(() => {
        const init = async () => {
            socketRef.current = await initSocket();
            socketRef.current.on('connect_error', (err) => handleErrors(err));
            socketRef.current.on('connect_failed', (err) => handleErrors(err));

            function handleErrors(e) {
                console.log('socket error', e);
                toast.error('Socket connection failed, try again later.');
                reactNavigator('/');
            }

            socketRef.current.emit(ACTIONS.JOIN, {
                roomId,
                username: location.state?.username,
            });

            // Listening for joined event
            socketRef.current.on(
                ACTIONS.JOINED,
                ({ clients, username, socketId }) => {
                    if (username !== location.state?.username) {
                        toast.success(`${username} joined the room.`);
                        console.log(`${username} joined`);
                    }
                    setClients(clients);
                    socketRef.current.emit(ACTIONS.SYNC_CODE, {
                        code: codeRef.current,
                        socketId,
                    });
                }
            );

            // Listening for disconnected
            socketRef.current.on(
                ACTIONS.DISCONNECTED,
                ({ socketId, username }) => {
                    toast.success(`${username} left the room.`);
                    setClients((prev) => {
                        return prev.filter(
                            (client) => client.socketId !== socketId
                        );
                    });
                }
            );
        };
        init();
        // return () => {
        //     socketRef.current.disconnect();
        //     socketRef.current.off(ACTIONS.JOINED);
        //     socketRef.current.off(ACTIONS.DISCONNECTED);
        // };
    }, []);
    const [clients, setClients] = useState([
       
    ]);

    async function copyRoomId(){
        try{
            await navigator.clipboard.writeText(roomId);
            toast.success('room ID has been copy to your clipboard')
        }catch(err){
            toast.error('Room id not copy');
            console.log(err);
        }
    }

    function leaveRoom(){
        reactNavigator('/');
    }

    if(!location.state){
        <Navigate to='/'/>
    }
    return (
        <div className='mainWrap'>
            <div className='aside'>
                <div className='asideInner'>
                    <div className='logo'>
                        <img
                            className='logoImage'
                            src='/code-sync.png'
                            alt='logo'
                        />
                    </div>
                    <h3>connected</h3>
                    <div className='clientList'>
                        {
                            clients.map((client) => (
                                <Client
                                    key={client.socketId}
                                    username={client.username}
                                />
                            ))
                        }
                    </div>
                </div>
                <button className='btn copyBtn' onClick={copyRoomId}>Copy Room Id</button>
                <button className='btn leaveBtn' onClick={leaveRoom}>Leave</button>
            </div>
            <div className='editorwrap'>
                <EditorPage socketRef={socketRef} roomId={roomId} oncodeChange={(code)=> {codeRef.current = code}}/>
            </div>
        </div>
    )
}

export default Editor