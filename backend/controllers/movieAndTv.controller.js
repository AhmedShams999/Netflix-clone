import { fetchFromTMDB } from "../services/tmdb.service.js"

export const getTrending = async(req,res,type)=>{
 try {
   const data = await fetchFromTMDB(`https://api.themoviedb.org/3/trending/${type}/day?language=en-US`)

   const randomMovie = data.results[Math.floor(Math.random() * data.results?.length)]

   return res.status(200).json({success: true, content: randomMovie})

 } catch (error) {
  console.log("Error in getTrending controller",error.message)
  res.status(500).json({success: false, message: "Internal server error"})
 }
}

export const getTrailers = async(req,res,type)=>{
 try {
   const {id} = req.params

   const data = await fetchFromTMDB(`https://api.themoviedb.org/3/${type}/${id}/videos?language=en-US`)


   return res.status(200).json({success: true, trailers: data.results})

 } catch (error) {
  if(error.message.includes("404")){
    return res.status(404).send(null)
  }
  console.log("Error in getTrailers controller",error.message)
  res.status(500).json({success: false, message: "Internal server error"})
 }
}

export const getDetails = async(req,res,type)=>{
 try {
   const {id} = req.params

   const data = await fetchFromTMDB(`https://api.themoviedb.org/3/${type}/${id}?language=en-US`)


   return res.status(200).json({success: true, details: data})

 } catch (error) {
  if(error.message.includes("404")){
    return res.status(404).send(null)
  }
  console.log("Error in getDetails controller",error.message)
  res.status(500).json({success: false, message: "Internal server error"})
 }
}

export const getSimilar= async(req,res,type)=>{
 try {
   const {id} = req.params

   const data = await fetchFromTMDB(`https://api.themoviedb.org/3/${type}/${id}/similar?language=en-US&page=1`)


   return res.status(200).json({success: true, similar: data.results})

 } catch (error) {
  if(error.message.includes("404")){
    return res.status(404).send(null)
  }
  console.log("Error in getSimilar controller",error.message)
  res.status(500).json({success: false, message: "Internal server error"})
 }
}

export const getByCategory = async(req,res,type)=>{
 try {
   const {category} = req.params

   const data = await fetchFromTMDB(`https://api.themoviedb.org/3/${type}/${category}?language=en-US&page=1`)


   return res.status(200).json({success: true, content: data.results})

 } catch (error) {
  console.log("Error in getByCategory controller",error.message)
  res.status(500).json({success: false, message: "Internal server error"})
 }
}