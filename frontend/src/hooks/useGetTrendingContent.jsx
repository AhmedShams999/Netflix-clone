import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useAuth } from '../App'

function useGetTrendingContent() {
  const [trendingContent,setTrendingContent] = useState(null)
  const {contentType} = useAuth()

  useEffect(()=>{
      const getTrendingContent = async ()=>{
        const res = await axios.get(`/api/v1/${contentType}/trending`)

        setTrendingContent(res.data.content)
      }
      getTrendingContent()
  },[contentType]) 

  return {trendingContent}

}

export default useGetTrendingContent
