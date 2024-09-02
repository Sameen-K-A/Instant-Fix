import { Schema, model } from "mongoose";
import { RatingReviewType } from "../Interfaces";

const ratingSchema = new Schema<RatingReviewType>({
   user_id: {
      type: String,
   },
   reviews: {
      type: [{
         rated_user_id: {
            type: String,
         },
         starCount: {
            type: Number,
         },
         review: {
            type: String,
         },
         date: {
            type: String,
         },
         _id: false
      },],
      default: [],
   },
}, {
   versionKey: false,
});

const Rating = model<RatingReviewType>("Rating", ratingSchema);
export default Rating;