import React, { useEffect, useRef, useState } from 'react';
import { api } from "~/utils/api";
import { Button, Input, Loader } from '@mantine/core';
import { IconSend, } from '@tabler/icons-react';
import type { Message } from '@prisma/client'
import { toast } from "react-hot-toast";
import pusher from "~/stores/pusher";
import { Events } from "~/const/events";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/router";

function Index(props) {
    const router = useRouter()
    const assignmentId = parseInt(router.query.assignmentId?.toString() ?? '')
    const [msgs, setMsgs] = useState<Message[]>([])
    const chatQuery = api.chat.chat.useQuery({ assignmentId }, {
        onSuccess: data => setMsgs(data.messages)
    })
    const [text, setText] = useState('')
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const user = useAuth()

    const chat = chatQuery.data

    useEffect(() => {
        if (!chat) return

        const id = chat.fromUserId
        const toId = chat.toUserId
        // reset before new subscription
        if (!id || !toId) return

        const idStr = `${id}-${toId}`
        pusher.unsubscribe(idStr)
        pusher.unbind(idStr)
        pusher.subscribe(idStr).bind(Events.SEND_MESSAGE, (message: Message) => {
            setMsgs(msgs => [message, ...msgs])
            messagesContainerRef.current?.scroll({ behavior: "smooth", top: 0 })
        })

        return () => pusher.unsubscribe(chat.fromUserId)
    }, [user.userId, chat])

    const sendMutation = api.chat.send.useMutation({
        onSuccess: () => {
            setText('')
        },
        onError: err => toast.error(err.message),
    })

    useEffect(() => {
        messagesContainerRef.current?.scroll({ behavior: "smooth", top: 0 })
    }, [msgs])

    if (!chatQuery.isSuccess) return <center><Loader /></center>

    return (
        <div className='flex flex-row h-[80vh]'>
            <div
                className='flex flex-col-reverse space-y-4 w-9/12 overflow-y-auto mb-[5vh] mt-4 mx-2 h-[60vh] [&::-webkit-scrollbar]:hidden'
                ref={messagesContainerRef}>
                {
                    msgs?.map(message => (
                        <div key={message.id} className='flex flex-col-reverse'>
                            {
                                message.senderId != user.userId ? <div className='flex flex-row mb-1'>
                                    <div
                                        className='py-2 px-4 bg-blue-300 max-w-xl rounded-b-3xl rounded-tr-3xl'>{message.text}</div>
                                    <div className='w-full' />
                                </div> :
                                    <div className='flex flex-row mb-1'>
                                        <div className='w-full' />
                                        <div
                                            className='py-2 px-4 bg-blue-300 max-w-xl rounded-t-3xl rounded-bl-3xl'>
                                            {message.text}
                                        </div>
                                    </div>
                            }
                        </div>
                    ))
                }
                <Input value={text} onChange={e => setText(e.target.value)} placeholder='Write something..'
                    size='lg' className='m-4 absolute bottom-4 w-8/12' rightSectionWidth={96 * 2 + 6}
                    rightSection={
                        <div className='flex flex-row space-x-2'>
                            <Button variant='subtle' disabled={!text} loading={sendMutation.isLoading}
                                onClick={() => sendMutation.mutate({
                                    msg: text,
                                    to: chat!.toUserId!,
                                    senderId: user.userId!,
                                })}>
                                Start Bidding
                            </Button>
                            <Button variant='subtle' disabled={!text} loading={sendMutation.isLoading}
                                onClick={() => sendMutation.mutate({
                                    msg: text,
                                    to: chat!.toUserId!,
                                    senderId: user.userId!,
                                })}>
                                <IconSend />
                            </Button>
                        </div>
                    } />
            </div>
        </div>
    );
}

export default Index;