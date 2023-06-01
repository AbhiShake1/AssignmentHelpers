import {authMiddleware} from "@clerk/nextjs";

export default authMiddleware({
    publicRoutes: ["/", "/onboarding"]
});

export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};