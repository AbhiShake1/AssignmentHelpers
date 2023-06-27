import { generateReactHelpers } from "@uploadthing/react/hooks";
import type {UploadAssignmentRouter} from "~/server/api/routers/uploadAssignment";

export const { useUploadThing, uploadFiles } =
    generateReactHelpers<UploadAssignmentRouter>();