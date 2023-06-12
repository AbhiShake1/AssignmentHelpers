import {type AppType} from "next/app";
import {api} from "~/utils/api";
import "~/styles/globals.css";
import "@uploadthing/react/styles.css";
import {ClerkProvider, UserButton, useUser} from '@clerk/nextjs'
import React, {useEffect} from "react";
import Link from "next/link";
import {usePathname} from "next/navigation";
import ChatDialog from "~/components/ChatDialog";
import Hamburger from "~/components/Hamburger";
import {toast, Toaster} from "react-hot-toast";
import {ActionIcon, CopyButton, MantineProvider, TextInput} from "@mantine/core";
import {IconCopy, IconShare} from "@tabler/icons-react";
import {modals, ModalsProvider} from "@mantine/modals";

function Share() {
    const referralLinkQuery = api.referral.link.useQuery()
    const {user} = useUser()

    if (!user) return null

    const openShareModal = () =>
        modals.open({
            title: 'Refer and earn',
            centered: true,
            children: (
                <div className='flex flex-col space-y-4'>
                    <h3 className='text-gray-600 text-xs'>
                        Share this link, and get 2% commission off their transaction for lifetime
                    </h3>
                    <TextInput readOnly className='mt-4' value={referralLinkQuery.data || ''}
                               disabled={!referralLinkQuery.isSuccess}
                               rightSection={
                                   <CopyButton value={referralLinkQuery.data!}>
                                       {({copied, copy}) => (
                                           <button onClick={() => {
                                               copy()
                                               toast.success('Copied to clipboard')
                                           }}>
                                               <IconCopy
                                                   className={`text-${copied ? 'green-400' : 'black'}`}></IconCopy>
                                           </button>
                                       )}
                                   </CopyButton>
                               }
                    />
                </div>
            ),
        });

    return <>
        <ActionIcon variant="light" onClick={openShareModal}><IconShare/></ActionIcon>
    </>
}

function DesktopNavbar() {
    const path = usePathname()
    const user = useUser()
    const isFreelancer = user.user?.unsafeMetadata?.accountType == 'professional'

    return <div
        className='border-blue-500 border-opacity-25 border m-12 p-4 rounded-2xl shadow-2xl flex flex-row bg-white'>
        <Link href={`/profile/${user.user?.id || ''}`} scroll={true} className='p-4 bg-transparent'>
            <span className='text-blue-500 text-3xl'>Assignment</span>
            <span className='text-gray-500 text-3xl'>Helpers</span>
        </Link>
        <div className='flex flex-row-reverse space-x-4 w-full bg-transparent'>
            {user.isSignedIn && <div className='mx-4 p-4'><UserButton afterSignOutUrl='/'/></div>}
            <div className='flex items-center justify-center pb-4'>
                <Share/>
            </div>
            {user.isSignedIn && isFreelancer && <Link href='/findWork' scroll={true}
                                                      className={`hover:text-blue-500 p-4 ${path?.includes('findWork') ? 'text-blue-700' : ''}`}>Find
                Work</Link>}
            {user.isSignedIn && !isFreelancer && <Link href='/myAssignments' scroll={true}
                                                       className={`hover:text-blue-500 p-4 ${path?.includes('myAssignments') ? 'text-blue-700' : ''}`}>My
                Assignments</Link>}
            {user.isSignedIn && (user.user.unsafeMetadata.isAdmin || false) && <Link href='/supportChats' scroll={true}
                                                                                     className={`hover:text-blue-500 p-4 ${path?.includes('supportChats') ? 'text-blue-700' : ''}`}>Support chats</Link>}
            <Link href='/' scroll={true}
                  className={`hover:text-blue-500 p-4 ${path == '/' ? 'text-blue-700' : ''}`}>Home</Link>
            {!user.isSignedIn && <Link href='/login'
                                       className={`hover:text-blue-500 p-4 ${path?.includes('findWork') ? 'text-blue-700' : ''}`}>Log
                in</Link>}
        </div>
    </div>
}

function MobileNavbar() {
    const user = useUser()
    const path = usePathname()
    const isFreelancer = user.user?.unsafeMetadata?.accountType == 'professional'

    return <Hamburger>
        {user.isSignedIn && <div className='mx-4 p-4'><UserButton afterSignOutUrl='/onboarding'/></div>}
        <Share/>
        <Link href='/' scroll={true}
              className={`hover:text-blue-500 p-4 ${path == '/' ? 'text-blue-700' : ''}`}>Home</Link>
        <Link href='/myAssignments' scroll={true}
              className={`hover:text-blue-500 p-4 ${path?.includes('myAssignments') ? 'text-blue-700' : ''}`}>My
            Assignments</Link>
        {user.isSignedIn && (user.user.unsafeMetadata.isAdmin || false) && <Link href='/supportChats' scroll={true}
                                                                                 className={`hover:text-blue-500 p-4 ${path?.includes('supportChats') ? 'text-blue-700' : ''}`}>Support chats</Link>}
        {user.isSignedIn && isFreelancer && <Link href='/findWork' scroll={true}
                                                  className={`hover:text-blue-500 p-4 ${path?.includes('findWork') ? 'text-blue-700' : ''}`}>Find
            Work</Link>}
        {!user.isSignedIn && <Link href='/login'
                                   className={`hover:text-blue-500 p-4 ${path?.includes('findWork') ? 'text-blue-700' : ''}`}>Log
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
        <ClerkProvider experimental_enableClerkImages={true} touchSession={true}
                       publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
            <MantineProvider withGlobalStyles withNormalizeCSS
                             theme={{loader: 'bars', defaultRadius: 'sm', fontFamily: 'sans-serif'}}>
                <ModalsProvider>
                    <Toaster toastOptions={{position: 'bottom-center'}}/>
                    <NavBar/>
                    <ChatDialog/>
                    <Component {...pageProps} />
                </ModalsProvider>
            </MantineProvider>
        </ClerkProvider>
    );
};

export default api.withTRPC(MyApp);
