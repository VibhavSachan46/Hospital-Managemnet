import React from 'react'
import { useAccount } from "../AccountContext";
const Doctor = () => {
  const { account, setAccount, contract, setContract } = useAccount()
  return (
    <div className='text-4xl'>
      Account is : {account}
    </div>
  )
}

export default Doctor