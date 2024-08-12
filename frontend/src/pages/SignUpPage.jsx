import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'

function SignUpPage() {
  const {searchParams} = new URL(document.location)
  const emailValue = searchParams.get("email") 
  const queryClient = useQueryClient()

  const [formData,setFormData] = useState({
    email: emailValue || "",
    password: "",
    username: "",
  })

  const {mutate:signUpMutate,isPending} = useMutation({
    mutationFn: async()=>{
      try {
        const res = await axios.post("/api/v1/auth/signup",formData)
        return res.data
      } catch (error) {
        throw new Error(error.response.data.message)
      }
    },
    onSuccess: ()=>{
        queryClient.invalidateQueries({queryKey:["authUser"]})
    },
    onError: (error,context)=>{
      toast.error(error.message)
    }
  })

  const handleSubmit = (e)=>{
    e.preventDefault()
    signUpMutate()
    // console.log(formData)
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
        <h1 className='text-center text-white text-2xl font-bold mb-4'>Sign Up</h1>

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
            <label htmlFor='username' className='text-sm font-medium text-gray-300 block'>
              Username
            </label>
            <input
              type='text'
              name='username'
              className='w-full px-3 py-2 mt-1 border border-gray-700 rounded-md bg-transparent text-white focus:outline-none focus:ring'
              placeholder='johndoe'
              id='username'
              value={formData.username}
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
            {isPending ? "Loading..." : "Sign Up"}
          </button>
        </form>
        <div className='text-center text-gray-400'>
          Already a member?{" "}
          <Link to={"/login"} className='text-red-500 hover:underline'>
            Sign in
          </Link>
        </div>
      </div>
    </div>
  </div>
  )
}

export default SignUpPage
