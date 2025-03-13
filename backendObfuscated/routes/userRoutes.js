import express from 'express';
import * as authController from '../controllers/authController.js';
import * as bookingController from '../controllers/bookingController.js';
import * as propertyController from '../controllers/propertyController.js';

const router = express.Router();

// Property Routes
router.route('/newAccommodation')
    .post(authController.protect, propertyController.createProperty);

router.route('/myAccommodation')
    .get(authController.protect, propertyController.getUsersProperties);

// Authentication Routes
router.route('/signup')
    .post(authController.signup);

router.route('/login')
    .post(authController.login);

router.route('/logout')
    .get(authController.logout);

router.route('/forgotPassword')
    .post(authController.forgotPassword);

router.route('/resetPassword/:token')
    .patch(authController.resetPassword);

router.route('/updateMyPassword')
    .patch(authController.protect, authController.updatePassword);

router.route('/updateMe')
    .patch(authController.protect, authController.updateMe);

router.route('/me')
    .get(authController.protect, authController.getUserBookings);

// Booking Routes
router.route('/booking')
    .get(authController.protect, bookingController.getUserBookings);

router.route('/booking/:bookingId')
    .patch(authController.protect, bookingController.getBookingDetails);

router.route('/booking/new')
    .post(authController.protect, bookingController.createBookings);

router.route('/checkout-session')
    .get(authController.protect, bookingController.getCheckOutSession);

export default router;
