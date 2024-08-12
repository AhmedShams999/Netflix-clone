import { fetchFromTMDB } from "../services/tmdb.service.js"

export const getPersonDetails = async (req,res)=>{

  try {
    const {id} = req.params
    const data = await fetchFromTMDB(`https://api.themoviedb.org/3/person/${id}?language=en-US`)

    res.status(200).json({success: true, content: data} )

  } catch (error) {
    console.log("Error in getPersonDetails controller",error.message)
    res.status(500).json({success: false, message: "Internal server error"})
  }
}
export const getPersonCredits = async (req,res)=>{

  try {
    const {id} = req.params
    const data = await fetchFromTMDB(`https://api.themoviedb.org/3/person/${id}/combined_credits?language=en-US`)

    res.status(200).json({success: true, content: data.cast} )

  } catch (error) {
    if(error.message.includes("404")){
      return res.status(404).send(null)
    }
    console.log("Error in getPersonCredits controller",error.message)
    res.status(500).json({success: false, message: "Internal server error"})
  }
}
export const getPersonSocial = async (req,res)=>{

  try {
    const {id} = req.params
    const data = await fetchFromTMDB(`https://api.themoviedb.org/3/person/${id}/external_ids`)

    res.status(200).json({success: true, socials: data} )

  } catch (error) {
    console.log("Error in getPersonSocial controller",error.message)
    res.status(500).json({success: false, message: "Internal server error"})
  }
}