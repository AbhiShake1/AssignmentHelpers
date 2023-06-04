import React, {useState} from "react";
import {Chip, TextField} from "@mui/material";
import {type NextPage} from "next";
import {Input} from "@mui/joy";
import {toast} from "react-hot-toast";
import {MuiChipsInput} from "mui-chips-input";

interface TagPropType {
    onChange: (selectedTags: string[]) => void,
    placeholder: string
    required: boolean
}

const TagsInput: NextPage<TagPropType, { tags: [], required: false }> = ({onChange, placeholder, required}) => {
    const [chips, setChips] = useState<string[]>([])

    function handleInputChange(newChips: string[]) {
        if (newChips.length > 3) {
            toast.remove()
            toast.error('Only upto 3 skills allowed')
            return
        }

        setChips(newChips)
        onChange(newChips)
    }

    return <MuiChipsInput value={chips} onChange={handleInputChange} variant='outlined' label={placeholder} required={required} inputValue={'sjao'}/>
}

export default TagsInput