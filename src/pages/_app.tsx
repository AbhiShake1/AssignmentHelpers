import {type AppType} from "next/app";
import {api} from "~/utils/api";
import "~/styles/globals.css";
import {ClerkProvider, UserButton, useUser} from '@clerk/nextjs'
import React, {useEffect, useState} from "react";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {Button, ThemeProvider} from "@mui/material";
import ChatDialog from "~/components/ChatDialog";
import Hamburger from "~/components/Hamburger";
import {useRouter} from "next/router";
import {IconButton, Input} from "@mui/joy";
import {ShareTwoTone} from "@mui/icons-material";
import AppDialog from "~/components/AppDialog";
import {toast, Toaster} from "react-hot-toast";

function Share() {
    const router = useRouter()
    const [showDialog, setShowDialog] = useState(false)
    const {user} = useUser()

    if (!user) return null

    const referrer: string | null = router.query.referrer?.toString() || null

    const referralLink = `localhost:3000/?referrer=${user.id}`

    const onCopy = async () => {
        await navigator.clipboard.writeText(referralLink)
        toast.success('Copied to clipboard')
    }

    return <>
        <IconButton className='rounded-full' onClick={() => setShowDialog(true)}><ShareTwoTone/></IconButton>
        <AppDialog open={showDialog} setOpen={setShowDialog} title='Refer and earn'
                   description='Share this link, and get 2% commission off their transaction for lifetime'>
            <Input className='mt-4' value={referralLink}
                   endDecorator={<Button onClick={onCopy}>Copy</Button>}
            />
        </AppDialog>
    </>
}

function DesktopNavbar() {
    const path = usePathname()
    const user = useUser()

    return <div
        className='border-blue-500 border-opacity-25 border m-12 p-4 rounded-2xl shadow-2xl flex flex-row bg-white'>
        <Link href='resgister' scroll={true} className='p-4 bg-transparent'>
            <span className='text-blue-500 text-3xl'>Assignment</span>
            <span className='text-gray-500 text-3xl'>Helpers</span>
        </Link>
        <div className='flex flex-row-reverse space-x-4 w-full bg-transparent'>
            {user.isSignedIn && <div className='mx-4 p-4'><UserButton afterSignOutUrl='/'/></div>}
            <Share/>
            <Link href='' scroll={true}
                  className='mx-4 rounded-3xl bg-blue-500 py-4 px-8 hover:bg-blue-900 text-white mb-4'>Post an
                assignment</Link>
            <Link href='findWork' scroll={true}
                  className={`hover:text-blue-500 p-4 ${path.includes('findWork') ? 'text-blue-700' : ''}`}>Find
                Work</Link>
            <Link href='findFreelancers' scroll={true}
                  className={`hover:text-blue-500 p-4 ${path.includes('findFreelancers') ? 'text-blue-700' : ''}`}>Find
                Freelancers</Link>
            <Link href='/' scroll={true}
                  className={`hover:text-blue-500 p-4 ${path == '/' ? 'text-blue-700' : ''}`}>Home</Link>
            {!user.isSignedIn && <Link href='login'
                                       className={`hover:text-blue-500 p-4 ${path.includes('findWork') ? 'text-blue-700' : ''}`}>Log
                in</Link>}
        </div>
    </div>
}

function MobileNavbar() {
    const router = useRouter()
    const user = useUser()
    const path = usePathname()

    const referrer: string | null = router.query.referrer?.toString() || null

    return <Hamburger>
        {user.isSignedIn && <div className='mx-4 p-4'><UserButton afterSignOutUrl='/onboarding'/></div>}
        <Link href='/' scroll={true}
              className={`hover:text-blue-500 p-4 ${path == 'home' ? 'text-blue-700' : ''}`}>Home</Link>
        <Link href='findFreelancers' scroll={true}
              className={`hover:text-blue-500 p-4 ${path.includes('findFreelancers') ? 'text-blue-700' : ''}`}>Find
            Freelancers</Link>
        <Link href='findWork' scroll={true}
              className={`hover:text-blue-500 p-4 ${path.includes('findWork') ? 'text-blue-700' : ''}`}>Find
            Work</Link>
        <Link href='' scroll={true}
              className='mx-4 rounded-3xl bg-blue-500 py-4 px-8 hover:bg-blue-900 text-white mb-4'>Post an
            assignment</Link>
        {!user.isSignedIn && <Link href='login'
                                   className={`hover:text-blue-500 p-4 ${path.includes('findWork') ? 'text-blue-700' : ''}`}>Log
            in</Link>}
    </Hamburger>
}

function NavBar() {
    useEffect(() => {
        document.body.classList.add('custom-scrollbar');

        return () => {
            // Revert back to default when component unmounts
            document.body.classList.remove('custom-scrollbar');
        };
    }, []);

    return (
        <div className='top-0 left-0 right-0'>
            <div className='lg:block md:hidden sm:hidden xs:hidden'>
                <DesktopNavbar/>
            </div>
            <div className='md:block lg:hidden'>
                <MobileNavbar/>
            </div>
        </div>
    )
}

const MyApp: AppType = ({Component, pageProps}) => {
    return (
        <ClerkProvider {...pageProps}>
            <ThemeProvider theme={{}}>
                <Toaster toastOptions={{position: 'bottom-center'}}/>
                <NavBar/>
                <ChatDialog/>
                <Component {...pageProps} />
            </ThemeProvider>
        </ClerkProvider>
    );
};

export default api.withTRPC(MyApp);
