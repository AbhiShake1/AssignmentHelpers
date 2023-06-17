import React, {useState} from "react";
import {api} from "~/utils/api";
import AssignmentPost from "~/components/AssignmentPost";
import PostAssignmentModal from "~/components/PostAssignmentModal";
import {toast} from "react-hot-toast";
import type {Assignment, User} from "@prisma/client";
import {Button,} from '@mantine/core';
import {modals} from "@mantine/modals";

type AssignmentWithUser = Assignment & { postedBy: User }

export default function Index() {
    const [assignments, setAssignments] = useState<AssignmentWithUser[]>([])
    api.assignment.getMy.useQuery({limit: 20, skip: 0}, {
        onSuccess: setAssignments,
    })

    const showDialog = () => modals.open({
        title: 'Post a new assignment',
        centered: true,
        children: (
            <PostAssignmentModal onPost={(assignment) => {
                toast.success('New assignment posted')
                setAssignments(d => [...d, assignment])
                modals.closeAll()
            }}/>
        ),
    })

    return (
        <div className="flex flex-col items-center justify-between py-6 px-12">
            <Button variant='outline' size='xl' onClick={showDialog}>Post an assignment</Button>
            <div className="m-8 p-8 grid w-full grid-rows-6 grid-flow-col gap-4 auto-cols-auto">
                {
                    assignments.map((assignment, index) => (
                        <div key={index}>
                            <AssignmentPost assignment={assignment}/>
                        </div>
                    ))
                }
            </div>
        </div>
    );
}
