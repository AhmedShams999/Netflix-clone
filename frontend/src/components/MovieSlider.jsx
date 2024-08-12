import React, { useEffect, useRef, useState } from 'react'
import { useAuth } from '../App'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { SMALL_IMAGES_SIZE_BASE_URL } from '../utils/constants'
import { ChevronLeft, ChevronRight } from 'lucide-react'

function MovieSlider({categorie}) {
  const {contentType} = useAuth()
  const [content, setContent] = useState([]);
  const [showArrows, setShowArrows] = useState(false);
  const sliderRef = useRef(null)

  const formatedCategorieName = categorie.replaceAll("_"," ")[0].toUpperCase() + categorie.replaceAll("_"," ").slice(1)
  const formatedContentType = contentType === "movie"? "Movies" : "TV Shows"
 
  const scrollLeft = ()=>{
    if(sliderRef.current){
      sliderRef.current.scrollBy({left:-sliderRef.current.offsetWidth,behavior: "smooth"})
    }
  }
  const scrollRight = ()=>{
    sliderRef.current.scrollBy({left: sliderRef.current.offsetWidth,behavior: "smooth"})
  }

  useEffect(()=>{
    const getContent = async ()=>{
      try {
        const res = await axios.get(`/api/v1/${contentType}/${categorie}`)
        setContent(res.data.content)
      } catch (error) {
        throw new Error(error.response.data.message)
      }
    }
    getContent()
  },[contentType,categorie])
  

  return (
    <div 
      className='bg-black text-white relative px-5 md:px-20'
      onMouseEnter={()=> setShowArrows(true)}
      onMouseLeave={()=> setShowArrows(false)}
    >
      <h2 className='mb-4 text-2xl font-bold'>
        {formatedCategorieName} {formatedContentType}
      </h2>

      <div className='flex space-x-4 overflow-x-scroll scrollbar-hide' ref={sliderRef}> 
          {content.map((item)=>(
            <Link to={`/watch/${item.id}`} key={item.id} className='min-w-[250px] relative group'>
              <div className='rounded-lg overflow-hidden'>
                  <img src={SMALL_IMAGES_SIZE_BASE_URL+item.backdrop_path} alt="Movie Image" 
                    className='transition-transform duration-300 ease-in-out group-hover:scale-125'
                  />

              </div>
              <p className='mt-2 text-center'>
                 {item.title || item.name}
              </p>
            </Link>
          ))}
      </div>
      
      {showArrows&&(
        <>
          <button
            className='absolute top-1/2 -translate-y-1/2 left-5 md:left-24 flex items-center justify-center
            size-12 rounded-full bg-black bg-opacity-50 hover:bg-opacity-75 text-white z-10'

            onClick={scrollLeft}
          >
              <ChevronLeft size={24}/>
          </button>
          <button
            className='absolute top-1/2 -translate-y-1/2 right-5 md:right-24 flex items-center justify-center
            size-12 rounded-full bg-black bg-opacity-50 hover:bg-opacity-75 text-white z-10'

            onClick={scrollRight}
          >
              <ChevronRight size={24}/>
          </button>
        </>
      )}
    </div>
  )
}

export default MovieSlider
