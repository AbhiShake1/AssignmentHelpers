import {UploadDropzone} from "@uploadthing/react";

import type {UploadAssignmentRouter} from "~/server/api/routers/uploadAssignment";
import {toast} from "react-hot-toast";
import React, {useState} from "react";
import Image from "next/image";
import AssignmentPost from "~/components/AssignmentPost";

export default function Index() {
    const [urls, setUrls] = useState<string[]>([])

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className=''>
                <AssignmentPost/>
                {
                    urls.length == 0 ? <UploadDropzone<UploadAssignmentRouter>
                        endpoint="imageUploader"
                        onClientUploadComplete={(res) => {
                            if (res)
                                setUrls(res.map(r => r.fileUrl))
                        }}
                        onUploadError={(error: Error) => {
                            toast.error(error.message)
                        }}
                    /> : <div className='flex flex-row space-x-4'>
                        {
                            urls.map((url, index)=>(
                                <div className='shadow-2xl rounded-lg' key={index}>
                                    <Image src={url} alt={`${index} file`} width={64} height={64}/>
                                </div>
                            ))
                        }
                    </div>
                }
            </div>
        </main>
    );
}
