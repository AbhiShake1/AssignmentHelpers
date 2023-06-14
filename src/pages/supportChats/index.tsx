import React, {useEffect, useRef, useState} from 'react';
import {api} from "~/utils/api";
import {Button, createStyles, getStylesRef, Input, Loader, Navbar, rem} from '@mantine/core';
import {IconSend, IconUser,} from '@tabler/icons-react';
import type {Message} from '@prisma/client'
import {toast} from "react-hot-toast";
import pusher from "~/stores/pusher";
import {Events} from "~/const/events";
import {useAuth} from "@clerk/nextjs";

const useStyles = createStyles((theme) => ({
    header: {
        paddingBottom: theme.spacing.md,
        marginBottom: `calc(${theme.spacing.md} * 1.5)`,
        borderBottom: `${rem(1)} solid ${
            theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
        }`,
    },

    footer: {
        paddingTop: theme.spacing.md,
        marginTop: theme.spacing.md,
        borderTop: `${rem(1)} solid ${
            theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
        }`,
    },

    link: {
        // ...theme.fn.focusStyles(),
        display: 'flex',
        alignItems: 'center',
        textDecoration: 'none',
        fontSize: theme.fontSizes.sm,
        color: theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[7],
        padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
        borderRadius: theme.radius.sm,
        fontWeight: 500,

        '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
            color: theme.colorScheme === 'dark' ? theme.white : theme.black,

            [`& .${getStylesRef('icon')}`]: {
                color: theme.colorScheme === 'dark' ? theme.white : theme.black,
            },
        },
    },

    linkIcon: {
        ref: getStylesRef('icon'),
        color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[6],
        marginRight: theme.spacing.sm,
    },

    linkActive: {
        '&, &:hover': {
            backgroundColor: theme.fn.variant({variant: 'light', color: theme.primaryColor}).background,
            color: theme.fn.variant({variant: 'light', color: theme.primaryColor}).color,
            [`& .${getStylesRef('icon')}`]: {
                color: theme.fn.variant({variant: 'light', color: theme.primaryColor}).color,
            },
        },
    },
}));

function Index() {
    const [msgs, setMsgs] = useState<Message[]>([])
    const chats = api.chat.supportChats.useQuery()
    const {classes, cx} = useStyles();
    const [active, setActive] = useState('')
    const [text, setText] = useState('')
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const user = useAuth()

    const chat = chats.data?.find(c => c.fromUserId == active)

    useEffect(() => {
        if (chat) {
            setMsgs(chat.messages)
        }
    }, [active, chat])

    useEffect(() => {
        if (!chat) return

        const id = chat.fromUserId
        // reset before new subscription
        if (id) {
            pusher.unsubscribe(id)
            pusher.unbind(id)
            pusher.subscribe(id).bind(Events.SEND_MESSAGE, (message: Message) => {
                setMsgs(msgs => [...msgs, message])
                // messagesContainerRef.current?.scroll({behavior: "smooth", top: 0})
            })
        }
        return () => pusher.unsubscribe(chat.fromUserId)
    }, [user.userId, chat])

    const sendMutation = api.chat.send.useMutation({
        onSuccess: data => {
            setText('')
            setMsgs(msgs => [data, ...msgs])
        },
        onError: err => toast.error(err.message),
    })

    useEffect(() => {
        messagesContainerRef.current?.scroll({behavior: "smooth", top: 0})
    }, [msgs])

    if (!chats.isSuccess) return <center><Loader/></center>

    const links = chats.data.map((item) => (
        <a
            className={cx(classes.link, {[classes.linkActive]: item.fromUserId === active})}
            key={item.fromUserId}
            onClick={(event) => {
                event.preventDefault();
                setActive(item.fromUserId);
            }}
        >
            <IconUser className={classes.linkIcon} stroke={1.5}/>
            <span>{item.fromUser.name}</span>
        </a>
    ))

    return (
        <div className='flex flex-row h-[80vh]'>
            <Navbar className='w-2/12 h-full' p="md">
                {links}
            </Navbar>
            {
                chat && msgs.length > 0 &&
                <div
                    className='flex flex-col-reverse space-y-4 w-9/12 overflow-y-auto mb-[5vh] mt-4 mx-2 [&::-webkit-scrollbar]:hidden'
                    ref={messagesContainerRef}>
                    {
                        msgs?.map(message => (
                            <div key={message.id} className='flex flex-col space-y-2'>
                                {
                                    message.senderId == '' ? <div className='flex flex-row'>
                                            <div
                                                className='py-2 px-4 bg-blue-300 max-w-xl rounded-b-3xl rounded-tr-3xl'>{message.text}</div>
                                            <div className='w-full'/>
                                        </div> :
                                        <div className='flex flex-row'>
                                            <div className='w-full'/>
                                            <div
                                                className='py-2 px-4 bg-blue-300 max-w-xl rounded-t-3xl rounded-bl-3xl'>
                                                {message.text}
                                            </div>
                                        </div>
                                }
                            </div>
                        ))
                    }
                    <Input value={text} onChange={e => setText(e.target.value)} placeholder='Write something..'
                           size='lg' className='m-4 absolute bottom-4 w-8/12'
                           rightSection={<Button variant='subtle' disabled={!text} loading={sendMutation.isLoading}
                                                 onClick={() => sendMutation.mutate({
                                                     msg: text,
                                                     to: chat.fromUserId,
                                                     senderId: '',
                                                 })}><IconSend/></Button>}/>
                </div>
            }
        </div>
    );
}

export default Index;