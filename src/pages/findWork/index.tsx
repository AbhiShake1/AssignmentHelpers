import React, {useState} from "react";
import {Button} from "@mui/material";
import {api} from "~/utils/api";
import AssignmentPost from "~/components/AssignmentPost";
import AppDialog from "~/components/AppDialog";
import PostAssignmentModal from "~/pages/findWork/@modal/PostAssignmentModal";

export default function Index() {
    const assignmentsQuery = api.assignment.getAll.useInfiniteQuery({limit: 20}, {getNextPageParam: l => l.nextCursor})
    const [open, setOpen] = useState(false)

    return (
        <div className="flex flex-col items-center justify-between py-6 px-12">
            <Button variant='contained' onClick={() => setOpen(true)}>Post an assignment</Button>
            <div className='mt-12 grid grid-flow-col auto-cols-auto gap-16'>
                {
                    assignmentsQuery.data?.pages?.flatMap(p => p.assignments).map((assignment, index) => (
                        <div key={index}>
                            <AssignmentPost assignment={assignment}/>
                        </div>
                    ))
                }
            </div>
            <AppDialog open={open} setOpen={setOpen} title='Post new assignment'>
                <PostAssignmentModal/>
            </AppDialog>
        </div>
    );
}
