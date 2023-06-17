import {createTRPCRouter, protectedProcedure} from "~/server/api/trpc";
import {z} from "zod";
import {clerkClient} from "@clerk/clerk-sdk-node";

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

            const id = ctx.auth!.userId!

            const user = await clerkClient.users.getUser(id)

            const res = await ctx.prisma.assignment.findMany({
                where: {
                    deadline: {
                        gt: new Date(),
                    },
                    postedById: id,
                },
                include: {
                    postedBy: true,
                },
                take: limit + 1,
                skip: skip,
            })

            return res.map(r => ({
                ...r,
                postedBy: {...user},
            }))
        }),
    getMy: protectedProcedure
        .input(z.object({
            limit: z.number().min(1).max(100),
            skip: z.number().optional(),
        }))
        .query(({ctx, input}) => {
            const {limit, skip} = input;

            const id = ctx.auth!.userId!

            return ctx.prisma.assignment.findMany({
                where: {
                    postedById: id,
                },
                include: {
                    postedBy: false,
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
                }
            })
        })
})