import React, {useState} from "react";
import {Chip, TextField} from "@mui/material";
import {type NextPage} from "next";
import {toast} from "react-hot-toast";
import {MuiChipsInput} from "mui-chips-input";

interface TagPropType {
    onChange: (selectedTags: string[]) => void,
    label: string
    required: boolean
    limit?: number
}

const TagsInput: NextPage<TagPropType, { tags: [], required: false }> = ({onChange, label, required, limit}) => {
    const [chips, setChips] = useState<string[]>([])

    function handleInputChange(newChips: string[]) {
        if (limit && newChips.length > limit) {
            toast.remove()
            toast.error(`Only upto ${limit} ${label} allowed`)
            return
        }

        setChips(newChips)
        onChange(newChips)
    }

    return <MuiChipsInput value={chips} onChange={handleInputChange} variant='outlined' label={label} required={required}/>
}

export default TagsInput