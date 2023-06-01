import React from 'react';
import {SignIn} from "@clerk/nextjs";

function Index() {
    return (
        <div className='flex text-center items-center justify-center'>
            <SignIn afterSignInUrl="home" afterSignUpUrl="register"/>
        </div>
    );
}

export default Index;