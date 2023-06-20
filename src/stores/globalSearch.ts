import {create} from 'zustand'

interface GlobalSearchState {
    text: string,
    set: (text: string) => void,
}

const useGlobalSearch = create<GlobalSearchState>()((set) => ({
    text: '',
    set: (text) => set({text}),
}))

export default useGlobalSearch