import { createSlice } from  '@reduxjs/toolkit'

const initialState ={
    schedule : null ,
}
const scheduleSlice = createSlice({
    name:'schedule',
    initialState,
    reducers: {
        addSchedule: (state,action) => {
            state.schedule = action.payload;
            console.log(state.schedule,"redux");
        },
        removeSchedule: (state,action) => {
            state.schedule = null
        }
    },
})

export const { addSchedule, removeSchedule } = scheduleSlice.actions
export default scheduleSlice.reducer