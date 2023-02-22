import { configureStore } from '@reduxjs/toolkit'
import isReducer from '@/redux/features/isSlice'
export const store = configureStore({
    reducer: {
        isSlice: isReducer,
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch