import React, {useState} from 'react';
import MultiStepForm from "~/components/MultiStepForm";
import {TextField} from "@mui/material";
import {Textarea} from "@mui/joy";
import Typography from "@mui/joy/Typography";
import {toast} from "react-hot-toast";
import TagsInput from "~/components/TagsInput";
import {useRouter} from "next/router";

function Register() {
    const router = useRouter()
    const [desc, setDesc] = useState('')
    const [phone, setPhone] = useState('')
    const [education, setEduction] = useState('')
    const [skills, setSkills] = useState<string[]>([])
    const [specialization, setSpecialization] = useState('')
    return (
        <div>
            <MultiStepForm onSubmit={() => void router.replace('/')} steps={[
                {
                    step: 'Personal',
                    onNext: () => {
                        if (phone == '') throw new Error('Phone number is required')
                    },
                    child: <div className='p-8 white shadow-2xl rounded-lg flex flex-col space-y-2'>
                        <TextField label="Phone" type='tel' variant="outlined" fullWidth value={phone}
                                   onChange={(e) => setPhone(e.target.value)} required/>
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
                        if (specialization.length == 0) throw new Error('Skills is required')
                    },
                    child: <div className='p-8 white shadow-2xl rounded-lg flex flex-col space-y-2'>
                        <TextField label="Education" variant="outlined" fullWidth value={education}
                                   onChange={e => setEduction(e.target.value)}/>
                        <TagsInput onChange={setSkills} label='Skills' limit={5} required/>
                        <TextField label="Specialization" variant="outlined" value={specialization}
                                   onChange={e => setSpecialization(e.target.value)} fullWidth required/>
                    </div>
                },
                {
                    step: 'Link Account',
                    child: <div className='p-8 white shadow-2xl rounded-lg flex flex-col space-y-2'>
                        <TextField label="Referral Code" variant="outlined" fullWidth/>
                    </div>
                }
            ]}/>
        </div>
    );
}

export default Register;