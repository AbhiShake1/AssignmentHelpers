import React from "react";
import {api} from "~/utils/api";
import AssignmentPost from "~/components/AssignmentPost";
import {Loader} from "@mantine/core";

export default function Index() {
    const query = api.assignment.getAll.useQuery({limit: 20, skip: 0})

    if (!query.isSuccess) return <center><Loader/></center>

    return (
        <div className="flex flex-col items-center justify-between py-6 px-12">
            <div className="m-8 p-8 grid w-full grid-rows-6 grid-flow-col gap-4 auto-cols-auto">
                {
                    query.data?.map((assignment, index) => (
                        <div key={index}>
                            <AssignmentPost assignment={assignment}/>
                        </div>
                    ))
                }
            </div>
        </div>
    );
}
