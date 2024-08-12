import express from "express"

import authRoutes from "./routers/auth.routes.js"
import movieRoutes from "./routers/movie.routes.js"
import tvRoutes from "./routers/tv.routes.js"
import searchRoutes from "./routers/search.routes.js"
import personRoutes from "./routers/person.routes.js"


import { ENV_VARS } from "./config/envVars.js"
import { connectDB } from "./config/db.js"
import protectRoutes from "./middleWare/protectRoutes.js"
import cookieParser from "cookie-parser"


const app = express()

const PORT = ENV_VARS.PORT

app.use(express.json())
app.use(cookieParser())

app.use("/api/v1/auth",authRoutes)
app.use("/api/v1/movie",protectRoutes,movieRoutes)
app.use("/api/v1/tv",protectRoutes,tvRoutes)
app.use("/api/v1/search",protectRoutes,searchRoutes)
app.use("/api/v1/person",protectRoutes,personRoutes)

app.listen(PORT,(req,res)=>{
  console.log("http://localhost:"+PORT)
  connectDB()
})

