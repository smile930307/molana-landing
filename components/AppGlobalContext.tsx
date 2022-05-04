/* eslint-disable no-empty-function */
/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext, ReactNode, useContext, useState } from 'react'

export interface MyContextType {
  value: any
  setValue: (val: any) => void
  // account: any
  // setTraderAccount: (val: any) => void
}

const initialMyContext: MyContextType = {
  value: null,
  setValue: (val: any) => {}
  // account: null,
  // setTraderAccount: (val: any) => { }
}

type Props = {
  children: ReactNode
}

const AuthContext = createContext<MyContextType>(initialMyContext)

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }: Props) {
  const [value, setData] = useState<any>(null)
  // const [account, setAccount] = useState<any>(null)

  const setValue = (val: any) => {
    setData(val)
  }

  // const setTraderAccount = (ac: any) => {
  //   setAccount(ac)
  // }

  const value2 = {
    value,
    // account,
    setValue
    // ,
    // setTraderAccount
  }

  return (
    <>
      <AuthContext.Provider value={value2}>{children}</AuthContext.Provider>
    </>
  )
}
