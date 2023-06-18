import React from 'react';
import type {NextPage} from "next";

interface Props {
    assignmentId: number
}

const AssignmentId: NextPage<Props> = ({assignmentId}) => (
    <div>
        {assignmentId}
    </div>
);

export default AssignmentId;