import React, {useState} from 'react';
import {api} from "~/utils/api";
import {Button, createStyles, getStylesRef, Input, Loader, Navbar, rem} from '@mantine/core';
import {
    Icon2fa,
    IconBellRinging,
    IconDatabaseImport,
    IconFingerprint,
    IconKey,
    IconReceipt2,
    IconSend,
    IconSettings,
    IconUser,
} from '@tabler/icons-react';


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

const data = [
    {link: '', label: 'Notifications', icon: IconBellRinging},
    {link: '', label: 'Billing', icon: IconReceipt2},
    {link: '', label: 'Security', icon: IconFingerprint},
    {link: '', label: 'SSH Keys', icon: IconKey},
    {link: '', label: 'Databases', icon: IconDatabaseImport},
    {link: '', label: 'Authentication', icon: Icon2fa},
    {link: '', label: 'Other Settings', icon: IconSettings},
];

function Index() {
    const chats = api.chat.supportChats.useQuery()
    const {classes, cx} = useStyles();
    const [active, setActive] = useState('')
    const [text, setText] = useState('')
    const sendMutation = api.chat.send.useMutation()

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

    const chat = chats.data.find(c => c.fromUserId == active)

    return (
        <div className='flex flex-row h-[80vh]'>
            <Navbar className='w-2/12 h-full' p="md">
                {links}
            </Navbar>
            {
                chat && <div className='flex flex-col space-y-4 w-9/12 overflow-y-auto mb-[5vh] mt-4 mx-2'>
                    {
                        chat.messages?.map(message => (
                            <div key={message.id} className='flex flex-col space-y-2'>
                                {
                                    message.senderId == '' ? <div className='flex flex-row'>
                                            <div
                                                className='py-2 px-4 bg-blue-300 max-w-xl rounded-b-3xl rounded-tr-3xl'>{chat.fromUserId}</div>
                                            <div className='w-full'/>
                                        </div> :
                                        <div className='flex flex-row'>
                                            <div className='w-full'/>
                                            <div
                                                className='py-2 px-4 bg-blue-300 max-w-xl rounded-t-3xl rounded-bl-3xl'>jdfios
                                            </div>
                                        </div>
                                }
                            </div>
                        ))
                    }
                    <Input value={text} onChange={e => setText(e.target.value)} placeholder='Write something..'
                           size='lg' className='m-4 absolute bottom-4 w-8/12'
                           rightSection={<Button variant='subtle' disabled={!text} onClick={() => sendMutation.mutate({
                               msg: text,
                               to: ''
                           })}><IconSend/></Button>}/>
                </div>
            }
        </div>
    );
}

export default Index;