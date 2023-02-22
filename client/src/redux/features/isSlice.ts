import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from '@/redux/store'

// Define a type for the slice state
interface isState {
    isUpdated: boolean
    isUpdateProfile: boolean,
    isOpenNavbarMobile: boolean
}

// Define the initial state using that type
const initialState: isState = {
    isUpdated: false,
    isUpdateProfile: false,
    isOpenNavbarMobile: false
}

export const counterSlice = createSlice({
    name: 'isSlice',
    initialState,
    reducers: {
        updateCart: (state) => {
            state.isUpdated = !state.isUpdated
        },
        updateProfile: (state) => {
            state.isUpdateProfile = !state.isUpdateProfile
        },
        toggleNavbarMobile: (state) => {
            state.isOpenNavbarMobile = !state.isOpenNavbarMobile
        }
    },
})

export const { updateCart , updateProfile , toggleNavbarMobile } = counterSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectIsSlice = (state: RootState) => state.isSlice

export default counterSlice.reducer