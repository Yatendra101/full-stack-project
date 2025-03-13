const mongoose = require("mongoose");
const Property = require("./propertyModel");

const bookingSchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.ObjectId,
      ref: "Property",
      required: [true, "Booking must belong to a Property!"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Booking must belong to a User!"],
    },
    price: {
      type: Number,
      required: [true, "Booking must have a price."],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    paid: {
      type: Boolean,
      default: true,
    },
    fromDate: {
      type: Date,
    },
    toDate: {
      type: Date,
    },
    guests: {
      type: Number,
    },
    numberOfNights: {
      type: Number,
    },
  },
  { timestamps: true }
);

// Pre-query middleware to populate 'user' and 'property' fields when querying
bookingSchema.pre(/^find/, function (next) {
  this.populate("user").populate({
    path: "property",
    select: "maximumGuest location images propertyName address",
  });
  next();
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
