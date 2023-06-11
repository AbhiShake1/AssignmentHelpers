import {authMiddleware} from "@clerk/nextjs";

export default authMiddleware({
    publicRoutes: ["/"],
    afterAuth: (auth, req, evt) => {
        console.log(evt.sourcePage)
    },
});

export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/(api|trpc)(.*)"],
};