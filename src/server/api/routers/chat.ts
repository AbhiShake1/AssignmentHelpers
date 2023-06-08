import {createTRPCRouter, protectedProcedure, publicProcedure} from "~/server/api/trpc";
import {observable} from "@trpc/server/observable";
import {Events} from "~/server/constants/events";
import {z} from "zod";


export const chatRouter = createTRPCRouter({
    listen: publicProcedure
        .subscription(({ctx}) => {
            return observable<string, string>((emit) => {
                const onMsg = (data: string) => emit.next(data)
                ctx.emitter.on(Events.SEND_MESSAGE, onMsg)

                return () => {
                    ctx.emitter.off(Events.SEND_MESSAGE, emit.next)
                };
            });
        }),
    send: protectedProcedure
        .input(z.object({msg: z.string().nonempty()}))
        .mutation(({ctx, input}) => {
            ctx.emitter.emit(Events.SEND_MESSAGE, input.msg);
            return input.msg;
        }),
});

