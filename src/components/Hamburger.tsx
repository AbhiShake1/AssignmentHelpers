import React, {FC, ReactNode, useState} from 'react';
import {useAutoAnimate} from "@formkit/auto-animate/react";

interface Props {
    children?: ReactNode
}

const Hamburger: FC<Props> = ({children}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [parent] = useAutoAnimate({duration: 500, easing: "linear"})

    const handleMenuClick = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className={`flex flex-col space-y-2 ${isOpen ? 'bg-white' : ''}`} ref={parent}>
            <div
                id="menuButton"
                role="button"
                className={`close flex flex-col gap-1 pointer w-20 relative m-10 bg-transparent ${isOpen ? 'open' : 'close'}`}
                onClick={handleMenuClick}
            >
                <div
                    className={`absolute top-2 h-1 w-8 rounded-sm bg-black transform transition-all ease-in-out duration-300 ${isOpen ? 'rotate-45 top-4' : 'rotate-0 top-2'}`}/>
                <div
                    className={`absolute top-4 h-1 w-8 rounded-sm bg-black transition-all ease-in-out duration-300 ${isOpen ? 'hidden' : 'inline'}`}/>
                <div
                    className={`absolute top-6 h-1 w-8 rounded-sm bg-black transform transition-all ease-in-out duration-300 ${isOpen ? '-rotate-45 top-4' : 'rotate-0 top-6'}`}/>
            </div>
            {isOpen && <div className={`bg-white w-full text-xl p-8 ${isOpen ? 'block' : 'hidden'} flex flex-col items-center`}>
                {children}
            </div>}
        </div>
    );
};

export default Hamburger;