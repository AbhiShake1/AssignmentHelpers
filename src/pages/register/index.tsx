import React, {type FC, useState} from 'react';
import MultiStepForm from "~/components/MultiStepForm";
import {toast} from "react-hot-toast";
import {useRouter} from "next/router";
import {api} from "~/utils/api";
import {useUser} from "@clerk/nextjs";
import {useAutoAnimate} from "@formkit/auto-animate/react";
import {Button, Input, MultiSelect, PinInput, Radio, Text, Textarea} from "@mantine/core";

type AccountType = 'personal' | 'professional'

interface RegisterFormProps {
    accountType: AccountType
}

interface ChoiceFormProps {
    onSubmit: (choice: AccountType) => void
}

const data = [
    { value: 'react', label: 'React' },
    { value: 'ng', label: 'Angular' },
    { value: 'svelte', label: 'Svelte' },
    { value: 'vue', label: 'Vue' },
    { value: 'riot', label: 'Riot' },
    { value: 'next', label: 'Next.js' },
    { value: 'blitz', label: 'Blitz.js' },
];

const RegisterForm: FC<RegisterFormProps> = ({accountType}) => {
    const router = useRouter()
    const auth = useUser()
    const [desc, setDesc] = useState('')
    const [phone, setPhone] = useState('')
    const [education, setEduction] = useState('')
    const [skills, setSkills] = useState<string[]>([])
    const [specialization, setSpecialization] = useState('')
    const [referral, setReferral] = useState('')
    const [skillsData, setSkillsData] = useState(data)
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

    function updateUser() {
        try {
            toast.loading('signing up...')
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
                about: desc,
            })
            toast.remove()
        } catch (e) {
            toast.remove()
            if (e) toast.error(e.toString())
        }
    }

    return (
        <div>
            <MultiStepForm onSubmit={updateUser} steps={[
                {
                    step: 'Personal',
                    onNext: () => {
                        if (phone == '') throw new Error('Phone number is required')
                        if (phone.length != 10) throw new Error('Phone number must be exactly 10 digits')
                    },
                    child: <div className='p-8 mx-8 white shadow-2xl rounded-lg flex flex-col space-y-4'>
                        <Input.Wrapper label='Phone number' required>
                            <PinInput length={10} type='number' onChange={setPhone} value={phone} required/>
                        </Input.Wrapper>
                        <Input.Wrapper label='About'>
                            <Textarea required placeholder="About you.." minRows={5} value={desc} onChange={(e) => {
                                if (e.target.value.length <= 150) {
                                    setDesc(e.target.value)
                                } else {
                                    toast.remove()
                                    toast.error('Description can only be upto 150 characters long')
                                }
                            }} rightSection={
                                <Text size='sm' sx={{ml: 'auto'}}>
                                    {desc.length}/150
                                </Text>
                            }/>
                        </Input.Wrapper>
                    </div>,
                },
                ...(accountType != 'professional' ? [] : [
                    {
                        step: 'Professional',
                        onNext: () => {
                            if (skills.length == 0) throw new Error('Skills is required')
                            if (specialization.length == 0) throw new Error('Specialization is required')
                        },
                        child: <div className='p-8 mx-8 white shadow-2xl rounded-lg flex flex-col space-y-2'>
                            <Input.Wrapper label='Education'>
                                <Input placeholder="Education" value={education}
                                       onChange={e => setEduction(e.target.value)}/>
                            </Input.Wrapper>
                            <MultiSelect
                                data={skillsData}
                                value={skills}
                                onChange={setSkills}
                                maxSelectedValues={5}
                                searchable
                                clearable
                                creatable
                                required
                                getCreateLabel={(query) => `+ Create ${query}`}
                                maxDropdownHeight={160}
                                onCreate={(query) => {
                                    const item = { value: query, label: query };
                                    setSkillsData((current) => [...current, item]);
                                    return item;
                                }}
                                nothingFound="Nothing found"
                                clearButtonProps={{ 'aria-label': 'Clear selection' }}
                                label="Skills"
                                placeholder="Pick upto 5 skills"
                            />
                            <Input.Wrapper label='Specialization' required>
                                <Input placeholder="Specialization" value={specialization}
                                       onChange={e => setSpecialization(e.target.value)} required/>
                            </Input.Wrapper>
                        </div>
                    }
                ]),
                {
                    step: 'Link Account',
                    child: <div className='p-8 mx-8 white shadow-2xl rounded-lg flex flex-col space-y-2'>
                        <Input.Wrapper label='Referral Code'>
                            <Input placeholder="Referral Code" value={referral} onChange={e => setReferral(e.target.value)}/>
                        </Input.Wrapper>
                    </div>
                }
            ]}/>
        </div>
    );
}

const ChoiceForm: FC<ChoiceFormProps> = ({onSubmit}) => {
    const [value, setValue] = useState<AccountType | undefined>()

    return <form>
        <Radio.Group label='Why are you here?' value={value} className='flex flex-col space-y-4'
                     onChange={v => setValue(v == 'personal' ? 'personal' : 'professional')}>
            <Radio value="personal" label="I want to find freelancers"/>
            <Radio value="professional" label="I want to find work"/>
            <Button className={`m-1`} variant="outline"
                    disabled={!value}
                    onClick={() => onSubmit(value!)}>
                Proceed
            </Button>
        </Radio.Group>
    </form>
}

function Register() {
    const [choice, setChoice] = useState<AccountType | undefined>()
    const [animation] = useAutoAnimate()

    return <div className='flex flex-col items-center justify-center' ref={animation}>
        {choice ? <RegisterForm accountType={choice}/> : <ChoiceForm onSubmit={setChoice}/>}
    </div>
}

export default Register;