import React from 'react';
import type {Assignment, User} from "@prisma/client";
import type {NextPage} from "next";


interface Props {
    assignment: Assignment & {postedBy: User},
}

const AssignmentPost: NextPage<Props> = ({assignment}) => {
    return (
        <div className='px-8 py-6 bg-white shadow-2xl rounded-lg border border-gray-200 flex flex-col items-center'>
            <h1 className='text-2xl'>{assignment.title} for {assignment.budget}</h1>
            {assignment.postedBy.phone}
        </div>
    );
};

export default AssignmentPost;