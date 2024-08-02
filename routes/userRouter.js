const express = require('express')

const authController = require(`${__dirname}/../controllers/authController`)

const userController = require(`${__dirname}/../controllers/userController`)



const router = express.Router();
// endpoints that should not be protected


router.route('/signup').post(authController.signUp)
router.route('/login').post(authController.login)
router.route('/forgetPassword').post(authController.forgetPassword)
router.route('/resetPassword:token').patch(authController.resetPassword)

// endpoints that should be protected

router.use(authController.protect)

router.route('/Me').get(userController.getMe, userController.getUser)
router.route('/updateMyPassword').patch(authController.updatePassword)
router.route('/deleteMe').delete(userController.deleteMe)
router.route('/updateMe').patch(userController.updateMe)

// not only protected but restricted to admin
router.use(authController.restrictedTo('admin'))

router.route('/').get(userController.getAllUsers).post(userController.createUser);
router.route('/:id').get(userController.getUser).patch(userController.editUser).delete(userController.deleteUser)

module.exports = router