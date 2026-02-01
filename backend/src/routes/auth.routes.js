import express from 'express';
import {
  signupController,
  loginController,
  logoutController,
  updateDataController,
  addAddressController,
  updateAddressController,
  getAddressController
} from '#controllers/auth.controller.js';
import { authenticateToken } from '#middleware/auth.middleware.js';

const router = express.Router();

router.post('/signup', signupController);
router.post('/login', loginController);
router.post('/logout', authenticateToken, logoutController);

router.patch('/updateData', authenticateToken, updateDataController);

router.get("/getAddress",authenticateToken,getAddressController)
router.post("/addAddress",authenticateToken,addAddressController)
router.put("/updateAddress",authenticateToken,updateAddressController)

router.get("/me",authenticateToken,(req,res)=>{
  res.status(200).json({success:true,user:req.user})
})

//dupa ce fac si orders sa adaug ruta sa primesti toate informatiile

export default router;
