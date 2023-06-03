import React from 'react';
import {api} from "~/utils/api";

function Index() {
    const assignmentQuery = api.assignment.getAll.useInfiniteQuery({
        limit: 10,
    })
    return (
        <>
            type
        </>
    );
}

export default Index;