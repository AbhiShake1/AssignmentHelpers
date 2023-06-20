import React, {useEffect} from 'react';
import Image from "next/image";
import {ONBOARDING_ILLUSTRATION_URL} from "~/const/imageurls";
import {responsiveSubtitle, responsiveTitle} from "~/const/responsive";
import Head from "next/head";
import {useUser} from "@clerk/nextjs";
import {useRouter} from "next/router";
import {IconDeviceFloppy, IconLockOpen, IconSearch} from "@tabler/icons-react";
import {Button, Flex, Kbd, TextInput} from "@mantine/core";
import {spotlight} from "@mantine/spotlight";
import useGlobalSearch from "~/stores/globalSearch";

function Index() {
    const {text: searchText, set: setSearchText} = useGlobalSearch()
    const user = useUser()
    const router = useRouter()

    useEffect(() => {
        if (!user.isSignedIn && router.query['referrer']) {
            localStorage.setItem('referrer', router.query['referrer'] as string)
        }
    }, [user.isSignedIn])

    return (
        <>
            <Head>
                <title>AssignmentHelpers</title>
                <meta name="description" content="Assignment Helpers"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <div className='xl:p-32'>
                <div className='px-16 py-8 flex flex-row justify-between space-x-12 items-center'>
                    <div className=''>
                        <h1 className={`${responsiveTitle} font-bold`}>Are you looking for
                            Freelancers?</h1>
                        <h3 className={`mt-8 text-gray-500 mb-44 ${responsiveSubtitle}`}>Hire Great
                            Freelancers, Fast.
                            AssignmentHelpers helps you hire elite freelancers at a moment&apos;s notice</h3>
                        <div className='flex flex-row space-x-4'>
                            <Button leftIcon={<Image width={24} height={24} alt='' src='freelancer.svg'/>}
                                    variant='outline' size='xl' radius='xl'>
                                Hire Freelancers..
                            </Button>
                            <TextInput
                                icon={<IconSearch size="1.1rem" stroke={1.5}/>}
                                radius="xl"
                                size='xl'
                                rightSection={
                                    <Flex align='center'>
                                        <Kbd mr={5}>Ctrl</Kbd>
                                        <span>+</span>
                                        <Kbd mr={5}>Shift</Kbd>
                                        <span>+</span>
                                        <Kbd ml={5}>F</Kbd>
                                    </Flex>
                                }
                                placeholder="Search..."
                                rightSectionWidth={168}
                                value={searchText}
                                onChange={(e) => {
                                    e.preventDefault()
                                    setSearchText(e.target.value)
                                    spotlight.open()
                                }}
                            />
                        </div>
                    </div>
                    <div className='h-full w-full flex justify-center sm:hidden md:block'>
                        <Image
                            className='w-full shadow-xl rounded-3xl object-cover' width={4000} height={4000}
                            alt='welcome'
                            src={ONBOARDING_ILLUSTRATION_URL}
                        />
                    </div>
                </div>
                <div
                    className='flex flex-row text-center sm:flex-col xs:flex-col md:flex-col xs:space-y-8 sm:space-y-8 md:space-y-12 lg:space-y-0
                xl:space-y-0 lg:flex-row items-center justify-between bg-white p-12 rounded-2xl shadow-2xl w-5/4 my-32
                xl:mx-0 md:mx-6'>
                    <div className='flex flex-col items-center space-y-2 bg-transparent'>
                        <IconLockOpen className='scale-150 bg-transparent' color='primary'/>
                        <h2 className='text-2xl font-bold text-center'>Create Account</h2>
                        <h2 className='text-lg font-semibold text-gray-500 text-center xs:hidden lg:block'>First
                            you have to create a account here</h2>
                    </div>
                    <div className='flex flex-col items-center space-y-2 bg-transparent'>
                        <IconSearch className='scale-150 bg-transparent' color='primary'/>
                        <h2 className='text-2xl font-bold bg-transparent'>Search work</h2>
                        <h2 className='text-lg font-semibold text-gray-500 xs:hidden lg:block'>Search the
                            best freelance work here</h2>
                    </div>
                    <div className='flex flex-col items-center space-y-2 bg-transparent'>
                        <IconDeviceFloppy className='scale-150 bg-transparent' color='primary'/>
                        <h2 className='text-2xl font-bold bg-transparent'>Save and apply</h2>
                        <h2 className='text-lg font-semibold text-gray-500 xs:hidden lg:block'>Apply or save
                            and start your work</h2>
                    </div>
                </div>
                <div className='flex flex-col space-y-4 items-center md:px-6 xl:px-0'>
                    <div className='text-5xl font-bold text-center'>Find The Best <span
                        className='text-blue-600'>Freelancers</span> Here
                    </div>
                    <div className='text-gray-500 text-center'>
                        Discover the finest freelancers here at our platform, where talent meets opportunity.
                        Whether you&apos;re seeking skilled professionals for your projects or looking to showcase your
                        expertise,
                        our community connects you with top-notch freelancers across various fields.
                        With a seamless search experience and a vast pool of talented individuals, finding the perfect
                        match
                        for your freelance needs has never been easier.
                        Explore, collaborate, and unlock endless possibilities with our platform today.
                    </div>
                </div>
            </div>
        </>
    );
}

export default Index;