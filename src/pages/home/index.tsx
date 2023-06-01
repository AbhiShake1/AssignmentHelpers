import React, {useState} from 'react';
import {api} from "~/utils/api";

function Index() {
    const [counter, setCounter] = useState(0)
    api.assignment.randomNumber.useSubscription(undefined, {onData: data => setCounter(data)})
    const randomMutation = api.assignment.randomize.useMutation()
    return (
        <div className='flex flex-col'>
            {Array(100).fill(0).map((e, i)=>(<button key={i}>{counter}</button>))}
            <button className='p-12 text-2xl' onClick={() => randomMutation.mutate()}>mutate</button>
        </div>
    );
}

export default Index;