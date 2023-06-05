import {createNextPageApiHandler} from "uploadthing/next-legacy";
import {uploadAssignmentRouter} from "~/server/api/routers/uploadAssignment";

const handler = createNextPageApiHandler({
    router: uploadAssignmentRouter,
});

export default handler;