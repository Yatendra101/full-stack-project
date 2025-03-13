import path from 'path';
import dotenv from 'dotenv';
import Stripe from 'stripe';
import Property from '../Models/propertyModel.js';
import Booking from '../Models/bookingModel.js';
import moment from 'moment';

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '../config.env') });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create Stripe Payment Intent
export const getCheckOutSession = async (req, res) => {
    try {
        const { amount, currency, paymentMethodTypes, propertyName } = req.body;

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100,
            currency: currency || 'inr',
            payment_method_types: paymentMethodTypes,
            description: 'Payment for testing',
            metadata: { propertyName: JSON.stringify(propertyName) }
        });

        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error);
    }
};

// Create a new Booking
export const createBookings = async (req, res) => {
    try {
        if (!req.user) throw new Error('Please login First');

        const { property, price, guests, fromDate, toDate } = req.body;

        const startDate = moment(fromDate);
        const endDate = moment(toDate);
        const numberOfNights = endDate.diff(startDate, 'days');

        const propertyData = await Property.findById(property);

        // Check if property is already booked for requested dates
        const isBooked = propertyData.currentBookings.some(booking => {
            return (
                (booking.fromDate <= new Date(fromDate) && new Date(fromDate) <= booking.toDate) ||
                (booking.fromDate <= new Date(toDate) && new Date(toDate) <= booking.toDate)
            );
        });

        if (isBooked) {
            return res.status(400).json({
                status: 'fail',
                message: 'The property is already booked for the requested dates.'
            });
        }

        // Create new booking
        const newBooking = await Booking.create({
            property,
            price,
            guests,
            fromDate,
            toDate,
            numberOfNights,
            user: req.user._id
        });

        // Update property with new booking
        const updatedProperty = await Property.findByIdAndUpdate(
            property,
            {
                $push: {
                    currentBookings: {
                        bookingId: newBooking.id,
                        fromDate,
                        toDate,
                        userId: newBooking.user
                    }
                }
            },
            { new: true }
        );

        res.status(200).json({
            status: 'success',
            data: {
                booking: newBooking,
                updatedProperty
            }
        });
    } catch (error) {
        res.status(401).json({
            status: 'fail',
            message: error.message
        });
    }
};

// Get Bookings for a User
export const getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id });

        res.status(200).json({
            status: 'success',
            data: { bookings }
        });
    } catch (error) {
        res.status(401).json({
            status: 'fail',
            message: error.message
        });
    }
};

// Get Booking Details by ID
export const getBookingDetails = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.bookingId);

        res.status(200).json({
            status: 'success',
            data: { booking }
        });
    } catch (error) {
        res.status(401).json({
            status: 'fail',
            message: error.message
        });
    }
};
