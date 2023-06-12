import {createTRPCRouter, protectedProcedure} from "~/server/api/trpc";
import {Events} from "~/const/events";
import {z} from "zod";

export const chatRouter = createTRPCRouter({
    send: protectedProcedure
        .input(z.object({msg: z.string().nonempty(), to: z.string().optional()}))
        .mutation(async ({ctx, input}) => {
            const uid = ctx.auth!.userId!
            const chat = await ctx.prisma.chat.upsert({
                where: {
                    fromUserId_toUserId: {
                        fromUserId: uid,
                        toUserId: input.to || '',
                    }
                },
                create: {
                    fromUserId: uid,
                    toUserId: input.to || '',
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
            await ctx.pusher.trigger(`${chat.fromUserId}-${chat.toUserId || ''}`, Events.SEND_MESSAGE, message);
            return input.msg;
        }),
    supportChats: protectedProcedure.query(({ctx}) => {
        return ctx.prisma.chat.findMany({
            where: {
                toUserId: '',
            },
            include: {
                fromUser: true,
                messages: true,
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

