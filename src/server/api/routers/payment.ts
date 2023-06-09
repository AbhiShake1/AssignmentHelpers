import {createTRPCRouter, protectedProcedure} from "~/server/api/trpc";
import type {Prisma} from '@prisma/client'
import {z} from "zod";

export const paymentRouter = createTRPCRouter({
    create: protectedProcedure
        .input(z.custom<Prisma.PaymentCreateArgs>())
        .mutation(async ({ctx, input}) => {
            await ctx.prisma.payment.create(input)
        }),
    getAll: protectedProcedure.query(({ctx}) => ctx.prisma.payment.findMany({
        include: {payer: true, bidder: true}
    })),
    update: protectedProcedure.input(z.custom<Prisma.PaymentUpdateArgs>()).mutation(({ctx, input}) => {
        return ctx.prisma.payment.update(input)
    }),
})