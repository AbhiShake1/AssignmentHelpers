import React from 'react';
import {SignIn} from "@clerk/nextjs";

function Index() {
    return (
        <div className='flex justify-center'>
            <SignIn afterSignInUrl="/" afterSignUpUrl="register"/>
        </div>
    );
}

export default Index;