import {createTRPCRouter} from "~/server/api/trpc";
import {assignmentRouter} from "~/server/api/routers/assignment";
import {userRouter} from "~/server/api/routers/user";
import {referralRouter} from "~/server/api/routers/referral";
import {chatRouter} from "~/server/api/routers/chat";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
    assignment: assignmentRouter,
    user: userRouter,
    referral: referralRouter,
    chat: chatRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
