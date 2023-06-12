import React, {useEffect, useRef, useState} from 'react';
import {useAutoAnimate} from "@formkit/auto-animate/react";
import {api} from "~/utils/api";
import pusher from "~/stores/pusher";
import {Events} from "~/const/events";
import {useAuth} from "@clerk/nextjs";
import type {Message} from "@prisma/client";
import {useQueryClient} from "@tanstack/react-query";
import {toast} from "react-hot-toast";
import {IconChevronsDownRight, IconMessageChatbot, IconSend} from "@tabler/icons-react";
import {Input} from "@mantine/core";

function ChatDialog() {
    const [open, setOpen] = useState(false)
    const [msg, setMsg] = useState('')
    const user = useAuth()
    const [animate] = useAutoAnimate({duration: 200, easing: 'linear'})
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const sendMutation = api.chat.sendAdmin.useMutation({
        onError: err => toast.error(err.message)
    })

    const client = useQueryClient()
    const chatData = api.chat.getWithAdmin.useQuery()

    useEffect(() => {
        if (chatData.isSuccess) {
            client.setQueryData<Message[]>(['chat'], chatData.data?.messages || [])
        }
    }, [chatData.isSuccess])

    useEffect(() => {
        const id = user.userId
        // reset before new subscription
        if (id) {
            pusher.unsubscribe(id)
            pusher.unbind(id)
            pusher.subscribe(id).bind(Events.SEND_MESSAGE, (message: Message) => {
                client.setQueryData<Message[]>(['chat'], d => [message, ...d!])
                messagesContainerRef.current?.scroll({behavior: "smooth", top: 0})
            })
        }
    }, [user.userId])

    function sendMsg() {
        if (!msg || msg.length == 0 || sendMutation.isLoading) return

        sendMutation.mutate({msg})

        setMsg('')
    }

    return (
        <div ref={animate} className='fixed bottom-8 right-8 bg-transparent z-10 md:w-1/2 h-2/3 sm:w-3/4 xs:w-3/4'>
            {
                !open && <button onClick={() => setOpen(true)}
                                 className='w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center shadow-2xl hover:bg-blue-900 absolute bottom-2 right-2'>
                    <IconMessageChatbot className='scale-150 text-white'/>
                </button>
            }
            {
                open && <div className='w-full h-full bg-blue-300 p-4 rounded-xl flex flex-col space-y-2'>
                    <div className='w-full bg-white px-4 py-2 rounded-lg flex flex-row space-x-2'>
                        <button onClick={() => setOpen(false)}>
                            <IconChevronsDownRight className='hover:text-blue-900'/>
                        </button>
                    </div>
                    <div className='h-full flex flex-col-reverse overflow-y-scroll [&::-webkit-scrollbar]:hidden'
                         ref={messagesContainerRef}>
                        {
                            chatData.isLoading ? <center>
                                {/*<CircularProgress/>*/}
                            </center> : client.getQueryData<Message[]>(['chat'])?.map(msg => (
                                msg.senderId == user.userId ?
                                    <div key={msg.id} className='w-full items-start flex flex-col'>
                                        <div className='bg-white my-1 px-2 py-1 left-0 w-3/4 rounded-b-xl rounded-tr-xl'>
                                            <h1>{msg.text}</h1>
                                        </div>
                                    </div> : <div key={msg.id} className='w-full items-start flex flex-col'>
                                        <div className='bg-white my-1 px-2 py-1 left-0 w-3/4 rounded-b-xl rounded-tr-xl'>
                                            <h1>{msg.text}</h1>
                                        </div>
                                    </div>
                            ))
                        }
                    </div>
                    <Input placeholder='Ask admin..' value={msg} onChange={(e) => setMsg(e.target.value)}
                           onKeyDown={e => {
                               if (e.key == 'Enter') {
                                   sendMsg()
                               }
                           }}
                           rightSection={
                               <button onClick={sendMsg}>
                                   <IconSend
                                       className={`text-${msg?.length == 0 || sendMutation.isLoading ? 'black' : 'blue-600'}`}/>
                               </button>
                           }/>
                </div>
            }
        </div>
    );
}

export default ChatDialog;