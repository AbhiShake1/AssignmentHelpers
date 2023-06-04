import React, {useState} from "react";
import {Chip, TextField} from "@mui/material";
import {type NextPage} from "next";
import {Input} from "@mui/joy";
import {toast} from "react-hot-toast";

interface TagPropType {
    onChange: (selectedTags: string[]) => void,
    placeholder: string
    required: boolean
}

const TagsInput: NextPage<TagPropType, { tags: [], required: false }> = ({onChange, placeholder, required}) => {
    const [chips, setChips] = useState<string[]>([])
    const [txt, setTxt] = useState('')

    const handleDelete = (item: string) => () => {
        const newChips = structuredClone(chips).filter(c => c != item) || []
        setChips(newChips)
    }

    function handleInputChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const val = event.target.value
        const newChips = val.length == 0 ? [] : val.split(' ').filter(v => v.trim() != '')

        if (newChips.length > 3) {
            toast.remove()
            toast.error('Only upto 3 skills allowed')
            return
        }

        setTxt(val)
        setChips(newChips)
        onChange(newChips)
    }

    return (
        <TextField required={required} fullWidth label={placeholder} value={txt} variant='outlined' onChange={handleInputChange} InputProps={{
            startAdornment: chips.length == 0 ? undefined : chips.map(item => (
                <Chip
                    key={item}
                    tabIndex={-1}
                    label={item}
                    className='space-x-2 mx-2'
                    onDelete={handleDelete(item)}
                />
            ))
        }}/>
    )
}

export default TagsInput