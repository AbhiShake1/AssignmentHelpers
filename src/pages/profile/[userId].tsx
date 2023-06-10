import React from 'react';
import {useRouter} from "next/router";
import {toast} from "react-hot-toast";

const Index = () => {
    const router = useRouter()

    const userId = router.query.userId
    return <div>
        {userId}
    </div>
};

export default Index;