import React, {useEffect, useRef, useState} from 'react';
import {api} from "~/utils/api";
import {ActionIcon, Button, Input, Loader, Navbar} from '@mantine/core';
import {IconArrowFork, IconSend, IconUser,} from '@tabler/icons-react';
import type {Message} from '@prisma/client'
import {toast} from "react-hot-toast";
import pusher from "~/stores/pusher";
import {Events} from "~/const/events";
import {useAuth} from "@clerk/nextjs";
import {useRouter} from "next/router";
import {useChatBarStyles} from "~/hooks/useChatBarStyles";

function Index() {
    const router = useRouter()
    const assignmentId = parseInt(router.query.assignmentId?.toString() ?? '')
    const [msgs, setMsgs] = useState<Message[]>([])
    const chats = api.chat.assignmentChats.useQuery(assignmentId)
    const {classes, cx} = useChatBarStyles();
    const [active, setActive] = useState('')
    const [text, setText] = useState('')
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const user = useAuth()

    const chat = chats.data?.find(c => c.fromUserId == active)

    const sendMutation = api.chat.send.useMutation({
        onSuccess: () => {
            setText('')
        },
        onError: err => toast.error(err.message),
    })

    useEffect(() => {
        if (chat) {
            setMsgs(chat.messages)
        }
    }, [active, chat])

    useEffect(() => {
        if (!chat) return

        const id = chat.fromUserId
        // reset before new subscription
        if (!id) return

        const idStr = `${id}-${user.userId!}`
        pusher.unsubscribe(idStr)
        pusher.unbind(idStr)
        pusher.subscribe(idStr).bind(Events.SEND_MESSAGE, (message: Message) => {
            setMsgs(msgs => [message, ...msgs])
        })

        return () => pusher.unsubscribe(chat.fromUserId)
    }, [user.userId, chat])

    useEffect(() => {
        messagesContainerRef.current?.scroll({behavior: "smooth", top: 0})
    }, [msgs])

    if (!chats.isSuccess) return <center><Loader/></center>

    const links = chats.data.map((item) => (
        <a
            className={cx(classes.link, {[classes.linkActive]: item.fromUserId === active})}
            key={item.fromUserId}
            onClick={(event) => {
                event.preventDefault();
                setActive(item.fromUserId);
            }}
        >
            <IconUser className={classes.linkIcon} stroke={1.5}/>
            <span>{item.fromUser.name}</span>
            <ActionIcon><IconArrowFork className='ml-4'/></ActionIcon>
        </a>
    ))

    return (
        <div className='flex flex-row h-[80vh]'>
            <Navbar className='w-2/12 h-full' p="md">
                {links}
            </Navbar>
            {
                chat && msgs.length > 0 &&
                <div
                    className='flex flex-col-reverse space-y-4 w-9/12 overflow-y-auto mb-[5vh] mt-4 mx-2 h-[60vh] [&::-webkit-scrollbar]:hidden'
                    ref={messagesContainerRef}>
                    {
                        msgs?.map(message => (
                            <div key={message.id} className='flex flex-col-reverse'>
                                {
                                    message.senderId == '' ? <div className='flex flex-row mb-1'>
                                            <div
                                                className='py-2 px-4 bg-blue-300 max-w-xl rounded-b-3xl rounded-tr-3xl'>{message.text}</div>
                                            <div className='w-full'/>
                                        </div> :
                                        <div className='flex flex-row mb-1'>
                                            <div className='w-full'/>
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
                           size='lg' className='m-4 absolute bottom-4 w-8/12'
                           rightSection={
                               <Button variant='subtle' disabled={!text} loading={sendMutation.isLoading}
                                       onClick={() => sendMutation.mutate({
                                           msg: text,
                                           to: chat.fromUserId,
                                           senderId: '',
                                           fromAdmin: true,
                                       })}>
                                   <IconSend/>
                               </Button>
                           }/>
                </div>
            }
        </div>
    );
}

export default Index;
