import { Router } from "express";
import { profile } from "./user.service.js";
import { upload } from "../../services/multer.service.js";


const router=Router()

router.get("/" , (req,res,next)=>{
    const result  = profile(req.query.id)
    return res.status(200).json({message:"Profile" , result})
})
export default router


export const uploadImage = [
  upload.single("image"),
  (req, res) => {
    res.json({
      message: "Uploaded successfully",
      file: req.file,
    });
  },
];

export const getProfile = async (req, res, next) => {
  try {
    res.json({ user: req.user });
  } catch (err) {
    next(err);
  }
};

