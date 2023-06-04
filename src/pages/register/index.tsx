import React, {useState} from 'react';
import MultiStepForm from "~/components/MultiStepForm";
import {TextField} from "@mui/material";
import {Textarea} from "@mui/joy";
import Typography from "@mui/joy/Typography";
import {toast} from "react-hot-toast";
import TagsInput from "~/components/TagsInput";

function Register() {
    const [desc, setDesc] = useState('')
    return (
        <div>
            <MultiStepForm onSubmit={(e) => console.log(e)} steps={[
                {
                    step: 'Personal',
                    child: <div className='p-8 white shadow-2xl rounded-lg flex flex-col space-y-2'>
                        <TextField label="Phone" type='tel' variant="outlined" fullWidth required/>
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
                    </div>
                },
                {
                    step: 'Professional',
                    child: <div className='p-8 white shadow-2xl rounded-lg flex flex-col space-y-2'>
                        <TextField label="Education" variant="outlined" fullWidth/>
                        <TagsInput onChange={() => ''} placeholder='Skills' required/>
                        <TextField label="Specialization" variant="outlined" fullWidth required/>
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