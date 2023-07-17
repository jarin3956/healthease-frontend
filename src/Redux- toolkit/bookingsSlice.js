import { createSlice } from  '@reduxjs/toolkit'

const initialState ={
    booking : null ,
}
const bookingSlice = createSlice({
    name:'booking',
    initialState,
    reducers: {
        addBooking: (state,action) => {
            state.booking = action.payload;
            console.log(state.booking,"redux booking");
        },
        removeBooking: (state,action) => {
            state.booking = null
        }
    },
})

export const { addBooking, removeBooking } = bookingSlice.actions
export default bookingSlice.reducer