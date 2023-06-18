import React from 'react';
import type {Assignment} from "@prisma/client";
import type {NextPage} from "next";
import Image from "next/image";
import {IconClock, IconMessage2} from "@tabler/icons-react";
import {Avatar, Button, Group, Text} from "@mantine/core";
import type {User} from "@clerk/clerk-sdk-node";
import {useRouter} from "next/router";

export type AssignmentWithUser = Assignment & { postedBy?: User }

interface Props {
    assignment: AssignmentWithUser,
}

const AssignmentPost: NextPage<Props> = ({assignment}) => {
    const postedBy = assignment.postedBy
    const router = useRouter()

    return (
        <div>
            {
                postedBy && <div className="relative">
                    <div className="absolute top-4 left-8">
                        <Group spacing="sm">
                            <Avatar size={36} src={postedBy.imageUrl || postedBy.profileImageUrl || ''} radius={30}/>
                            <Text fz="lg" fw={500}>
                                {`${postedBy?.firstName || ''} ${postedBy?.lastName || ''}`}
                            </Text>
                            <Button variant='subtle' onClick={() => void router.push(`chat/${assignment.id}`)}>
                                <IconMessage2/>
                            </Button>
                        </Group>
                    </div>
                </div>
            }
            <div className='px-8 py-6 bg-white shadow-2xl rounded-lg border border-gray-200 flex flex-col items-center'>
                <h1 className='text-2xl'>{assignment.title} for {assignment.budget}</h1>
                <div className='py-4 px-6 w-full flex flex-col space-y-4 items-center'>
                    <div className='flex flex-row space-x-2'>
                        <IconClock className='text-blue-600'/>
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
        </div>
    );
};

export default AssignmentPost;