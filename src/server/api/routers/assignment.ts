import {createTRPCRouter, protectedProcedure} from "~/server/api/trpc";
import type {Assignment} from "@prisma/client"
import {z} from "zod";

export const assignmentRouter = createTRPCRouter({
    getAll: protectedProcedure
        .input(z.object({
            limit: z.number().min(1).max(100).nullish(),
            cursor: z.number().nullish(), // <-- "cursor" needs to exist, but can be any type
        }))
        .output(z.custom<Assignment[]>())
        .query(({ctx, input}) => {
            return ctx.prisma.assignment.findMany()
        }),
})

