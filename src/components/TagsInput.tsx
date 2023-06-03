import React, {useState} from "react";
import {Chip, TextField} from "@mui/material";
import {type NextPage} from "next";

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
        setTxt(val)
        const newChips = val.length == 0 ? [] : val.split(' ')
        setChips(newChips)
        onChange(newChips)
    }

    return (
        <TextField
            fullWidth
            label={placeholder}
            variant="outlined"
            value={txt}
            onChange={handleInputChange}
            InputProps={{
                startAdornment: chips.length==0 ? undefined : chips.map(item => (
                    <Chip
                        key={item}
                        tabIndex={-1}
                        label={item}
                        className='space-x-2 mx-2'
                        onDelete={handleDelete(item)}
                    />
                )),
            }}
        />
    );
}

export default TagsInput