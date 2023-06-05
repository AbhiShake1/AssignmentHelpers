import {createTRPCRouter, protectedProcedure} from "~/server/api/trpc";
import {getBaseUrl} from "~/utils/api";

export const referralRouter = createTRPCRouter({
    link: protectedProcedure
        .query(({ctx}) => {
            return `${getBaseUrl()}/?referrer=${ctx.auth!.userId!}`
        }),
})

