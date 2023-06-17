import React from 'react';
import {api} from "~/utils/api";
import {Anchor, Avatar, Badge, Group, Loader, LoadingOverlay, Table, Text} from "@mantine/core";
import type {NextPage} from "next";

const Index: NextPage = () => {
    const usersQuery = api.user.getAll.useQuery()
    const updateMutation = api.user.update.useMutation()

    if (!usersQuery.isSuccess) return <center><Loader/></center>

    return <div className='mx-16'>
        <LoadingOverlay visible={updateMutation.isLoading} overlayBlur={2}/>
        <Table sx={{minWidth: 800}} verticalSpacing="sm">
            <thead>
            <tr>
                <th>User</th>
                <th>Admin</th>
                <th>Email</th>
                <th>Phone</th>
                <th/>
            </tr>
            </thead>
            <tbody>
            {
                usersQuery.data.map(user => (
                    <tr key={user.id}>
                        <td>
                            <Group spacing="sm">
                                <Avatar size={30} src={user.imageUrl} radius={30}/>
                                <Text fz="sm" fw={500}>
                                    {user.name}
                                </Text>
                            </Group>
                        </td>

                        <td>
                            <Badge
                                color={user.isAdmin == 'Yes' ? 'blue' : 'red'}
                                className='py-3 px-4'
                                variant='filled'
                            >
                                {user.isAdmin?.toString()}
                            </Badge>
                        </td>
                        <td>
                            <Anchor component="button" size="sm">
                                {user.email}
                            </Anchor>
                        </td>
                        <td>
                            <Text fz="sm" c="dimmed">
                                {user.phone}
                            </Text>
                        </td>
                        <td>
                            <Badge
                                className='py-3 px-4'
                                variant='filled'
                            >
                                {user.accountType}
                            </Badge>
                        </td>
                    </tr>
                ))
            }
            </tbody>
        </Table>
    </div>
}

export default Index;