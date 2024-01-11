const express = require('express');
const router = express.Router();
const userController = require('../controllers/usercontroller');

// Routes

router.get('/', userController.index);
router.get('/logout', userController.logout);
router.get('/admin_login', userController.alogin);
router.post('/admin_login', userController.aloginp);
router.get('/student_login', userController.slogin);
router.post('/student_login', userController.sloginp);
router.get('/admin_details', userController.adetails);
router.get('/student_details',userController.sdetails);
router.get('/student_signup',userController.ssignup);
router.post('/student_signup',userController.ssignupp);
router.get('/admin_profile',userController.aprofile);
router.get('/student_profile',userController.sprofile);
router.get('/enroll',userController.enroll);
router.get('/accept',userController.accept);
router.get('/reject',userController.reject);
router.post('/updateProfile', userController.updateProfile);
router.post('/updateAdminProfile', userController.updateAdminProfile);
router.get('/add_course',userController.acourse);
router.post('/add_course',userController.acoursep);



module.exports = router;