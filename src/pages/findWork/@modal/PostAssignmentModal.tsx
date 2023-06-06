import {UploadDropzone} from "@uploadthing/react";

import type {UploadAssignmentRouter} from "~/server/api/routers/uploadAssignment";
import {toast} from "react-hot-toast";
import React, {useState} from "react";
import Image from "next/image";
import {Button, Input} from "@mui/joy";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import {DatePicker} from "@mui/x-date-pickers";
import {api} from "~/utils/api";
import type {Assignment} from "@prisma/client";

interface Props {
    onPost: (assignment: Assignment) => void
}

const PostAssignmentModal: React.FC<Props> = ({onPost}) => {
    const [urls, setUrls] = useState<string[]>([])
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState<string | undefined>()
    const [budget, setBudget] = useState('')
    const [deadline, setDeadline] = useState<Date | undefined>()

    const createAssignmentMutation = api.assignment.create.useMutation({
        onSuccess: onPost,
        onError: err => toast.error(err.message)
    })

    const onClick = () => {
        if (!title) return toast.error('Title is required')
        if (!budget) return toast.error('Budget is required')
        if (!deadline) return toast.error('Deadline is required')
        if (urls.length == 0) return toast.error('Please upload files before posting')
        void createAssignmentMutation.mutate({
            budget,
            title,
            description: description || undefined,
            deadline,
            files: urls.join(','),
        })
    }

    return (
        <div className="flex flex-col items-center justify-between p-8">
            <div>
                <form onSubmit={e => {
                    e.preventDefault()
                    onClick()
                }}>
                    <FormControl className='flex flex-col space-y-2'>
                        <div>
                            <FormLabel>Title</FormLabel>
                            <Input placeholder='Title' variant='outlined' onChange={e => setTitle(e.target.value)}/>
                        </div>
                        <div>
                            <FormLabel>Description</FormLabel>
                            <Input placeholder='Description' variant='outlined' onChange={e => {
                                if (e) setDescription(e.target.value)
                            }}/>
                        </div>
                        <div>
                            <FormLabel>Budget</FormLabel>
                            <Input placeholder='Budget' variant='outlined' onChange={e => setBudget(e.target.value)}/>
                        </div>
                        <div>
                            <DatePicker<Date> label='Deadline' disablePast onAccept={d => setDeadline(d!)}/>
                        </div>
                        <div className='pb-8'>
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
                                /> : <div className='flex flex-row space-x-4 justify-center'>
                                    {
                                        urls.map((url, index) => (
                                            <div className='shadow-2xl rounded-lg' key={index}>
                                                <Image src={url} alt={`${index} file`} width={64} height={64}/>
                                            </div>
                                        ))
                                    }
                                </div>
                            }
                        </div>
                        <Button
                            className='mt-8 bg-blue-600 shadow-2xl shadow-blue-600 text-black hover:bg-blue-900 hover:text-white transition duration-200'
                            type='submit' loading={createAssignmentMutation.isLoading}>Post</Button>
                    </FormControl>
                </form>
            </div>
        </div>
    );
}

export default PostAssignmentModal
