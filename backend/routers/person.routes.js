import express from "express"
import { getPersonCredits, getPersonDetails, getPersonSocial } from "../controllers/person.controller.js"

const router = express.Router()

router.get("/:id/details",getPersonDetails)
router.get("/:id/credits",getPersonCredits)
router.get("/:id/socials",getPersonSocial)


export default router