import express from "express"
import { getChallenges, getUserChallenges, likeChallenge } from "../controllers/challenges.js"
import { verifyToken } from "../middleware/auth.js"

const router = express.Router()

//Reads
router.get("/", verifyToken, getChallenges)
router.get("/:userId/challenges", verifyToken, getUserChallenges)

//Updates
router.patch("/:id/like", verifyToken, likeChallenge)

export default router