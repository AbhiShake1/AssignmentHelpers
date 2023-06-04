import React from "react";
import {type NextPage} from "next";
import {toast} from "react-hot-toast";
import {MuiChipsInput} from "mui-chips-input";

interface TagPropType {
    onChange: (selectedTags: string[]) => void,
    label: string
    required: boolean
    limit?: number
    value?: string[]
}

const TagsInput: NextPage<TagPropType, {
    tags: [],
    required: false,
    value: [],
}> = ({
          onChange,
          label,
          required,
          limit,
          value
      }) => {
    function handleInputChange(newChips: string[]) {
        if (limit && newChips.length > limit) {
            toast.remove()
            toast.error(`Only upto ${limit} ${label} allowed`)
            return
        }

        onChange(newChips)
    }

    return <MuiChipsInput value={value} onChange={handleInputChange} variant='outlined' label={label}
                          required={required}/>
}

export default TagsInput