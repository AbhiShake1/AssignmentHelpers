import React from 'react';
import type {Assignment, User} from "@prisma/client";
import type {NextPage} from "next";
import {TimerTwoTone} from "@mui/icons-material";


interface Props {
    assignment: Assignment & { postedBy: User },
}

const AssignmentPost: NextPage<Props> = ({assignment}) => {
    return (
        <div className='px-8 py-6 bg-white shadow-2xl rounded-lg border border-gray-200 flex flex-col items-center'>
            <h1 className='text-2xl'>{assignment.title} for {assignment.budget}</h1>
            <div className='py-4 px-6 w-full flex flex-col space-y-4 items-center'>
                <div className='flex flex-row space-x-2'>
                    <TimerTwoTone className='text-blue-600'/>
                    <div className='text-gray-500'>Deadline:</div>
                    <div>{assignment.deadline.toDateString()}</div>
                </div>
                <div>
                    <h3 className='text-gray-600'>{assignment.description}</h3>
                </div>
            </div>
        </div>
    );
};

export default AssignmentPost;