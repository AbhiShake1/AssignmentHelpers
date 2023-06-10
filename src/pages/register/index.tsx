import React, {type FC, useEffect, useState} from 'react';
import MultiStepForm from "~/components/MultiStepForm";
import {Button, FormControlLabel, TextField} from "@mui/material";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Typography from "@mui/joy/Typography";
import {toast} from "react-hot-toast";
import TagsInput from "~/components/TagsInput";
import {useRouter} from "next/router";
import {api} from "~/utils/api";
import {useUser} from "@clerk/nextjs";
import {Textarea} from "@mui/joy";
import {useAutoAnimate} from "@formkit/auto-animate/react";

const numberRegex = /^\d*$/

type AccountType = 'personal' | 'professional'

interface RegisterFormProps {
    accountType: AccountType
}

interface ChoiceFormProps {
    onSubmit: (choice: AccountType) => void
}

const RegisterForm: FC<RegisterFormProps> = ({accountType}) => {
    const router = useRouter()
    const auth = useUser()
    const [desc, setDesc] = useState('')
    const [phone, setPhone] = useState('')
    const [education, setEduction] = useState('')
    const [skills, setSkills] = useState<string[]>([])
    const [specialization, setSpecialization] = useState('')
    const [referral, setReferral] = useState('')
    const signupMutation = api.user.create.useMutation({
        onSuccess: () => {
            toast.remove()
            localStorage.removeItem('referrer')
            void router.replace('/')
        },
        onError: err => {
            toast.remove()
            toast.error(err.message)
        }
    })

    useEffect(() => {
        const referrer = localStorage.getItem('referrer')
        if (referrer) setReferral(referrer)
    }, [auth, router])

    async function updateUser() {
        try {
            toast.loading('signing up...')
            await auth.user?.update({
                unsafeMetadata: {
                    'skills': skills,
                    'specialization': specialization,
                    'education': education,
                    'phone': phone,
                    'accountType': accountType,
                    'about': desc,
                    'referredBy': referral,
                }
            })
            signupMutation.mutate({
                id: auth.user!.id,
                email: auth.user?.emailAddresses[0]?.emailAddress || '',
                name: `${auth.user!.firstName!} ${auth.user!.lastName!}`,
                skills,
                specialization,
                education,
                phone,
                accountType: accountType,
                referredBy: referral,
            })
        } catch (e) {
            if (e) toast.error(e.toString())
            toast.remove()
        }
    }

    return (
        <div>
            <MultiStepForm onSubmit={() => void updateUser()} steps={[
                {
                    step: 'Personal',
                    onNext: () => {
                        if (phone == '') throw new Error('Phone number is required')
                        if (phone.length != 10) throw new Error('Phone number must be exactly 10 digits')
                    },
                    child: <div className='p-8 white shadow-2xl rounded-lg flex flex-col space-y-2'>
                        <TextField label="Phone" type='tel' inputMode='numeric' variant="outlined" fullWidth
                                   value={phone}
                                   onChange={(e) => {
                                       const val = e.target.value
                                       if (val.length > 0 && !numberRegex.test(val)) return
                                       setPhone(val)
                                   }} required/>
                        <Textarea required placeholder="About you.." minRows={5} value={desc} onChange={(e) => {
                            if (e.target.value.length <= 150) {
                                setDesc(e.target.value)
                            } else {
                                toast.remove()
                                toast.error('Description can only be upto 150 characters long')
                            }
                        }} endDecorator={
                            <Typography level="body3" sx={{ml: 'auto'}}>
                                {desc.length}/150
                            </Typography>
                        }/>
                    </div>,
                },
                ...(accountType != 'professional' ? [] : [
                    {
                        step: 'Professional',
                        onNext: () => {
                            if (skills.length == 0) throw new Error('Skills is required')
                            if (specialization.length == 0) throw new Error('Specialization is required')
                        },
                        child: <div className='p-8 white shadow-2xl rounded-lg flex flex-col space-y-2'>
                            <TextField label="Education" variant="outlined" fullWidth value={education}
                                       onChange={e => setEduction(e.target.value)}/>
                            <TagsInput onChange={setSkills} value={skills} label='Skills' limit={5} required/>
                            <TextField label="Specialization" variant="outlined" value={specialization}
                                       onChange={e => setSpecialization(e.target.value)} fullWidth required/>
                        </div>
                    }
                ]),
                {
                    step: 'Link Account',
                    child: <div className='p-8 white shadow-2xl rounded-lg flex flex-col space-y-2'>
                        <TextField label="Referral Code" value={referral} onChange={e => setReferral(e.target.value)}
                                   variant="outlined" fullWidth/>
                    </div>
                }
            ]}/>
        </div>
    );
}

const ChoiceForm: FC<ChoiceFormProps> = ({onSubmit}) => {
    const [value, setValue] = useState<AccountType | undefined>()
    return <form>
        <FormControl sx={{m: 3}} variant="standard">
            <FormLabel>Why are you here?</FormLabel>
            <RadioGroup
                value={value}
                onChange={e => setValue(e.target.value == 'personal' ? 'personal' : 'professional')}
            >
                <FormControlLabel value="personal" control={<Radio/>} label="I want to find freelancers"/>
                <FormControlLabel value="professional" control={<Radio/>} label="I want to find work"/>
            </RadioGroup>
            <Button className={`m-1 ${value ? 'bg-blue-600 hover:bg-blue-900' : ''}`} type="button" variant="contained"
                    disabled={!value}
                    onClick={() => onSubmit(value!)}>
                Proceed
            </Button>
        </FormControl>
    </form>
}

function Register() {
    const [choice, setChoice] = useState<AccountType | undefined>()
    const [animation] = useAutoAnimate()
    const router = useRouter()
    const auth = useUser()

    useEffect(() => {
        const registered = auth.user?.unsafeMetadata['phone']
        if (registered) return void router.replace('/')
    }, [auth, router])

    return <div className='flex flex-col items-center justify-center' ref={animation}>
        {choice ? <RegisterForm accountType={choice}/> : <ChoiceForm onSubmit={setChoice}/>}
    </div>
}

export default Register;