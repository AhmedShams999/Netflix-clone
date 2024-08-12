import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import { useAuth } from '../App';
import { Search } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ORIGINAL_IMAGES_SIZE_BASE_URL } from '../utils/constants';
import { Link } from 'react-router-dom';

const fetchData = async () => {
  const { data } = await axios.get('https://api.example.com/data');
  return data;
};


function SearchPage() {
  const [activeTab, setActiveTab] = useState("movie");
	const [searchTerm, setSearchTerm] = useState("");
  const [enabled,setEnabled] = useState(false)

	const [results, setResults] = useState([]);
	const {setContentType} = useAuth();

  const {data:fetchSearch,isLoading,refetch}= useQuery({
    queryKey: ["search"],
    queryFn: async()=>{
      try {
        const res = await axios.get(`/api/v1/search/${activeTab}/${searchTerm}`)
        setResults(res.data.content)
        return res.data.content
      } catch (error) {
        if(error.message.includes("404")){
          toast.error("Nothing found, make sure you are searching under the right category");
        }else{
          toast.error("An error occurred, please try again later");
        }
      }

    },
    enabled:enabled
  })
  const handleTabClick = (tab)=>{
    setActiveTab(tab)
    tab === "movie" ? setContentType("movie") : setContentType("tv")
    setResults([])
  }
  // console.log(results)
  const handleSearch = (e)=>{
    e.preventDefault()
    setEnabled(true)
    refetch()
  }

  return (
    <div className='bg-black min-h-screen text-white'>
      <Navbar />
      <div className='container mx-auto px-4 py-8'>
          <div className='flex justify-center gap-3 mb-4'>
              <button
                className={`py-2 px-4 rounded 
                  ${activeTab === "movie"? "bg-red-600":"bg-gray-800"}
                    hover:bg-red-700`}
                onClick={()=>handleTabClick("movie")}
              >
                Moives
              </button>
              <button
                className={`py-2 px-4 rounded 
                  ${activeTab === "tv"? "bg-red-600":"bg-gray-800"}
                    hover:bg-red-700`}
                onClick={()=>handleTabClick("tv")}
              >
                Tv Shows
              </button>
              <button
                className={`py-2 px-4 rounded 
                  ${activeTab === "person"? "bg-red-600":"bg-gray-800"}
                    hover:bg-red-700`}
                onClick={()=>handleTabClick("person")}
              >
                Person
              </button>
          </div>

          <form className='flex gap-2 items-stretch mb-8 max-w-2xl mx-auto' onSubmit={handleSearch}>
              <input 
                type="text"
                value={searchTerm}
                onChange={(e)=> setSearchTerm(e.target.value)}
                placeholder={`Search for a ${activeTab}`}
                className='w-full p-2 bg-gray-800 text-white' 
              />
              <button className='bg-red-600 hover:bg-red-700 text-white p-2 rounded'>
                <Search className='w-6 h-6'/>
              </button>

          </form>

          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
              {results?.map(result =>{
                if(!result.profile_path && !result.poster_path) return null

                const personImage = ORIGINAL_IMAGES_SIZE_BASE_URL + result.profile_path 
                const posterImage = ORIGINAL_IMAGES_SIZE_BASE_URL + result.poster_path
                return(
                    <div key={result.id} className='bg-gray-800 p-4 rounded'>
                      {activeTab === "person" ? (
                    <Link to={`/person/${result.name}/${result.id}`} className='flex flex-col items-center'>
                      <img
                        src={personImage}
                        alt={result.name}
                        className='max-h-96 rounded mx-auto'
                      />
                      <h2 className='mt-2 text-xl font-bold'>{result.name}</h2>
                    </Link>
                  ) : (
                    <Link
                      to={"/watch/" + result.id}
                      onClick={() => {
                        setContentType(activeTab);
                      }}
                    >
                      <img
                        src={posterImage}
                        alt={result.title || result.name}
                        className='w-full h-auto rounded'
                      />
                      <h2 className='mt-2 text-xl font-bold'>{result.title || result.name}</h2>
                    </Link>
                  )}
                  </div>
                )

              })}

          </div>
      </div>
    </div>
  )
}

export default SearchPage
