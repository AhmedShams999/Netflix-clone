import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import { Trash } from 'lucide-react';
import { SMALL_IMAGES_SIZE_BASE_URL } from '../utils/constants';
import { formatDate } from '../utils/dataFunction';

function HistoryPage() {
  const [searchHistory, setSearchHistory] = useState([]);
  const [enabled, setEnabled] = useState(false);

  const {data:getAllHistory,isLoading,refetch:refetchAllHistory} = useQuery({
    queryKey: ["history"],
    queryFn: async()=>{
      try {
        const res = await axios.get("/api/v1/search/history")
        const uniqueArray = res.data.content.filter((item, index, self) =>
          index === self.findIndex((t) => (
            t.id === item.id
          ))
        );
        setSearchHistory(uniqueArray)
        return uniqueArray
      } catch (error) {
        if(error.message.includes("404")){
          toast.error("Nothing found, make sure you are searching under the right category");
        }else{
          toast.error("An error occurred, please try again later");
        }
      }
    }
  })

  const {mutate:handleDelete} = useMutation({
    mutationFn: async(entry)=>{
      try {
        const res = await axios.delete(`/api/v1/search/history/${entry.id}`)
        return res.data.message
      } catch (error) {
        toast.error("Failed to delete search history");
      }
    },
    onSuccess:()=>{
      refetchAllHistory()
    }
  })
  const {mutate:handleDeleteAll} = useMutation({
    mutationFn: async(entry)=>{
      try {
        const res = await axios.delete(`/api/v1/search/history/delete/All`)
        setSearchHistory([])
        return res.data.message
      } catch (error) {
        toast.error("Failed to delete search history");
      }
    },
    onSuccess:()=>{
      refetchAllHistory()
    }
  })

  // const handleDelete = ()=>{
  //   delateOneHistory()
  // }

  if (searchHistory?.length === 0) {
		return (
			<div className='bg-black min-h-screen text-white'>
				<Navbar />
				<div className='max-w-6xl mx-auto px-4 py-8'>
          <h1 className='text-3xl font-bold mb-8'>Search History</h1>
      
					<div className='flex justify-center items-center h-96'>
						<p className='text-xl'>No search history found</p>
					</div>
				</div>
			</div>
		);
	}

  return (
    <div className='bg-black text-white min-h-screen'>
    <Navbar />

    <div className='max-w-6xl mx-auto px-4 py-8'>
      <div className='flex justify-between items-center'>
        <h1 className='text-3xl font-bold mb-8'>Search History</h1>
        <p className='cursor-pointer hover:text-red-700' onClick={handleDeleteAll}>Clear History</p>
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3  gap-4'>
        {searchHistory?.map((entry) => (
          <div key={entry.id} className='bg-gray-800 p-4 rounded flex items-start'>
            <img
              src={SMALL_IMAGES_SIZE_BASE_URL + entry.image}
              alt='History image'
              className='size-16 rounded-full object-cover mr-4'
            />
            <div className='flex flex-col'>
              <span className='text-white text-lg'>{entry.title}</span>
              <span className='text-gray-400 text-sm'>{formatDate(entry.createdAt)}</span>
            </div>

            <span
              className={`py-1 px-3 min-w-20 text-center rounded-full text-sm  ml-auto ${
                entry.searchType === "movie"
                  ? "bg-red-600"
                  : entry.searchType === "tv"
                  ? "bg-blue-600"
                  : "bg-green-600"
              }`}
            >
              {entry.searchType[0].toUpperCase() + entry.searchType.slice(1)}
            </span>
            <Trash
              className='size-5 ml-4 cursor-pointer hover:fill-red-600 hover:text-red-600'
              onClick={() => handleDelete(entry)}
            />
          </div>
        ))}
      </div>
    </div>
  </div>
  )
}

export default HistoryPage
