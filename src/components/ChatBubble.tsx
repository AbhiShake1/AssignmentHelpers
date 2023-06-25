import React, {type FunctionComponent, useState} from "react";
import type {Message, Chat} from "@prisma/client";
import {useAuth} from "@clerk/nextjs";
import {IconCheck, IconX} from "@tabler/icons-react";
import {api} from "~/utils/api";
import {toast} from "react-hot-toast";

interface Props {
    message: Message
}

const BidIcons: FunctionComponent<Props> = ({message}) => {
    const {biddingPrice, id, isBidAccepted, isBidRejected} = message
    const [bidAccepted, setBidAccepted] = useState(isBidAccepted)
    const [bidRejected, setBidRejected] = useState(isBidRejected)
    const bidMutation = api.chat.updateBid.useMutation({
        onSuccess: data => {
            if (data.isBidAccepted) {
                setBidAccepted(true)
                toast.success('The bid was accepted')
            }
            if (data.isBidRejected) {
                setBidRejected(true)
                toast.success('The bid was rejected')
            }
        },
        onError: err => toast.error(err.message)
    })
    const disabled = bidAccepted || bidRejected

    return <div className='flex flex-col space-y-2'>
        <div className='flex flex-row space-x-2'>
            <button disabled={disabled} onClick={() => bidMutation.mutate({
                id,
                isBidAccepted: true,
                biddingFor: biddingPrice || 0,
            })}
                    className='flex flex-row space-x-2 p-2 text-white rounded-md transition disabled:bg-green-800 bg-green-600 hover:bg-green-900'>
                <IconCheck size="1rem"/>
                <h4>{biddingPrice}</h4>
            </button>
            <button disabled={disabled} onClick={() => bidMutation.mutate({
                id,
                isBidRejected: true,
                biddingFor: biddingPrice || 0,
            })}
                    className='flex flex-row space-x-2 p-2 text-red-600 hover:text-red-900 border border-red-600 rounded-md hover:border-red-900 disabled:text-red-400 disabled:border-red-400 transition'>
                <IconX size="1rem"/>
            </button>
        </div>
        {bidAccepted && <h3>The bid was accepted</h3>}
        {bidRejected && <h3>The bid was rejected</h3>}
    </div>
}

const ChatBubble: FunctionComponent<Props> = ({message}) => {
    const {userId} = useAuth()
    const {senderId, isBid, text} = message

    return <div key={message.id} className='flex flex-col-reverse'>
        {
            senderId != userId ? <div className='flex flex-row mb-1'>
                    <div
                        className='py-2 px-4 bg-blue-300 max-w-xl rounded-b-3xl rounded-tr-3xl'>
                        <h4>{text}</h4>
                        {isBid && <BidIcons message={message}/>}
                    </div>
                    <div className='w-full'/>
                </div> :
                <div className='flex flex-row mb-1'>
                    <div className='w-full'/>
                    <div
                        className='py-2 px-4 bg-blue-300 max-w-xl rounded-t-3xl rounded-bl-3xl'>
                        <div className='flex flex-col space-y-1'>
                            <h4>{text}</h4>
                            {isBid && <BidIcons message={message}/>}
                        </div>
                    </div>
                </div>
        }
    </div>
}

export default ChatBubble;