import {createTRPCRouter, protectedProcedure} from "~/server/api/trpc";
import {z} from "zod";

interface CreateUserArgs {
    id: string
    phone: string
    name: string
    email: string
    referredBy?: string
    skills: string[]
    qualification?: string
    specialization: string
    education?: string
}

export const userRouter = createTRPCRouter({
    getUser: protectedProcedure.query(({ctx}) => {
        return ctx.auth
    }),
    create: protectedProcedure
        .input(z.custom<CreateUserArgs>())
        .mutation(async ({ctx, input}) => {
            const referrer = !input.referredBy ? undefined : await ctx.prisma.user.findFirst({
                where: {
                    id: input.referredBy,
                }
            })
            await ctx.prisma.user.create({
                data: {
                    id: input.id,
                    name: input.name,
                    email: input.email,
                    referredBy: {
                        connect: {
                            id: referrer?.id || undefined,
                        }
                    },
                    skills: input.skills.join(',').toString(),
                    specialization: input.specialization,
                    education: input.education || undefined,
                    phone: input.phone,
                }
            })
        })
})

