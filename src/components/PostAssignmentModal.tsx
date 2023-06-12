import {toast} from "react-hot-toast";
import React, {useState} from "react";
import {api} from "~/utils/api";
import type {Assignment} from "@prisma/client";
import {Button, Input} from "@mantine/core";
import {DatePicker} from "@mantine/dates";
import {User} from "@prisma/client";

interface Props {
    onPost: (assignment: Assignment & { postedBy: User }) => void
}

const PostAssignmentModal: React.FC<Props> = ({onPost}) => {
    const [urls, setUrls] = useState<string[]>([])
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState<string | undefined>()
    const [budget, setBudget] = useState('')
    const [deadline, setDeadline] = useState<Date | null>(null)

    const createAssignmentMutation = api.assignment.create.useMutation({
        onSuccess: onPost,
        onError: err => toast.error(err.message)
    })

    const onClick = () => {
        if (!title) return toast.error('Title is required')
        if (!budget) return toast.error('Budget is required')
        if (!deadline) return toast.error('Deadline is required')
        // if (urls.length == 0) return toast.error('Please upload files before posting')
        void createAssignmentMutation.mutate({
            budget,
            title,
            description: description || undefined,
            deadline,
            // files: urls.join(','),
            files: '',
        })
    }

    return (
        <div className="flex flex-col items-center justify-between p-8">
            <div>
                <form onSubmit={e => {
                    e.preventDefault()
                    onClick()
                }} className='flex flex-col space-y-4'>
                    <Input.Wrapper label='Title'>
                        <Input placeholder='Title' onChange={e => setTitle(e.target.value)}/>
                    </Input.Wrapper>
                    <Input.Wrapper label='Description'>
                        <Input placeholder='Description' onChange={e => {
                            if (e) setDescription(e.target.value)
                        }}/>
                    </Input.Wrapper>
                    <Input.Wrapper label='Budget'>
                        <Input placeholder='Budget' onChange={e => setBudget(e.target.value)}/>
                    </Input.Wrapper>
                    <Input.Wrapper label='Deadline'>
                        <DatePicker onChange={setDeadline} minDate={new Date()}/>
                    </Input.Wrapper>
                    <div className='pb-8'>
                        {
                            // urls.length == 0 ? <UploadDropzone<UploadAssignmentRouter>
                            //     endpoint="imageUploader"
                            //     onClientUploadComplete={(res) => {
                            //         if (res)
                            //             setUrls(res.map(r => r.fileUrl))
                            //     }}
                            //     onUploadError={(error: Error) => {
                            //         toast.error(error.message)
                            //     }}
                            // /> : <div className='flex flex-row space-x-4 justify-center'>
                            //     {
                            //         urls.map((url, index) => (
                            //             <div className='shadow-2xl rounded-lg' key={index}>
                            //                 <Image src={url} alt={`${index} file`} width={64} height={64}/>
                            //             </div>
                            //         ))
                            //     }
                            // </div>
                        }
                    </div>
                    <Button
                        className='mt-8'
                        variant='outline'
                        type='submit' loading={createAssignmentMutation.isLoading}>Post</Button>
                </form>
            </div>
        </div>
    );
}

export default PostAssignmentModal
