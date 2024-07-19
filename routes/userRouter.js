const express = require('express')

const authController = require(`${__dirname}/../controllers/authController`)

const userController = require(`${__dirname}/../controllers/userController`)



const router = express.Router();

router.route('/updateMyPassword').patch(authController.protect,authController.updatePassword)
router.route('/deleteMe').delete(authController.protect,userController.deleteMe)
router.route('/updateMe').patch(authController.protect,userController.updateMe)
router.route('/resetPassword:token').patch(authController.forgetPassword)
router.route('/signup').post(authController.signUp)
router.route('/login').post(authController.login)


router.route('/').get(userController.getAllUsers).post(userController.createUser);
router.route('/:id').get(userController.getUser).patch(userController.editUser).delete(userController.deleteUser)

module.exports = router