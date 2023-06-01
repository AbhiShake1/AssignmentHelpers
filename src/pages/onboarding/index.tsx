import React from 'react';
import Image from "next/image";
import {ONBOARDING_ILLUSTRATION_URL} from "~/const/imageurls";
import {Button, Input} from "@mui/joy";
import {FindInPageTwoTone, Lock, LockOpenTwoTone, SaveTwoTone, SearchRounded} from "@mui/icons-material";

function Index() {
    return (
        <div className='p-16'>
            <div className='px-16 py-8 flex flex-row justify-between space-x-12'>
                <div className='w-1/3'>
                    <h1 className='text-5xl font-bold'>Are you looking for Freelancers?</h1>
                    <h3 className='mt-8 text-xl text-gray-500 font-semibold mb-12'>Hire Great Freelancers, Fast.
                        AssignmentHelpers helps you hire elite freelancers at a moment&apos;s notice</h3>
                    <div className='flex flex-row space-x-4'>
                        <Button variant="solid" className='bg-blue-600 px-8 py-4 text-2xl'>Hire a freelancer</Button>
                        <Input placeholder='search freelance work' endDecorator={<SearchRounded className='bg-transparent' color="primary"/>}/>
                    </div>
                </div>
                <div className='h-full w-full flex justify-center'>
                    <Image
                        className='w-full shadow-xl rounded-3xl object-cover' width={4000} height={4000} alt='welcome'
                        src={ONBOARDING_ILLUSTRATION_URL}
                    />
                </div>
            </div>
            <div className='flex flex-row justify-between bg-white p-12 rounded-2xl shadow-2xl w-full my-32'>
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
            <div className='flex flex-col space-y-4 items-center'>
                <div className='text-5xl font-bold'>Find The Best <span className='text-blue-600'>Freelancers</span> Here</div>
                <div className='text-gray-500 text-center'>
                    Discover the finest freelancers here at our platform, where talent meets opportunity.
                    Whether you&apos;re seeking skilled professionals for your projects or looking to showcase your expertise,
                    our community connects you with top-notch freelancers across various fields.
                    With a seamless search experience and a vast pool of talented individuals, finding the perfect match for your freelance needs has never been easier.
                    Explore, collaborate, and unlock endless possibilities with our platform today.
                </div>
            </div>
        </div>
    );
}

export default Index;