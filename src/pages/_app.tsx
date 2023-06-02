import {type AppType} from "next/app";
import {api} from "~/utils/api";
import "~/styles/globals.css";
import {ClerkProvider, UserButton, useUser} from '@clerk/nextjs'
import React, {useEffect} from "react";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {ThemeProvider} from "@mui/material";
import Hamburger from "~/components/Hamburger";
import ChatDialog from "~/components/ChatDialog";


function MobileNavbar() {
    const user = useUser()
    const path = usePathname()

    return <Hamburger>
        {user.isSignedIn && <div className='mx-4 p-4'><UserButton afterSignOutUrl='/onboarding'/></div>}
        <Link href='home' scroll={true}
              className={`hover:text-blue-500 p-4 bg-transparent ${path.includes('home') ? 'text-blue-700' : ''}`}>Home</Link>
        <Link href='findFreelancers' scroll={true}
              className={`hover:text-blue-500 p-4 bg-transparent ${path.includes('findFreelancers') ? 'text-blue-700' : ''}`}>Find
            Freelancers</Link>
        <Link href='findWork' scroll={true}
              className={`hover:text-blue-500 p-4 bg-transparent ${path.includes('findWork') ? 'text-blue-700' : ''}`}>Find
            Work</Link>
        <Link href='' scroll={true}
              className='mx-4 rounded-3xl bg-blue-500 py-4 px-8 hover:bg-blue-900 text-white mb-4'>Post an
            assignment</Link>
        {!user.isSignedIn && <Link href=''
                                   className={`hover:text-blue-500 p-4 bg-transparent ${path.includes('findWork') ? 'text-blue-700' : ''}`}>Log
            in</Link>}
    </Hamburger>
}

function DesktopNavbar() {
    const user = useUser()
    const path = usePathname()

    return <div
        className='border-blue-500 border-opacity-25 border m-12 p-4 rounded-2xl shadow-2xl flex flex-row bg-white'>
        <Link href='home' scroll={true} className='p-4 bg-transparent'>
            <span className='text-blue-500 bg-transparent text-3xl'>Assignment</span>
            <span className='text-gray-500 bg-transparent text-3xl'>Helpers</span>
        </Link>
        <div className='flex flex-row-reverse space-x-4 w-full bg-transparent'>
            {user.isSignedIn && <div className='mx-4 p-4'><UserButton afterSignOutUrl='/onboarding'/></div>}
            <Link href='' scroll={true}
                  className='mx-4 rounded-3xl bg-blue-500 py-4 px-8 hover:bg-blue-900 text-white mb-4'>Post an
                assignment</Link>
            <Link href='findWork' scroll={true}
                  className={`hover:text-blue-500 p-4 bg-transparent ${path.includes('findWork') ? 'text-blue-700' : ''}`}>Find
                Work</Link>
            <Link href='findFreelancers' scroll={true}
                  className={`hover:text-blue-500 p-4 bg-transparent ${path.includes('findFreelancers') ? 'text-blue-700' : ''}`}>Find
                Freelancers</Link>
            {!user.isSignedIn && <Link href=''
                                       className={`hover:text-blue-500 p-4 bg-transparent ${path.includes('findWork') ? 'text-blue-700' : ''}`}>Log
                in</Link>}
            <Link href='home' scroll={true}
                  className={`hover:text-blue-500 p-4 bg-transparent ${path.includes('home') ? 'text-blue-700' : ''}`}>Home</Link>
        </div>
    </div>
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
                <NavBar/>
                <ChatDialog/>
                <Component {...pageProps} />
            </ThemeProvider>
        </ClerkProvider>
    );
};

export default api.withTRPC(MyApp);
