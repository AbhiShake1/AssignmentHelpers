import {UploadDropzone} from "@uploadthing/react";

import type {UploadAssignmentRouter} from "~/server/api/routers/uploadAssignment";
import {toast} from "react-hot-toast";
import React, {useState} from "react";
import Image from "next/image";
import {Input} from "@mui/joy";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import {DatePicker} from "@mui/x-date-pickers";
import {Button} from "@mui/joy";
import {api} from "~/utils/api";

export default function PostAssignmentModal() {
    const [urls, setUrls] = useState<string[]>([])
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState<string | undefined>()
    const [budget, setBudget] = useState('')
    const [deadline, setDeadline] = useState<Date | undefined>()

    const createAssignmentMutation = api.assignment.create.useMutation()

    const onClick = () => {
        if (!title) return toast.error('Title is required')
        if (!budget) return toast.error('Budget is required')
        if (!description) return toast.error('Deadline is required')
        void createAssignmentMutation.mutate({
            budget: budget,
            title: title,
            description: description || undefined,
            deadline: deadline!,
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
                            <DatePicker label='Deadline' disablePast onAccept={d => setDeadline(new Date(d.$d))}/>
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
                                /> : <div className='flex flex-row space-x-4'>
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
                        <Button className='mt-8' type='submit' loading>Post</Button>
                    </FormControl>
                </form>
            </div>
        </div>
    );
}
