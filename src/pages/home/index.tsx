import React, {useState} from 'react';
import {api} from "~/utils/api";

function Index() {
    const [counter, setCounter] = useState(0)
    api.assignment.randomNumber.useSubscription(undefined, {onData: data => setCounter(data)})
    const randomMutation = api.assignment.randomize.useMutation()
    return (
        <div className='flex flex-col'>
        </div>
    );
}

export default Index;