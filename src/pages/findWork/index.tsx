import React, {useState} from "react";
import {Button} from "@mui/material";
import {api} from "~/utils/api";
import AssignmentPost from "~/components/AssignmentPost";
import AppDialog from "~/components/AppDialog";
import PostAssignmentModal from "~/pages/findWork/@modal/PostAssignmentModal";
import {toast} from "react-hot-toast";
import {useQueryClient} from "@tanstack/react-query";
import {Assignment} from "@prisma/client";

export default function Index() {
    const client = useQueryClient()
    api.assignment.getAll.useQuery({limit: 20, skip: 0}, {
        onSuccess: data => client.setQueryData(['assignment'], data)
    })
    const [open, setOpen] = useState(false)

    return (
        <div className="flex flex-col items-center justify-between py-6 px-12">
            <Button variant='contained' onClick={() => setOpen(true)}>Post an assignment</Button>
            <div className='mt-12 grid grid-flow-col auto-cols-auto gap-16'>
                {
                    client.getQueryData<Assignment[]>(['assignment'])?.map((assignment, index) => (
                        <div key={index}>
                            <AssignmentPost assignment={assignment}/>
                        </div>
                    ))
                }
            </div>
            <AppDialog open={open} setOpen={setOpen} title='Post new assignment'>
                <PostAssignmentModal onPost={(assignment) => {
                    toast.success('New assignment posted')
                    client.setQueryData<Assignment[]>(['assignment'], d => !d ? d : [...d, assignment])
                    setOpen(false)
                }}/>
            </AppDialog>
        </div>
    );
}
