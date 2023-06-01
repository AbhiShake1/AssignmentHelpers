import {createTRPCRouter, publicProcedure} from "~/server/api/trpc";
import {observable} from "@trpc/server/observable";
import {Events} from "~/server/constants/events";
import {EventEmitter} from "events";

const ee = new EventEmitter({captureRejections: true})

export const assignmentRouter = createTRPCRouter({
    randomNumber: publicProcedure
        .subscription(({ctx}) => {
            return observable<number>((emit) => {
                ee.on(Events.SEND_MESSAGE, (args: number) => {
                    console.log(args)
                    return emit.next(args)
                })
                return () => {
                    ee.off(Events.SEND_MESSAGE, emit.next)
                }
            });
        }),
    randomize: publicProcedure.mutation(({ctx}) => {
        const random = Math.random()
        ee.emit(Events.SEND_MESSAGE, random)
        return random
    })
})

