import React from 'react';
import {api} from "~/utils/api";
import {Loader} from "@mantine/core";
import type {NextPage} from "next";

const Index: NextPage = () => {
    const users = api.user.getAll.useQuery()

    if (!users.isSuccess) return <center><Loader/></center>

    return <></>
}

export default Index;