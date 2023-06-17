import React from 'react';
import {api} from "~/utils/api";
import {Anchor, Avatar, Badge, Button, Group, Loader, LoadingOverlay, Table, Text} from "@mantine/core";
import type {NextPage} from "next";
import {IconCircleArrowUpFilled} from "@tabler/icons-react";
import {modals} from "@mantine/modals";
import {toast} from "react-hot-toast";

const Index: NextPage = () => {
    const usersQuery = api.user.getAll.useQuery()
    const promoteMutation = api.user.promoteToAdmin.useMutation({
        onError: err => toast.error(err.message),
        onSuccess: () => toast.success('Promoted to admin')
    })

    if (!usersQuery.isSuccess) return <center><Loader/></center>

    const handlePromoteClick = (user: typeof usersQuery.data[0]) => modals.openConfirmModal({
        title: `Are you sure you want to promote ${user.name} to Admin?`,
        labels: {cancel: 'Cancel', confirm: 'Yes'},
        confirmProps: {variant: 'subtle'},
        centered: true,
        onConfirm() {
            promoteMutation.mutate(user.id)
            modals.closeAll()
        }
    })

    return <div className='mx-16'>
        <LoadingOverlay visible={promoteMutation.isLoading} overlayBlur={2}/>
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
                        <td>
                            {
                                user.isAdmin == 'No' &&
                                <Button
                                    className='py-3 px-4'
                                    size='xl'
                                    variant='subtle'
                                    onClick={() => handlePromoteClick(user)}
                                >
                                    <IconCircleArrowUpFilled/>
                                </Button>
                            }
                        </td>
                    </tr>
                ))
            }
            </tbody>
        </Table>
    </div>
}

export default Index;