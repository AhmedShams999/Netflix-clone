import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'

function LoginPage() {
  const [formData,setFormData] = useState({
    email: "",
    password: "",
  })
  const queryClient = useQueryClient()
  const {mutate:loginMutate,isPending} = useMutation({
    mutationFn: async()=>{
      try {
        const res = await axios.post("/api/v1/auth/login",formData)
        return res.data
      } catch (error) {
        throw new Error(error.response.data.message)
      }
    },
    onSuccess: ()=>{
      queryClient.invalidateQueries({queryKey:["authUser"]})
    },
    onError: (error)=>{
      toast.error(error.message)
    }
  })

  const handleSubmit = (e)=>{
    e.preventDefault()
    loginMutate()
  }

  const handleChange = (e)=>{
    const {name,value} = e.target
    setFormData({...formData, [name]:value})
  }
  return (
    <div className='h-screen w-full hero-bg'>
    <header className='max-w-6xl mx-auto flex items-center justify-between p-4'>
      <Link to={"/"}>
        <img src='/netflix-logo.png' alt='logo' className='w-52' />
      </Link>
    </header>

    <div className='flex justify-center items-center mt-20 mx-3'>
      <div className='w-full max-w-md p-8 space-y-6 bg-black/60 rounded-lg shadow-md'>
        <h1 className='text-center text-white text-2xl font-bold mb-4'>Login</h1>

        <form className='space-y-4' onSubmit={handleSubmit}>
          <div>
            <label htmlFor='email' className='text-sm font-medium text-gray-300 block'>
              Email
            </label>
            <input
              type='email'
              name='email'
              className='w-full px-3 py-2 mt-1 border border-gray-700 rounded-md bg-transparent text-white focus:outline-none focus:ring'
              placeholder='you@example.com'
              id='email'
              value={formData.email}
              onChange={(e) => handleChange(e)}
            />
          </div>

          <div>
            <label htmlFor='password' className='text-sm font-medium text-gray-300 block'>
              Password
            </label>
            <input
              type='password'
              name='password'
              className='w-full px-3 py-2 mt-1 border border-gray-700 rounded-md bg-transparent text-white focus:outline-none focus:ring'
              placeholder='••••••••'
              id='password'
              value={formData.password}
              onChange={(e) => handleChange(e)}
            />
          </div>

          <button
            className='w-full py-2 bg-red-600 text-white font-semibold rounded-md
            hover:bg-red-700
          '
   
          >
            {isPending ? "Loading..." : "Login"}
          </button>
        </form>
        <div className='text-center text-gray-400'>
          You don't have an account?{" "}
          <Link to={"/signup"} className='text-red-500 hover:underline'>
            Sign up
          </Link>
        </div>
      </div>
    </div>
  </div>
  )
}

export default LoginPage
