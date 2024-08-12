import { Loader } from 'lucide-react'
import React from 'react'

function Spinner() {
  return (
    <div className='h-screen w-full'>
      <div className='flex justify-center items-center bg-black h-full'>
        <Loader className='animate-spin text-red-600 size-10' />
      </div>
    </div>
  )
}

export default Spinner
