import {createTRPCRouter, protectedProcedure} from "~/server/api/trpc";
import {z} from "zod";

interface AssignmentCreateArgs {
    title: string
    description?: string
    budget: string
    deadline: Date
    files: string
}

export const assignmentRouter = createTRPCRouter({
    getAll: protectedProcedure
        .input(z.object({
            limit: z.number().min(1).max(100),
            skip: z.number().optional(),
        }))
        .query(async ({ctx, input}) => {
            const {limit, skip} = input;

            return await ctx.prisma.assignment.findMany({
                where: {
                    deadline: {
                        gt: new Date(),
                    }
                },
                include: {
                    postedBy: true,
                },
                take: limit + 1,
                skip: skip,
            })
        }),
    getMy: protectedProcedure
        .input(z.object({
            limit: z.number().min(1).max(100),
            skip: z.number().optional(),
        }))
        .query(async ({ctx, input}) => {
            const {limit, skip} = input;

            return await ctx.prisma.assignment.findMany({
                where: {
                    postedById: ctx.auth!.userId!,
                },
                include: {
                    postedBy: true,
                },
                take: limit + 1,
                skip: skip,
            })
        }),
    create: protectedProcedure
        .input(z.custom<AssignmentCreateArgs>())
        .mutation(({ctx, input}) => {
            return ctx.prisma.assignment.create({
                data: {
                    ...input,
                    postedBy: {
                        connect: {
                            id: ctx.auth!.userId!,
                        },
                    }
                },
                include: {
                    postedBy: true,
                }
            })
        })
})