import React from 'react';
import Image from "next/image";
import {ONBOARDING_ILLUSTRATION_URL} from "~/const/imageurls";
import {Button, Input} from "@mui/joy";
import {SearchRounded} from "@mui/icons-material";

function Index() {
    return (
        <div className='px-16 py-8 flex flex-row justify-between'>
            <div className='w-1/2'>
                <h1 className='text-5xl font-bold'>Are you looking for Freelancers?</h1>
                <h3 className='mt-8 text-xl text-gray-500 font-semibold mb-64'>Hire Great Freelancers, Fast.
                    AssignmentHelpers helps you hire elite freelancers at a moment&apos;s notice</h3>
                <div className='flex flex-row space-x-4'>
                    <Button variant="solid" className='bg-blue-600 px-8 py-4 text-2xl'>Hire a freelancer</Button>
                    <Input placeholder='search freelance work' endDecorator={<SearchRounded className='bg-transparent' color="primary"/>}/>
                </div>
            </div>
            <div className='w-1/2 flex justify-center'>
                <Image
                    className='w-1/2 shadow-xl rounded-3xl' width={4000} height={4000} alt='welcome'
                    src={ONBOARDING_ILLUSTRATION_URL}
                />
            </div>
        </div>
    );
}

export default Index;