import React, {type FunctionComponent} from "react";
import type {Message} from "@prisma/client";
import {useAuth} from "@clerk/nextjs";
import {IconCheck, IconX} from "@tabler/icons-react";
import {api} from "~/utils/api";

interface Props {
    message: Message
}

const BidIcons: FunctionComponent<Props> = ({message}) => {
    const {biddingPrice, id} = message
    const bidMutation = api.chat.updateBid.useMutation()

    return <div className='flex flex-row space-x-2'>
        <button onClick={() => bidMutation.mutate({
            id,
            isBidAccepted: true,
        })}
                className='flex flex-row space-x-2 p-2 text-white bg-green-600 rounded-md hover:bg-green-900 transition'>
            <IconCheck size="1rem"/>
            <h4>{biddingPrice}</h4>
        </button>
        <button onClick={() => bidMutation.mutate({
            id,
            isBidRejected: true,
        })}
                className='flex flex-row space-x-2 p-2 text-red-600 hover:text-red-900 border border-red-600 rounded-md hover:border-red-900 transition'>
            <IconX size="1rem"/>
        </button>
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