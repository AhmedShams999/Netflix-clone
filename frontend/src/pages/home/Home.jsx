import { useQuery } from '@tanstack/react-query'
import React from 'react'
import HomePage from './HomePage'
import AuthPage from './AuthPage'

function Home ({user}){
  const { data: authUser, isLoading, isError, error } = useQuery({
    queryKey: ["authUser"],
  });

  // const authUser = false
  return (
    <>
      {authUser?.success? <HomePage /> : <AuthPage />}
    </>
  )
}

export default Home
