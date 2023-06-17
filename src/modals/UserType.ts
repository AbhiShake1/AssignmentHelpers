import {type User} from "@prisma/client";

type AccountType = 'personal' | 'professional'

export type UserType = {
    id: string
    name: string
    email: string
    referredById: string | null
    skills: string
    specialization: string
    education: string | null
    phone: string
    isAdmin: string
    accountType: AccountType
    imageUrl: string | undefined
}