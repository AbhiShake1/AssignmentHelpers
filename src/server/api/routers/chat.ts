import {createTRPCRouter, protectedProcedure} from "~/server/api/trpc";
import {Events} from "~/const/events";
import {z} from "zod";
import type {Message} from "@prisma/client"

export const chatRouter = createTRPCRouter({
    sendAdmin: protectedProcedure
        .input(z.object({msg: z.string().nonempty()}))
        .mutation(async ({ctx, input}) => {
            const uid = ctx.auth!.userId!
            const chat = await ctx.prisma.chat.upsert({
                where: {
                    fromUserId_toUserId: {
                        fromUserId: uid,
                        toUserId: '',
                    }
                },
                create: {
                    fromUserId: uid,
                    toUserId: '',
                    messages: {
                        create: {
                            senderId: uid,
                            text: input.msg,
                        },
                    },
                },
                update: {
                    messages: {
                        create: {
                            senderId: uid,
                            text: input.msg,
                        },
                    },
                },
                include: {
                    messages: {
                        orderBy: {createdAt: 'desc'},
                        take: 1,
                    },
                },
            })
            const message = chat.messages.at(0)!
            await ctx.pusher.trigger(ctx.auth!.userId!, Events.SEND_MESSAGE, message);
            return input.msg;
        }),
    supportChats: protectedProcedure.query(({ctx})=>{
        return ctx.prisma.chat.findMany({
            where: {
                toUserId: '',
            },
            include: {
                fromUser: true,
            }
        })
    }),
    getWithAdmin: protectedProcedure.query(({ctx}) => {
        return ctx.prisma.chat.findFirst({
            where: {
                fromUserId: ctx.auth!.userId!,
                toUserId: '',
            },
            include: {
                messages: {
                    orderBy: {createdAt: 'desc'}
                },
            },
        })
    })
});

