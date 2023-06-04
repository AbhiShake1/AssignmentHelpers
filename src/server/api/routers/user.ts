import {createTRPCRouter, protectedProcedure} from "~/server/api/trpc";
import {z} from "zod";

type AccountType = 'personal' | 'professional'

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
    accountType: AccountType
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
            const data = {
                id: input.id,
                name: input.name,
                email: input.email,
                skills: input.skills.join(',').toString(),
                specialization: input.specialization,
                education: input.education || undefined,
                phone: input.phone,
                accountType: input.accountType,
            }
            if (!referrer) {
                await ctx.prisma.user.create({
                    data: data
                })
            } else {
                await ctx.prisma.user.create({
                    data: {
                        ...data,
                        referredBy: {
                            connect: {
                                id: referrer?.id || undefined,
                            }
                        },
                    }
                })
            }
        })
})

