import React from 'react';
import Image from "next/image";
import {ONBOARDING_ILLUSTRATION_URL} from "~/const/imageurls";
import {Button, Input} from "@mui/joy";
import {FindInPageTwoTone, Lock, LockOpenTwoTone, SaveTwoTone, SearchRounded} from "@mui/icons-material";

function Index() {
    return (
        <div className='p-16'>
            <div className='px-16 py-8 flex flex-row justify-between mb-48'>
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
            <div className='flex flex-row justify-between bg-white p-12 rounded-2xl shadow-2xl w-full'>
                <div className='flex flex-col items-center space-y-2 bg-transparent'>
                    <LockOpenTwoTone className='scale-150 bg-transparent' color='primary'/>
                    <h2 className='text-2xl font-bold bg-transparent'>Create Account</h2>
                    <h2 className='text-lg font-semibold text-gray-500 bg-transparent'>First you have to create a account  here</h2>
                </div>
                <div className='flex flex-col items-center space-y-2 bg-transparent'>
                    <FindInPageTwoTone className='scale-150 bg-transparent' color='primary'/>
                    <h2 className='text-2xl font-bold bg-transparent'>Search work</h2>
                    <h2 className='text-lg font-semibold text-gray-500 bg-transparent'>Search the best freelance work here</h2>
                </div>
                <div className='flex flex-col items-center space-y-2 bg-transparent'>
                    <SaveTwoTone className='scale-150 bg-transparent' color='primary'/>
                    <h2 className='text-2xl font-bold bg-transparent'>Save and apply</h2>
                    <h2 className='text-lg font-semibold text-gray-500 bg-transparent'>Apply or save and start your work</h2>
                </div>
            </div>
        </div>
    );
}

export default Index;