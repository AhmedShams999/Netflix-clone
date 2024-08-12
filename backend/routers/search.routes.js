import express from "express"
import { deleteAllSearchHistory, deleteItemFromSearchHistory, getAllSearchHistory, searchMovie, searchPerson, searchTv } from "../controllers/search.controller.js"

const router = express.Router()

router.get("/person/:query",searchPerson)
router.get("/movie/:query",searchMovie)
router.get("/tv/:query",searchTv)

router.get("/history",getAllSearchHistory)
router.delete("/history/:id",deleteItemFromSearchHistory)
router.delete("/history/delete/All",deleteAllSearchHistory)

export default router