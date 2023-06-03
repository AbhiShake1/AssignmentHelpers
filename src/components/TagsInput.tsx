import React, {useState} from "react";
import {Chip} from "@mui/material";
import {type NextPage} from "next";
import {Textarea} from "@mui/joy";
import {toast} from "react-hot-toast";
import Typography from "@mui/joy/Typography";

interface TagPropType {
    onChange: (selectedTags: string[]) => void,
    placeholder: string
}

const TagsInput: NextPage<TagPropType, { tags: [] }> = ({onChange, placeholder}) => {
    const [chips, setChips] = useState<string[]>([])
    const [txt, setTxt] = useState('')

    const handleDelete = (item: string) => () => {
        const newChips = structuredClone(chips).filter(c => c != item) || []
        setChips(newChips)
    }

    function handleInputChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const val = event.target.value
        const newChips = val.length == 0 ? [] : val.split(' ')

        if(newChips.length>3){
            toast.error('Only upto 3 skills allowed')
            return
        }

        setTxt(val)
        setChips(newChips)
        onChange(newChips)
    }

    return (
        <Textarea placeholder={placeholder} minRows={3} value={txt} onChange={handleInputChange} startDecorator={
            chips.length == 0 ? undefined : chips.map(item => (
                <Chip
                    key={item}
                    tabIndex={-1}
                    label={item}
                    className='space-x-2 mx-2'
                    onDelete={handleDelete(item)}
                />
            ))
        }/>
    )
}

export default TagsInput