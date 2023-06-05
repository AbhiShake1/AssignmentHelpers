import {createUploadthing, type FileRouter} from "uploadthing/next-legacy";

const f = createUploadthing();


export const uploadAssignmentRouter = {
    imageUploader: f({image: {maxFileSize: "64MB", maxFileCount: 5}})
        .onUploadComplete(({file}) => {
            console.log("file url", file.url);
        }),
} satisfies FileRouter;

export type UploadAssignmentRouter = typeof uploadAssignmentRouter;