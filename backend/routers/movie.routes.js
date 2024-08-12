import express from "express"
import { getDetails, getByCategory, getTrailers, getSimilar, getTrending } from "../controllers/movieAndTv.controller.js"

const router = express.Router()

router.get("/trending",(req,res)=>getTrending(req,res,"movie"))
router.get("/:id/trailers",(req,res)=>getTrailers(req,res,"movie"))
router.get("/:id/details",(req,res)=>getDetails(req,res,"movie"))
router.get("/:id/similar",(req,res)=>getSimilar(req,res,"movie"))
router.get("/:category",(req,res)=>getByCategory(req,res,"movie"))

export default router