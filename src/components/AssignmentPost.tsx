import React from 'react';
import type {Assignment, User} from "@prisma/client";
import type {NextPage} from "next";
import {TimerTwoTone} from "@mui/icons-material";
import Image from "next/image";


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
                <div className='flex flex-col space-y-4'>
                    <h1 className='text-gray-500'>Attachments:</h1>
                    {
                        assignment.files.split(',').map((url, index) => (
                            <div className='shadow-2xl rounded-lg flex flex-row justify-center' key={index}>
                                <Image src={url} alt={`${index} file`} width={64} height={64}/>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    );
};

export default AssignmentPost;