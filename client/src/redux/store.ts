import { configureStore } from '@reduxjs/toolkit'
import isReducer from '@/redux/features/isSlice'
import orderReducer from '@/redux/features/orderSlice'
export const store = configureStore({
    reducer: {
        isSlice: isReducer,
        orderSlice: orderReducer
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch