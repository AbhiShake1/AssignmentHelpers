import React, {type FunctionComponent} from "react";
import type {Message} from "@prisma/client";
import {useAuth} from "@clerk/nextjs";

interface Props {
    message: Message
}

const ChatBubble: FunctionComponent<Props> = ({message}) => {
    const user = useAuth()

    return <div key={message.id} className='flex flex-col-reverse'>
        {
            message.senderId != user.userId ? <div className='flex flex-row mb-1'>
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
}

export default ChatBubble;