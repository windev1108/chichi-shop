import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from '@/redux/store'
import { Cart } from '@/utils/types'

// Define a type for the slice state
interface orderState {
    orderModal: {
        isOpen: boolean,
        cart: Cart[]
    }
}

// Define the initial state using that type
const initialState: orderState = {
    orderModal: {
        isOpen: false,
        cart: []
    }
}

export const orderSlice = createSlice({
    name: 'orderSlice',
    initialState,
    reducers: {
        setOrderModal: (state, action) => {
            state.orderModal = action.payload
        }
    },
})

export const { setOrderModal } = orderSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectOrderSlice = (state: RootState) => state.orderSlice

export default orderSlice.reducer