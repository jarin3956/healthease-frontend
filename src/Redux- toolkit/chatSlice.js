import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    chatRoomId: null,
}

const chatSlice = createSlice({
    name: 'chatRoomId',
    initialState,
    reducers: {
        addChatRoomId: (state, action) => {
            state.chatRoomId = action.payload;
            console.log(state.chatRoomId, "chatRoomId");
        },
        removeChatRoomId: (state, action) => {
            state.chatRoomId = null
        }
    },
})

export const { addChatRoomId , removeChatRoomId } = chatSlice.actions
export default chatSlice.reducer