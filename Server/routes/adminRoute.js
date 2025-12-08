import { Router } from "express"
import {
  checkAdmin,
  createAlbum,
  createSong,
  deleteAlbum,
  deleteSong,
  getUsers,
} from "../controllers/adminController.js"
import { auth, admin } from "../middleware/authMiddileware.js"

const router = Router()

router.use(auth, admin)

router.get("/check", checkAdmin)
router.get("/users", getUsers)

router.post("/songs", createSong)
router.delete("/songs/:id", deleteSong)

router.post("/albums", createAlbum)
router.delete("/albums/:id", deleteAlbum)

export default router
