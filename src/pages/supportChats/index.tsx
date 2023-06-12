import React from 'react';
import {api} from "~/utils/api";

function Index() {
    const chats = api.chat.supportChats.useQuery()
    return (
        <div className='p-8'>
            {JSON.stringify(chats.data)}
        </div>
    );
}

export default Index;