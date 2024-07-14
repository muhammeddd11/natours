const express = require('express')

const authController = require(`${__dirname}/../controllers/authController`)

const userController = require(`${__dirname}/../controllers/userController`)



const router = express.Router();
router.route('/signup').post(authController.signUp)


router.route('/').get(userController.getAllUsers).post(userController.createUser);
router.route('/:id').get(userController.getUser).patch(userController.editUser).delete(userController.deleteUser)

module.exports = router