// import {create} from 'zustand'
// import Pusher from "pusher";
//
// interface PusherState {
//     pusher: Pusher,
//     subscribe: (channel: string) => void,
// }
//
// const pusher = new Pusher({
//     appId: process.env.PUSHER_APP_ID!,
//     key: process.env.PUSHER_KEY!,
//     secret: process.env.PUSHER_SECRET!,
//     cluster: process.env.PUSHER_CLUSTER!,
// })
//
// const usePusher = create<PusherState>()((set, get) => ({
//     pusher,
//     subscribe: (channel) => {
//         get().pusher
//     },
// }))
//
// export default usePusher

import Pusher from "pusher-js";

const pusher = new Pusher('f28c4f758a97121475ac', {
    cluster: 'ap2',
})

export default pusher
