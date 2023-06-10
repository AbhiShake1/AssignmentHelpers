import React from 'react';
import {useRouter} from "next/router";
import Image from "next/image";
import {Chip, CircularProgress} from "@mui/joy";
import {NotFound} from "next/dist/client/components/error";
import {api} from "~/utils/api";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {type User} from "@clerk/clerk-sdk-node";
import {Rating} from "@mui/material";
import {InfoTwoTone} from "@mui/icons-material";
import {UseTRPCQueryResult} from "@trpc/react-query/shared";

const Index = () => {
    const router = useRouter()

    const userId = router.query.userId?.toString() || ''

    if (!userId) return <NotFound/>

    const user: UseTRPCQueryResult<User, any> = api.user.getClerkUser.useQuery({userId})

    if (user.isLoading) return <div className='flex flex-row justify-center items-center h-screen'>
        <CircularProgress size='lg'/>
    </div>

    if (!user.isSuccess) return <NotFound/>

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const {imageUrl, firstName, lastName, unsafeMetadata} = user.data

    return <div className='px-16 py-8 flex flex-row space-x-16'>
        <div className='flex flex-col space-y-2 w-1/5'>
            <Image src={imageUrl} alt='' width={128} height={128} className='rounded-full'/>
        </div>
        <div className='flex flex-col space-y-2 w-4/5'>
            <h2 className='text-3xl font-medium'>{`${firstName} ${lastName}`}</h2>
            <h3>{unsafeMetadata.specialization}</h3>
            <h3>
                <Rating readOnly defaultValue={2.3} size="large" precision={.1}/>
            </h3>
            <h3 className='pt-8'>
                {
                    (unsafeMetadata.skills as string[]).map((skill, idx) => <Chip key={idx} size='lg'>{skill}</Chip>)
                }
            </h3>
            <h3 className='pt-16 w-3/4'>
                <div className='flex flex-col items-center space-y-4 shadow-2xl bg-white p-4 rounded-lg'>
                    <div className='flex flex-row space-x-2'>
                        <InfoTwoTone/>
                        <h2>About</h2>
                    </div>
                    <div className='text-center'>{unsafeMetadata.about || 'abnc'}</div>
                </div>
            </h3>
        </div>
    </div>
};

export default Index;