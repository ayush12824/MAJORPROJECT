const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const Review = require("./review.js");
const User = require("./user.js");

// const listingSchema=new Schema({
//     title:{
//         type:String,
//         required:true,
//     },
//     description:String,
//     image:{
//         type:String,
//         default:"https://unsplash.com/photos/coastal-buildings-line-the-waterfront-with-rocky-shore-NpHk09GJB7M",
//         set:(v)=>v===""?"https://unsplash.com/photos/coastal-buildings-line-the-waterfront-with-rocky-shore-NpHk09GJB7M":v,
//     },
//     price:Number,
//     location:String,
//     country:String
// });

const listingSchema = new mongoose.Schema({
  title: String,
  description: String,

  image: {
    url: {
      type: String,
      default: "/images/default/default.jpg",
    },
    filename: String,
    // url: {
    //   type: String,
    //   default: "/images/default/default.jpg",
    //   // set: (v) => (v.trim() === "" ? "/images/default/default.jpg" : v),
    // },
  },

  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
