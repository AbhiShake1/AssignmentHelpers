import {type AppType} from "next/app";
import {api} from "~/utils/api";
import "~/styles/globals.css";
import {ClerkProvider, SignOutButton, UserButton, useUser} from '@clerk/nextjs'
import React, {useEffect} from "react";
import Link from "next/link";
import {usePathname} from "next/navigation";

function NavBar() {
    const user = useUser()
    const path = usePathname()

    useEffect(() => {
        document.body.classList.add('custom-scrollbar');

        return () => {
            // Revert back to default when component unmounts
            document.body.classList.remove('custom-scrollbar');
        };
    }, []);

    if (!user.isSignedIn) return null

    // return (<div className='overflow-y-hidden'><SmoothScroll/></div>)

    return (
        <div className='top-0 left-0 right-0'>
            <div className='border-blue-500 border-opacity-25 border m-12 p-4 rounded-2xl shadow-2xl flex flex-row bg-white'>
                <Link href='home' scroll={false} className='p-4 bg-transparent'>
                    <span className='text-blue-500 bg-transparent'>Assignment</span>
                    <span className='text-gray-500 bg-transparent'>Helpers</span>
                </Link>
                <div className='flex flex-row-reverse space-x-4 w-full bg-transparent'>
                    <div className='mx-4 p-4'><UserButton/></div>
                    <Link href='' scroll={false} className='mx-4 rounded-3xl bg-blue-500 py-4 px-8 hover:bg-blue-900 text-white'>Post an
                        assignment</Link>
                    <Link href='findWork' scroll={false}
                          className={`hover:text-blue-500 p-4 bg-transparent ${path.includes('findWork') ? 'text-blue-700' : ''}`}>Find
                        Work</Link>
                    <Link href='findFreelancers' scroll={false}
                          className={`hover:text-blue-500 p-4 bg-transparent ${path.includes('findFreelancers') ? 'text-blue-700' : ''}`}>Find
                        Freelancers</Link>
                    {/*<Link href='' className={`hover:text-blue-500 p-4 bg-transparent ${path.includes('findWork') ? 'text-blue-700' : ''}`}>Log in</Link>*/}
                    <Link href='home' scroll={false}
                          className={`hover:text-blue-500 p-4 bg-transparent ${path.includes('home') ? 'text-blue-700' : ''}`}>Home</Link>
                </div>
            </div>
        </div>
    )
}

const MyApp: AppType = ({Component, pageProps}) => {
    return (
        <ClerkProvider {...pageProps}>
            <NavBar/>
            <Component {...pageProps} />
        </ClerkProvider>
    );
};

export default api.withTRPC(MyApp);
