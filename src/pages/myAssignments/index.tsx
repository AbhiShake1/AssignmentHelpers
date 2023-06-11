import React, {useState} from "react";
import {api} from "~/utils/api";
import AssignmentPost from "~/components/AssignmentPost";
import AppDialog from "~/components/AppDialog";
import PostAssignmentModal from "~/components/PostAssignmentModal";
import {toast} from "react-hot-toast";
import {useQueryClient} from "@tanstack/react-query";
import type {Assignment, User} from "@prisma/client";
import {Button} from "@mui/material";
import Sheet from "@mui/joy/Sheet";
import ModalClose from "@mui/joy/ModalClose";
import Typography from "@mui/joy/Typography";
import Modal from "@mui/joy/Modal";

type AssignmentWithUser = Assignment & { postedBy: User }

export default function Index() {
    const client = useQueryClient()
    api.assignment.getMy.useQuery({limit: 20, skip: 0}, {
        onSuccess: data => client.setQueryData(['assignment'], data)
    })
    const [open, setOpen] = useState(false)

    return (
        <div className="flex flex-col items-center justify-between py-6 px-12">
            <Button variant='contained' size='large' onClick={() => setOpen(true)}>Post an assignment</Button>
            <div className="m-8 p-8 grid w-full grid-rows-2 grid-flow-col gap-4 auto-cols-auto">
                {
                    client.getQueryData<AssignmentWithUser[]>(['assignment'])?.map((assignment, index) => (
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