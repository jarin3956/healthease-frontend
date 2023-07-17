import { combineReducers, configureStore } from '@reduxjs/toolkit'
import scheduleSlice from "../Redux- toolkit/authslice"
import bookingSlice from '../Redux- toolkit/bookingsSlice'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const persistConfig = {
    key: "root",
    version: 1,
    storage
}

const rootReducer = combineReducers({
    schedule : scheduleSlice,
    bookings: bookingSlice,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)


const store = configureStore({
    reducer: persistedReducer,
})


const persistor = persistStore(store);

export { store, persistor }