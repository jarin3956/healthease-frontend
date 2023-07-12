import { configureStore }  from '@reduxjs/toolkit'
import scheduleSlice from "../Redux- toolkit/authslice"
import { persistStore,persistReducer } from 'redux-persist'
import  storage  from 'redux-persist/lib/storage'

const persistConfig = {
    key: "root",
    version:1,
    storage,
}
const persistedReducer = persistReducer(persistConfig,scheduleSlice)

const store = configureStore ({
    reducer:persistedReducer,   
})

const persistor = persistStore(store);

export { store, persistor };