import React from 'react'
import { useAccount } from "../AccountContext";
const Doctor = () => {
  const { account, setAccount, contract, setContract } = useAccount()
  return (
    <div className='min-h-screen bg-gray-900 text-white px-8 py-16'>
      Account is : {account}
    </div>
  )
}

export default Doctor