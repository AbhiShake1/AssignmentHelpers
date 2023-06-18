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
    chat: protectedProcedure
        .input(z.object({assignmentId: z.number().positive(), from: z.string().optional()}))
        .query(async ({ctx, input}) => {
            const assignment = await ctx.prisma.assignment.findFirstOrThrow({
                where: {id: input.assignmentId},
                include: {postedBy: true}
            })
            const fromUserId = input.from || ctx.auth!.userId!
            const toUserId = assignment.postedById
            return ctx.prisma.chat.upsert({
                create: {
                    fromUserId: fromUserId,
                    toUserId: toUserId,
                    assignmentId: input.assignmentId,
                },
                update: {},
                include: {
                    assignment: true,
                    messages: {
                        orderBy: {createdAt: 'desc'}
                    },
                },
                where: {
                    fromUserId_toUserId: {
                        fromUserId: fromUserId,
                        toUserId: toUserId,
                    },
                }
            })
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

