import React, {useState} from "react";
import {Chip, TextField} from "@mui/material";
import {type NextPage} from "next";
import {toast} from "react-hot-toast";
import {MuiChipsInput} from "mui-chips-input";

interface TagPropType {
    onChange: (selectedTags: string[]) => void,
    placeholder: string
    required: boolean
    limit?: number
}

const TagsInput: NextPage<TagPropType, { tags: [], required: false }> = ({onChange, placeholder, required, limit}) => {
    const [chips, setChips] = useState<string[]>([])

    function handleInputChange(newChips: string[]) {
        if (limit && newChips.length > limit) {
            toast.remove()
            toast.error(`Only upto ${limit} allowed`)
            return
        }

        setChips(newChips)
        onChange(newChips)
    }

    return <MuiChipsInput value={chips} onChange={handleInputChange} variant='outlined' label={placeholder} required={required}/>
}

export default TagsInput