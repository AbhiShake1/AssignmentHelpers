import {createTRPCRouter, protectedProcedure} from "~/server/api/trpc";
import {z} from "zod";
import {Events} from "~/const/events";

export const chatRouter = createTRPCRouter({
    send: protectedProcedure
        .input(z.object({
            msg: z.string().nonempty(),
            fromAdmin: z.boolean().default(false),
            to: z.string().optional(),
            senderId: z.string().optional()
        }))
        .mutation(async ({ctx, input}) => {
            const uid = ctx.auth!.userId!
            const chat = await ctx.prisma.chat.upsert({
                where: {
                    fromUserId_toUserId: {
                        fromUserId: uid,
                        toUserId: input.fromAdmin ? '' : input.to || '',
                    }
                },
                create: {
                    fromUserId: uid,
                    toUserId: input.fromAdmin ? '' : input.to || '',
                    messages: {
                        create: {
                            senderId: input.senderId || uid,
                            text: input.msg,
                        },
                    },
                },
                update: {
                    messages: {
                        create: {
                            senderId: input.senderId || uid,
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
            return message;
        }),
    supportChats: protectedProcedure.query(({ctx}) => {
        return ctx.prisma.chat.findMany({
            where: {
                toUserId: '',
            },
            include: {
                fromUser: true,
                messages: {
                    orderBy: {createdAt: 'desc'}
                },
            },
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

