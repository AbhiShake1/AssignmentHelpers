import React from 'react';
import type {Assignment} from "@prisma/client";
import type {NextPage} from "next";


interface Props {
    assignment: Assignment,
}

const AssignmentPost: NextPage<Props> = ({assignment}) => {
    return (
        <div className='px-8 py-6 bg-white shadow-2xl rounded-lg border border-gray-200'>
        </div>
    );
};

export default AssignmentPost;