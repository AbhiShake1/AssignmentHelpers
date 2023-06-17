import React from 'react';
import {api} from "~/utils/api";
import {Loader, LoadingOverlay} from "@mantine/core";
import type {NextPage} from "next";

const Index: NextPage = () => {
    const users = api.user.getAll.useQuery()

    if (!users.isSuccess) return <center><Loader/></center>

    return <div>
        <LoadingOverlay visible={true} overlayBlur={2} />
    </div>
}

export default Index;