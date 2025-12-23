import express from 'express';
import {
  signupController,
  loginController,
  logoutController,
  updateDataController,
} from '#controllers/auth.controller.js';
import { authenticateToken } from '#middleware/auth.middleware.js';

const router = express.Router();

router.post('/signup', signupController);
router.post('/login', loginController);
router.post('/logout', authenticateToken, logoutController);

router.put('/updateData', authenticateToken, updateDataController);

// router.post("/addAdress",protectedRoute,addAdressController)
// router.put("/updateAdress",protectedRoute,updateAdressController)

// router.get("/me",protectedRoute,(req,res)=>{
//     res.status(200).json({success:true,user:req.user})
// })

export default router;
