import React, {useEffect, useState} from 'react';
import MultiStepForm from "~/components/MultiStepForm";
import {TextField} from "@mui/material";
import {Textarea} from "@mui/joy";
import Typography from "@mui/joy/Typography";
import {toast} from "react-hot-toast";
import TagsInput from "~/components/TagsInput";
import {useRouter} from "next/router";
import {api} from "~/utils/api";
import {useUser} from "@clerk/nextjs";

const numberRegex = /^\d*$/

function Register() {
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

    // useEffect(() => {
    //     const registered = auth.user?.unsafeMetadata['phone']
    //     if (registered) return void router.replace('/')
    //     const referrer = localStorage.getItem('referrer')
    //     if (referrer) setReferral(referrer)
    // }, [auth, router])

    async function updateUser() {
        try {
            toast.loading('signing up...')
            await auth.user?.update({
                unsafeMetadata: {
                    'skills': skills,
                    'specialization': specialization,
                    'education': education,
                    'phone': phone,
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
                },
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

export default Register;