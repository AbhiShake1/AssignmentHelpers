import {createTRPCRouter, protectedProcedure} from "~/server/api/trpc";
import {Events} from "~/const/events";
import {z} from "zod";
import {Message} from "@prisma/client"

export const chatRouter = createTRPCRouter({
    sendAdmin: protectedProcedure
        .input(z.object({msg: z.string().nonempty()}))
        .mutation(async ({ctx, input}) => {
            const chat = await ctx.prisma.chat.upsert({
                where: {
                    fromUserId_toUserId: {
                        fromUserId: ctx.auth!.userId!,
                        toUserId: '',
                    }
                },
                create: {
                    fromUserId: ctx.auth!.userId!,
                    toUserId: '',
                    messages: {
                        create: {
                            senderId: ctx.auth!.userId!,
                            text: input.msg,
                        },
                    },
                },
                update: {
                    messages: {
                        create: {
                            senderId: ctx.auth!.userId!,
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
            const message = (chat.messages as Message[]).at(0)!
            await ctx.pusher.trigger(ctx.auth!.userId!, Events.SEND_MESSAGE, message);
            return input.msg;
        }),
    getWithAdmin: protectedProcedure.query(({ctx})=>{
        return ctx.prisma.chat.findFirst({
            where: {
                fromUserId: ctx.auth!.userId!,
                toUserId: '',
            },
            include: {
                messages: true,
            }
        })
    })
});

