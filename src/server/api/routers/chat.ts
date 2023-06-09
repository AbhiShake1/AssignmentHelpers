import {createTRPCRouter, protectedProcedure} from "~/server/api/trpc";
import {Events} from "~/const/events";
import {z} from "zod";
import {Channels} from "~/const/channels";

export const chatRouter = createTRPCRouter({
    send: protectedProcedure
        .input(z.object({msg: z.string().nonempty()}))
        .mutation(async ({ctx, input}) => {
            const msg = await ctx.prisma.chat.upsert({
                where: {
                    id: 0,
                },
                create: {
                    participants: {
                        connect: [{
                            id: ctx.auth!.userId!,
                        }],
                    },
                    messages: {
                        create: {
                            senderId: ctx.auth!.userId!,
                            assignmentId: null,
                            text: input.msg,
                        },
                    },
                    assignmentId: 0,
                },
                update: {
                    messages: {
                        create: {
                            senderId: ctx.auth!.userId!,
                            assignmentId: null,
                            text: input.msg,
                        },
                    },
                    participants: {
                        connect: [{
                            id: ctx.auth!.userId!,
                        }],
                    },
                },
            })
            await ctx.pusher.trigger(Channels.DEFAULT_CHAT_CHANNEL, Events.SEND_MESSAGE, {
                message: input.msg
            });
            return input.msg;
        }),
});

