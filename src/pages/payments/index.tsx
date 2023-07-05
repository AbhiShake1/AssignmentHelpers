import React, {useEffect, useState} from 'react';
import {api} from "~/utils/api";
import {Anchor, Avatar, Badge, Button, Group, Loader, LoadingOverlay, Table, Text} from "@mantine/core";
import type {NextPage} from "next";
import {IconCircleArrowUpFilled} from "@tabler/icons-react";
import {modals} from "@mantine/modals";
import {toast} from "react-hot-toast";
import {type Payment} from '@prisma/client'

const Index: NextPage = () => {
    const [payments, setPayments] = useState<Payment[]>()
    const paymentsQuery = api.payment.getAll.useQuery()
    const markSentMutation = api.payment.update.useMutation({
        onError: err => toast.error(err.message),
        onSuccess: updatedPayment => {
            setPayments(u => u?.map(payment => payment.id == updatedPayment.id ? {...payment, isAdmin: 'Yes'} : payment))
            toast.success('Promoted to admin')
        },
    })

    useEffect(() => {
        if (paymentsQuery.isSuccess) {
            setPayments(paymentsQuery.data)
        }
    }, [paymentsQuery])

    if (!paymentsQuery.isSuccess) return <center><Loader/></center>

    const handleMarkSentClick = (payment: Payment) => modals.openConfirmModal({
        title: `Are you sure you have sent Rs.${payment.bidderAmount} from ${payment.payerId} to ${payment.payerId}?`,
        labels: {cancel: 'Cancel', confirm: 'Yes'},
        confirmProps: {variant: 'subtle'},
        centered: true,
        onConfirm() {
            markSentMutation.mutate({
                data: {
                    paid: true,
                },
                where: {
                    id: payment.id,
                }
            })
            modals.closeAll()
        }
    })

    return <div className='mx-16'>
        <LoadingOverlay visible={markSentMutation.isLoading} overlayBlur={2}/>
        <Table sx={{minWidth: 800}} verticalSpacing="sm">
            <thead>
            <tr>
                <th>Payment</th>
                <th>Admin</th>
                <th>Email</th>
                <th>Phone</th>
                <th/>
            </tr>
            </thead>
            <tbody>
            {
                payments?.map(payment => (
                    <tr key={payment.id}>
                        <td>
                            <Group spacing="sm">
                                <Avatar size={30} src={payment.payerId} radius={30}/>
                                <Text fz="sm" fw={500}>
                                    {payment.payerId}
                                </Text>
                            </Group>
                        </td>

                        <td>
                            <Badge
                                color={payment.paid ? 'blue' : 'red'}
                                className='py-3 px-4'
                                variant='filled'
                            >
                                {payment.paid?.toString()}
                            </Badge>
                        </td>
                        <td>
                            <Anchor component="button" size="sm">
                                {payment.bidderAmount}
                            </Anchor>
                        </td>
                        <td>
                            <Text fz="sm" c="dimmed">
                                {payment.referrerAmount}
                            </Text>
                        </td>
                        <td>
                            <Badge
                                className='py-3 px-4'
                                variant='filled'
                            >
                                {payment.merchantAmount}
                            </Badge>
                        </td>
                        <td>
                            {
                                !payment.paid &&
                                <Button
                                    className='py-3 px-4'
                                    size='xl'
                                    variant='subtle'
                                    onClick={() => handleMarkSentClick(payment)}
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