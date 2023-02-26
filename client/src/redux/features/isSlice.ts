import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from '@/redux/store'

// Define a type for the slice state
interface isState {
    isUpdatedCard: boolean
    isUpdateProfile: boolean,
    isOpenNavbarMobile: boolean,
    isOpenBackdrop: boolean
}

// Define the initial state using that type
const initialState: isState = {
    isUpdatedCard: false,
    isUpdateProfile: false,
    isOpenNavbarMobile: false,
    isOpenBackdrop: false
}

export const counterSlice = createSlice({
    name: 'isSlice',
    initialState,
    reducers: {
        updateCart: (state) => {
            state.isUpdatedCard = !state.isUpdatedCard
        },
        updateProfile: (state) => {
            state.isUpdateProfile = !state.isUpdateProfile
        },
        toggleNavbarMobile: (state) => {
            state.isOpenNavbarMobile = !state.isOpenNavbarMobile
        },
        toggleBackdrop: (state) => {
            state.isOpenBackdrop = !state.isOpenBackdrop
        }
    },
})

export const { updateCart, updateProfile, toggleNavbarMobile, toggleBackdrop } = counterSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectIsSlice = (state: RootState) => state.isSlice

export default counterSlice.reducer