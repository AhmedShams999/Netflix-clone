import { User } from "../models/user.model.js"
import { fetchFromTMDB } from "../services/tmdb.service.js"

export const searchPerson = async (req,res)=>{
  const {query} = req.params
  const user = req.user
  try {
    const data = await fetchFromTMDB(`https://api.themoviedb.org/3/search/person?query=${query}&include_adult=false&language=en-US&page=1`)
    
    if(data.results.length === 0){
     return res.status(404).send(null)
    }

    await User.findByIdAndUpdate(user._id,{
      $push:{
        searchHistory: {
          id: data.results[0].id,
          image: data.results[0].profile_path,
          title: data.results[0].name,
          searchType: "person",
          createdAt: new Date()
        }
      }
    })

    res.status(200).json({success: true, content: data.results} )

  } catch (error) {
    console.log("Error in searchPerson controller",error.message)
    res.status(500).json({success: false, message: "Internal server error"})
  }
}
export const searchMovie = async (req,res)=>{
  const {query} = req.params
  const user = req.user
  try {
    const data = await fetchFromTMDB(`https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=1`)
    
    if(data.results.length === 0){
     return res.status(404).send(null)
    }

    await User.findByIdAndUpdate(user._id,{
      $push:{
        searchHistory: {
          id: data.results[0].id,
          image: data.results[0].poster_path,
          title: data.results[0].title,
          searchType: "movie",
          createdAt: new Date()
        }
      }
    })

    res.status(200).json({success: true, content: data.results} )
  } catch (error) {
    console.log("Error in searchMovie controller",error.message)
    res.status(500).json({success: false, message: "Internal server error"})
  }
}
export const searchTv = async (req,res)=>{
  const {query} = req.params
  const user = req.user
  try {
    const data = await fetchFromTMDB(`https://api.themoviedb.org/3/search/tv?query=${query}&include_adult=false&language=en-US&page=1`)
    
    if(data.results.length === 0){
     return res.status(404).send(null)
    }

    await User.findByIdAndUpdate(user._id,{
      $push:{
        searchHistory: {
          id: data.results[0].id,
          image: data.results[0].poster_path,
          title: data.results[0].name,
          searchType: "tv",
          createdAt: new Date()
        }
      }
    })

    res.status(200).json({success: true, content: data.results} )
  } catch (error) {
    console.log("Error in searchTv controller",error.message)
    res.status(500).json({success: false, message: "Internal server error"})
  }
}

export const getAllSearchHistory = async (req,res)=>{
  try {
    res.status(200).json({success: true, content: req.user.searchHistory} )
  } catch (error) {
    console.log("Error in getAllSearchHistory controller",error.message)
    res.status(500).json({success: false, message: "Internal server error"})
  }
}

export const deleteItemFromSearchHistory = async (req,res)=>{
  let {id} = req.params
  const user = req.user

  id = parseInt(id)

  try {
   
    await User.findByIdAndUpdate(user._id,{
      $pull:{
        searchHistory: {id:id}
      }
    })

    res.status(200).json({success: true, message: "Element deleted"} )
  } catch (error) {
    console.log("Error in deleteItemFromSearchHistory controller",error.message)
    res.status(500).json({success: false, message: "Internal server error"})
  }
}

export const deleteAllSearchHistory = async (req,res)=>{
  const user = req.user
  try {
    await User.findByIdAndUpdate(user._id,{
      $set:{
        searchHistory: []
      }
    })
    
    res.status(200).json({success: true, message: "All history deleted"} )
  } catch (error) {
    console.log("Error in searchTv controller",error.message)
    res.status(500).json({success: false, message: "Internal server error"})
  }
}