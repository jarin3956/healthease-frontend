import React,{createContext, useMemo, useContext} from 'react'
import { io } from 'socket.io-client'

const SocketContext = createContext(null)

export const useSocket = () => {
    const socket = useContext(SocketContext)
    return socket;
}

export const SocketProvider = (props) => {
    //const socket = useMemo(() => io('localhost:3001'),[] )
    // const socket = useMemo(() => io('eniacecommerce.online'),[] )
    // const socket = useMemo(() => io('https://healthease-backend-bknf.onrender.com/'),[] )
     const socket = useMemo(() => io('healtheasebackend.online/'),[] )
    
  return (
    <SocketContext.Provider value={socket} > 
        {props.children}
    </SocketContext.Provider>
  )
}

