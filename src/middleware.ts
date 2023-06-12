import {authMiddleware} from "@clerk/nextjs";
import {clerkClient} from "@clerk/clerk-sdk-node";
import {NextResponse} from "next/server";

export default authMiddleware({
    publicRoutes: ["/"],
    afterAuth: async (auth, req) => {
        const uid = auth.userId
        if(!uid) return NextResponse.redirect(new URL('/', req.url))

        const user = await clerkClient.users.getUser(uid)
        const phone = user.unsafeMetadata.phone
        if (!phone)
            return NextResponse.rewrite(new URL('/register', req.url))
        if (req.url.includes('register'))
            return NextResponse.redirect(new URL('/', req.url))
    },
});

export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/(api|trpc)(.*)", "/register((?!.*\\..*|_next).*)"],
};