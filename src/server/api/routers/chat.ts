import {createTRPCRouter, protectedProcedure} from "~/server/api/trpc";
import {z} from "zod";
import {Events} from "~/const/events";
import {TRPCError} from "@trpc/server";

export const chatRouter = createTRPCRouter({
    send: protectedProcedure
        .input(z.object({
            msg: z.string().nonempty(),
            fromAdmin: z.boolean().default(false),
            to: z.string().optional(),
            senderId: z.string().optional(),
            isBid: z.boolean().default(false),
            isBidAccepted: z.boolean().default(false),
            isBidRejected: z.boolean().default(false),
            biddingPrice: z.number().nullish(),
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
                            isBid: input.isBid,
                            isBidAccepted: input.isBidAccepted,
                            isBidRejected: input.isBidRejected,
                            biddingPrice: input.biddingPrice,
                        },
                    },
                },
                update: {
                    messages: {
                        create: {
                            senderId: input.senderId || uid,
                            text: input.msg,
                            isBid: input.isBid,
                            isBidAccepted: input.isBidAccepted,
                            isBidRejected: input.isBidRejected,
                            biddingPrice: input.biddingPrice,
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
            try {
                await ctx.pusher.trigger(`${chat.fromUserId || ''}-${chat.toUserId || ''}`, Events.SEND_MESSAGE, message);
            } catch (_) {
            }
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
                    fromUser: true,
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
    assignmentChats: protectedProcedure
        .input(z.number().positive().int())
        .query(({ctx, input}) => {
            return ctx.prisma.chat.findMany({
                where: {
                    assignmentId: input,
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
    }),
    uploadAssignment: protectedProcedure
        .input(z.object({urls: z.array(z.string()), chatId: z.number().positive()}))
        .mutation(async ({ctx, input})=>{
            const {chatId, urls} = input
            await ctx.prisma.chat.update({
                where: {
                    id: chatId,
                },
                data: {
                    assignmentUrls: urls.join(','),
                }
            })
        }),
    updateBid: protectedProcedure
        .input(z.object({
            id: z.number().positive(),
            isBidAccepted: z.boolean().default(false),
            isBidRejected: z.boolean().default(false),
            biddingFor: z.number().int(),
        }))
        .mutation(async ({ctx, input}) => {
            const {isBidAccepted, isBidRejected, id, biddingFor} = input
            const msg = await ctx.prisma.message.findFirst({where: {id}})
            if (!msg) {
                throw new TRPCError({message: 'The bid for this chat has already been finalized', code: 'CONFLICT'})
            }
            const chat = await ctx.prisma.chat.findFirst({
                where: {
                    messages: {
                        some: {
                            id,
                        }
                    }
                }
            })
            await ctx.prisma.message.deleteMany({
                where: {
                    chatId: chat!.id,
                    AND: {
                        isBid: true,
                        AND: {
                            id: {
                                not: id,
                            }
                        }
                    },
                }
            })
            await ctx.prisma.chat.update({
                where: {
                    id: chat!.id,
                },
                data: {
                    biddingFor,
                }
            })
            return ctx.prisma.message.update({
                where: {
                    id,
                },
                data: {
                    isBidAccepted,
                    isBidRejected,
                }
            })
        })
});

