import React, { useEffect, useRef } from 'react'
import Navbar from '../components/Navbar'
import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { ORIGINAL_IMAGES_SIZE_BASE_URL, SMALL_IMAGES_SIZE_BASE_URL } from '../utils/constants'
import { ChevronLeft, ChevronRight, Facebook, Instagram, Twitter } from 'lucide-react'

function PersonPage() {
  const {id,name} = useParams()
  const sliderRef = useRef(null)

  const {data:getPersonDetails,isLoading:personDetailsLoading,refetch:refetchDetails} = useQuery({
    queryKey: ["personDetails"],
    queryFn: async()=>{
      try {
        const res = await axios.get(`/api/v1/person/${id}/details`)
        return res.data.content 
      } catch (error) {
        if(error.message.includes("404")){
          toast.error("Nothing found, make sure you are searching under the right category");
        }else{
          toast.error("An error occurred, please try again later");
        }
      }
    }
  })

  const {data:getPersonSocials,isLoading:personSocialsLoading,refetch:refetchSocials} = useQuery({
    queryKey: ["personSocials"],
    queryFn: async()=>{
      try {
        const res = await axios.get(`/api/v1/person/${id}/socials`)
        return res.data.socials 
      } catch (error) {
        if(error.message.includes("404")){
          toast.error("Nothing found, No socials found");
        }else{
          toast.error("An error occurred, please try again later");
        }
      }
    }
  })
  const {data:getPersonCredits,isLoading:personCreditsLoading,refetch:refetchCredits} = useQuery({
    queryKey: ["personCredits"],
    queryFn: async()=>{
      try {
        const res = await axios.get(`/api/v1/search/person/${name}`)
        // const res = await axios.get(`/api/v1/person/${id}/credits`)
        const correctPerson = res.data.content.filter(person => person.id === parseInt(id))
        return correctPerson[0].known_for

      } catch (error) {
        if(error.message.includes("404")){
          return []
        }else{
          toast.error("An error occurred, please try again later");
        }
      }
    }
  })

  const gender = getPersonDetails?.gender === 1 ? "Female" :  getPersonDetails?.gender === 2 ? "Male" : "Unknown"
  

  const scrollLeft = ()=>{
    if(sliderRef.current){
      sliderRef.current.scrollBy({left:-sliderRef.current.offsetWidth,behavior: "smooth"})
    }
  }
  const scrollRight = ()=>{
    sliderRef.current.scrollBy({left: sliderRef.current.offsetWidth,behavior: "smooth"})
  }

  useEffect(()=>{
    Promise.all([refetchDetails(),refetchSocials(),refetchCredits()])
  },[id])
  // console.log(getPersonSocials)
  // console.log(getPersonDetails)
  // console.log(getPersonCredits)

  return (
    <div className='bg-black min-h-screen text-white'>
        <Navbar />


        <div className='flex flex-col md:flex-row items-center justify-between gap-20 
				max-w-6xl mx-auto mt-4'>
            <div className='mb-5 md:mb-0 flex-[2]'>
                <h2 className='text-5xl font-bold text-balance'> {getPersonDetails?.name} </h2>
          
                <p className='mt-2 text-sm text-red-700 font-bold'>Birthday : <span className='text-white font-normal'>{getPersonDetails?.birthday}</span></p>
                {getPersonDetails?.deathday && <p className='mt-2 text-sm text-red-700 font-bold'>Deathday :  <span className='text-white font-normal'>{getPersonDetails?.deathday}</span></p>}
                <p className='mt-2 text-sm text-red-700 font-bold'>Gender : <span className='text-white font-normal'>{gender}</span></p>
                <p className='mt-2 text-sm text-red-700 font-bold'>Place Of Birth : <span className='text-white font-normal'>{getPersonDetails?.place_of_birth}</span></p>
                
                
                <p className='mt-4 max-h-[525px] overflow-y-scroll text-lg'>{getPersonDetails?.biography}</p>

            </div>
            <div className='flex flex-col flex-1 gap-4'>
              <img
                src={ORIGINAL_IMAGES_SIZE_BASE_URL + getPersonDetails?.profile_path}
                alt='Hero img'
                className='rounded-md h-auto' 
                // onLoad={()=>{
                  //   setImageIsLoading(false)
                  // }}
                  />
                <div className='flex items-center justify-evenly'>
                    {getPersonSocials?.facebook_id&&<a href={`https://www.facebook.com/${getPersonSocials?.facebook_id}`} target='_blank'><Facebook /></a>}
                    {getPersonSocials?.twitter_id&&<a href={`https://x.com/${getPersonSocials?.twitter_id}`} target='_blank'><Twitter /></a>}
                    {getPersonSocials?.instagram_id&&<a href={`https://www.instagram.com/${getPersonSocials?.instagram_id}`} target='_blank'><Instagram /></a>}
                    {getPersonSocials?.tiktok_id&&<a href={`https://www.tiktok.com/@${getPersonSocials?.tiktok_id}`} target='_blank'><img src="/tiktok-icon.svg" alt="tiktok-icon" /></a>}
                </div>
            </div>
        </div>

        <div className='my-5 h-1 w-full bg-[#232323] max-w-6xl m-auto' aria-hidden='true' />
        
        <div className='mt-12 max-w-5xl mx-auto relative'>    
          <h2 className='text-5xl mb-5 font-bold text-balance'> Known For </h2>
          <div className='flex overflow-x-scroll scrollbar-hide gap-4 pb-4 group' ref={sliderRef}>
                {getPersonCredits?.map((content)=>(
                  <Link to={`/watch/${content?.id}`} key={content?.id} className='w-32 flex-none'>
                      <img src= {SMALL_IMAGES_SIZE_BASE_URL + content?.poster_path}  alt="poster path" className={`w-full h-auto rounded-md`} />
                      <h4>
                        {content?.title || content?.name}
                      </h4>
                  </Link>
                ))}

                <ChevronRight
                  className='absolute top-1/2 -translate-y-1/2 right-2 w-8 h-8
                      opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer
                      bg-red-600 text-white rounded-full'
                  onClick={scrollRight}
                />
                <ChevronLeft
                  className='absolute top-1/2 -translate-y-1/2 left-2 w-8 h-8 opacity-0 
                  group-hover:opacity-100 transition-all duration-300 cursor-pointer bg-red-600 
                  text-white rounded-full'
                  onClick={scrollLeft}
                />
              </div>

            </div>
    
    </div>
  )
}

export default PersonPage
