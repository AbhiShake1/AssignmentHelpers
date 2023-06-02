import React, {useRef, useState} from 'react';
import {useAutoAnimate} from "@formkit/auto-animate/react";
import {CancelTwoTone, ChatTwoTone, SendTwoTone} from "@mui/icons-material";
import {Input} from "@mui/joy";

function ChatDialog() {
    const [open, setOpen] = useState(false)
    const [msg, setMsg] = useState('')
    const [msgs, setMsgs] = useState<string[]>([])
    const [animate] = useAutoAnimate({duration: 200, easing: 'ease-in'})

    function sendMsg() {
        if (!msg || msg.length == 0) return

        setMsgs(msgs => [msg, ...msgs])
        setMsg('')
    }

    return (
        <div ref={animate} className='fixed bottom-8 right-8 bg-transparent'>
            {
                open && <div className='w-64 h-96 bg-blue-300 p-4 rounded-xl flex flex-col space-y-2'>
                    <div className='w-full bg-white px-4 py-2 rounded-lg flex flex-row space-x-2'>
                        <button onClick={() => setOpen(false)}>
                            <CancelTwoTone className='hover:text-blue-900'/>
                        </button>
                    </div>
                    <div className='h-full flex flex-col-reverse overflow-y-scroll [&::-webkit-scrollbar]:hidden'>
                        {/*from user*/}
                        {
                            msgs.map((msg, idx) => (
                                <div className='w-full items-end flex flex-col' key={idx}>
                                    <div className='bg-white my-1 px-2 py-1 w-3/4 rounded-t-xl rounded-bl-xl'>
                                        <h1>{msg}</h1>
                                    </div>
                                </div>
                            ))
                        }
                        <div className='w-full items-end flex flex-col'>
                            <div className='bg-white my-1 px-2 py-1 w-3/4 rounded-t-xl rounded-bl-xl'>
                                <h1>test3 from user</h1>
                            </div>
                        </div>
                        {/*from admin*/}
                        <div className='w-full items-start flex flex-col'>
                            <div className='bg-white my-1 px-2 py-1 left-0 w-3/4 rounded-b-xl rounded-tr-xl'>
                                <h1>test from admin</h1>
                            </div>
                        </div>
                        {/*from user*/}
                        <div className='w-full items-end flex flex-col'>
                            <div className='bg-white my-1 px-2 py-1 w-3/4 rounded-t-xl rounded-bl-xl'>
                                <h1>test from user</h1>
                            </div>
                        </div>
                    </div>
                    <Input placeholder='Ask admin..' value={msg} onChange={(e) => setMsg(e.target.value)}
                           endDecorator={<button className='bg-transparent' onClick={sendMsg}>
                               <SendTwoTone className='bg-transparent'/>
                           </button>}/>
                </div>
            }
            {
                !open && <button onClick={() => setOpen(true)}
                                 className='w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center shadow-2xl hover:bg-blue-900'>
                    <ChatTwoTone className='scale-150 text-white'/>
                </button>
            }
        </div>
    );
}

export default ChatDialog;