import React, { useState } from 'react'
import {v4 as uuidV4} from 'uuid';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();
    const [roomId , setRoomId] = useState('');
    const [username , setUserName] = useState('');
    const createNewRoom = (e)=>{
        e.preventDefault();
        const id = uuidV4();
        setRoomId(id);
        // console.log(id);
        toast.success('created a new room');
    }

    const joinRoom = () =>{
        if(!roomId || !username){
            toast.error('Room Id & username is req');
            return;
        }

        //redirect 
        navigate(`/editor/${roomId}` , {
            state:{
                username,
            },
        })
    }

    const handleInputEnter = (e) =>{
        // console.log('event' , e.code);
        if(e.code === 'Enter'){
            joinRoom();
        }
    }
    return (
        <div className='homePageWrapper'>
            <div className='formwrapper'>
                <img className='homePageLogo' src='code-sync.png' alt='code-sync-logo' />
                <h4 className='mainLabel'>Paste invitation ROOM ID</h4>
                <div className='inputGroup'>
                    <input
                        type='text'
                        className='inputBox'
                        placeholder='ROOM ID'
                        onChange={(e)=>setRoomId(e.target.value)}
                        value={roomId}
                        onKeyUp={handleInputEnter}
                    />
                    <input
                        type='text'
                        className='inputBox'
                        placeholder='User Name'
                        onChange={(e)=>setUserName(e.target.value)}
                        value={username}
                        onKeyUp={handleInputEnter}
                    />
                    <button className='btn joinBtn' onClick={joinRoom}>Join</button>
                    <span className='createInfo'>
                        if you Don't have an invite then create &nbsp;
                        <a onClick={createNewRoom} href='#' className='createNewBtn'>
                            new room
                        </a>
                    </span>
                </div>
            </div>
            <footer>
                <h4>Built With love </h4>
            </footer>
        </div>
    )
}

export default Home