import {authMiddleware} from "@clerk/nextjs";
import {clerkClient} from "@clerk/clerk-sdk-node";
import {NextResponse} from "next/server";

export default authMiddleware({
    publicRoutes: ["/"],
    afterAuth: async (auth, req, evt) => {
        const user = await clerkClient.users.getUser(auth.userId!)
        const phone = user.unsafeMetadata.phone
        if (!phone)
            return NextResponse.rewrite(new URL('/register', req.url))
        else if (req.url.includes('register'))
            return NextResponse.redirect(new URL('/', req.url))
    },
});

export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/(api|trpc)(.*)", "/register((?!.*\\..*|_next).*)"],
};