import React, {useEffect, useRef, useState} from 'react';
import {api} from "~/utils/api";
import {Button, Input, Loader} from '@mantine/core';
import {IconSend,} from '@tabler/icons-react';
import type {Message} from '@prisma/client'
import {toast} from "react-hot-toast";
import pusher from "~/stores/pusher";
import {Events} from "~/const/events";
import {useAuth, useUser} from "@clerk/nextjs";
import {useRouter} from "next/router";
import {modals} from '@mantine/modals';
import {QuantityInput} from '~/components/QuantityInput';
import ChatBubble from "~/components/ChatBubble";

function Index() {
    const router = useRouter()
    const assignmentId = parseInt(router.query.assignmentId?.toString() ?? '')
    const [msgs, setMsgs] = useState<Message[]>([])
    const chatQuery = api.chat.chat.useQuery({assignmentId}, {
        onSuccess: data => setMsgs(data.messages)
    })
    const [text, setText] = useState('')
    const [biddingAmount, setBiddingAmount] = useState<number>()
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const user = useAuth()
    const auth = useUser()

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
            messagesContainerRef.current?.scroll({behavior: "smooth", top: 0})
        })

        return () => pusher.unsubscribe(chat.fromUserId!)
    }, [user.userId, chat])

    const sendMutation = api.chat.send.useMutation({
        onSuccess: () => {
            setText('')
            modals.closeAll()
        },
        onError: err => toast.error(err.message),
    })

    useEffect(() => {
        messagesContainerRef.current?.scroll({behavior: "smooth", top: 0})
    }, [msgs])

    const assignment = chat?.assignment

    const max = Number(assignment?.budget.replace(/\D/g, ""))

    useEffect(() => {
        setBiddingAmount(amount => amount || max)
    }, [max])

    if (!chatQuery.isSuccess) return <center><Loader/></center>

    return (
        <div className='flex flex-row h-[80vh]'>
            <div
                className='flex flex-col-reverse space-y-4 w-9/12 overflow-y-auto mb-[5vh] mt-4 mx-2 h-[60vh] [&::-webkit-scrollbar]:hidden'
                ref={messagesContainerRef}>
                {
                    msgs?.map(message => <ChatBubble message={message} key={message.id}/>)
                }
                <Input value={text} onChange={e => setText(e.target.value)} placeholder='Write something..'
                       size='lg' className='m-4 absolute bottom-4 w-8/12' rightSectionWidth={96 * 2 + 6}
                       rightSection={
                           <div className='flex flex-row space-x-2'>
                               {
                                   !chat?.biddingFor && <Button variant='subtle'
                                                                onClick={() => modals.open({
                                                                    title: 'Enter bidding amount',
                                                                    children: <div className='flex flex-col space-y-6'>
                                                                        <QuantityInput max={max} defaultValue={max}
                                                                                       onChange={setBiddingAmount}/>
                                                                        <Button variant='subtle'
                                                                                loading={sendMutation.isLoading}
                                                                                onClick={() => sendMutation.mutate({
                                                                                    msg: `New offer from ${auth.user?.firstName ?? ''}`,
                                                                                    to: chat!.toUserId!,
                                                                                    senderId: user.userId!,
                                                                                    isBid: true,
                                                                                    biddingPrice: biddingAmount,
                                                                                })}>
                                                                            Start Bidding
                                                                        </Button>
                                                                    </div>
                                                                })}>
                                       Start Bidding
                                   </Button>
                               }
                               <Button variant='subtle' disabled={!text} loading={sendMutation.isLoading}
                                       onClick={() => sendMutation.mutate({
                                           msg: text,
                                           to: chat!.toUserId!,
                                           senderId: user.userId!,
                                       })}>
                                   <IconSend/>
                               </Button>
                           </div>
                       }/>
            </div>
        </div>
    );
}

export default Index;