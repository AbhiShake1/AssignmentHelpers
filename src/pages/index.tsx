import {type NextPage} from "next";
import Head from "next/head";
import {useUser} from "@clerk/nextjs";
import React, {useEffect} from "react";
import {useRouter} from "next/router";

const Home: NextPage = () => {
    const user = useUser()
    const router = useRouter()

    useEffect(() => {
        void router.replace(user.isSignedIn ? 'home' : 'onboarding')
    }, [user.isSignedIn])

    return (
        <>
            <Head>
                <title>AssignmentHelpers</title>
                <meta name="description" content="Assignment Helpers"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <main className="flex flex-col">
            </main>
        </>
    );
};

export default Home;
