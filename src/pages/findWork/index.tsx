import React from "react";
import {api} from "~/utils/api";
import AssignmentPost from "~/components/AssignmentPost";
import {useQueryClient} from "@tanstack/react-query";
import type {Assignment, User} from "@prisma/client";

type AssignmentWithUser = Assignment & { postedBy: User }

export default function Index() {
    const client = useQueryClient()
    api.assignment.getAll.useQuery({limit: 20, skip: 0}, {
        onSuccess: data => client.setQueryData(['assignment'], data)
    })

    return (
        <div className="flex flex-col items-center justify-between py-6 px-12">
            <div className="m-8 p-8 grid w-full grid-rows-6 grid-flow-col gap-4 auto-cols-auto">
                {
                    client.getQueryData<AssignmentWithUser[]>(['assignment'])?.map((assignment, index) => (
                        <div key={index}>
                            <AssignmentPost assignment={assignment}/>
                        </div>
                    ))
                }
            </div>
        </div>
    );
}
