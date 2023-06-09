import {createTRPCRouter, protectedProcedure, publicProcedure} from "~/server/api/trpc";
import {observable} from "@trpc/server/observable";
import {Events} from "~/server/constants/events";
import {z} from "zod";
import {EventEmitter} from "node:events";

const ee = new EventEmitter()

export const chatRouter = createTRPCRouter({
    listen: publicProcedure
        .subscription(({ctx}) => {
            return observable<string, string>((emit) => {
                const onMsg = (data: string) => emit.next(data)
                ee.on(Events.SEND_MESSAGE, onMsg)
                console.log(ee.eventNames())

                return () => ee.off(Events.SEND_MESSAGE, onMsg)
            })
        }),
    send: protectedProcedure
        .input(z.object({msg: z.string().nonempty()}))
        .mutation(async ({ctx, input}) => {
            await ctx.pusher.trigger("my-channel", Events.SEND_MESSAGE, input.msg);
            ee.emit(Events.SEND_MESSAGE, input.msg);
            console.log(ee.eventNames())
            return input.msg;
        }),
});

