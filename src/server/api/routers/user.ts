import {createTRPCRouter, protectedProcedure} from "~/server/api/trpc";
import {z} from "zod";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {clerkClient, type User} from "@clerk/clerk-sdk-node";


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
    getUser: protectedProcedure
        .query(({ctx}) => {
            return ctx.auth
        }),
    getAll: protectedProcedure.query(({ctx})=>{
        return ctx.prisma.user.findMany();
    }),
    getClerkUser: protectedProcedure
        .input(z.object({userId: z.string()}))
        .output(z.custom<User>())
        .query(({input}) => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-return
            return clerkClient.users.getUser(input.userId)
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

