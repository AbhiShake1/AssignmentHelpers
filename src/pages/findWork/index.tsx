import React from 'react';
import {api} from "~/utils/api";
import AssignmentPost from "~/components/AssignmentPost";

function Index() {
    const assignmentQuery = api.assignment.getAll.useInfiniteQuery({
        limit: 10,
    })
    return (
        <div className='p-16'>
            <AssignmentPost/>
        </div>
    );
}

export default Index;