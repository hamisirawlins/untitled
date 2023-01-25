import Challenge from "../models/challenge.js"
import User from "../models/user.js"

//Create
export const createChallenge = async (req, res) => {
    try {
        const { userId, description, picturePath } = req.body
        const user = await User.findById(userId)
        const newChallenge = new Challenge({
            userId,
            firstName: user.firstName,
            lastName: user.lastName,
            location: user.location,
            description,
            userPicturePath: user.picturePath,
            picturePath,
            likes: {
            },
            comments: []
        })
        await newChallenge.save()
        const challenge = await Challenge.find()
        res.status(201).json(challenge)
    } catch (error) {
        res.status(409).json({ message: error.message })
    }
}

//Reads
export const getChallenges = async (req, res) => {
    try {
        const challenges = await Challenge.find()
        res.status(200).json(challenges)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

export const getUserChallenges = async (req, res) => {
    try {
        const { userId } = req.params
        const challenges = await Challenge.find({ userId })
        res.status(200).json(challenges)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

//Update
export const likeChallenge = async (req, res) => {
    try {
        const { id } = req.params
        const { userId } = req.body
        const challenge = await Challenge.findById(id)
        const isLiked = challenge.likes.get(userId)
        if (isLiked) {
            Challenge.likes.delete(userId)
        } else {
            Challenge.likes.set(userId, true)
        }
        const updatedChallenge = await Challenge.findByIdAndUpdate(id, { likes: challenge.likes }, { new: true })
        res.status(200).json(updatedChallenge)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}