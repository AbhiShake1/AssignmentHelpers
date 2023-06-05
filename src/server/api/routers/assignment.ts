import {createTRPCRouter, protectedProcedure} from "~/server/api/trpc";
import {z} from "zod";

interface AssignmentCreateArgs {
    title: string
    description: string
    budget: number
    deadline: Date
    isLocked?: boolean
    postedById?: string
}

export const assignmentRouter = createTRPCRouter({
    getAll: protectedProcedure
        .input(z.object({
            limit: z.number().min(1).max(100),
            cursor: z.number(),
            skip: z.number().optional(),
        }))
        .query(async ({ctx, input}) => {
            const {limit, skip, cursor} = input;

            const assignments = await ctx.prisma.assignment.findMany({
                where: {
                    postedById: ctx.auth!.userId!,
                },
                take: limit + 1,
                skip: skip,
                cursor: cursor ? {id: cursor} : undefined,
            })
            let nextCursor: typeof cursor | undefined = undefined;
            if (assignments.length > limit) {
                const nextItem = assignments.pop(); // return the last item from the array
                nextCursor = nextItem?.id;
            }
            return {
                assignments,
                nextCursor,
            };
        }),
    create: protectedProcedure
        .input(z.custom<AssignmentCreateArgs>())
        .mutation(({ctx, input}) => {
            return ctx.prisma.assignment.create({
                data: {
                    postedById: ctx.auth!.userId!,
                    ...input,
                }
            })
        })
})

