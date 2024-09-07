import { Schema, model } from "mongoose";
import { IRatingReview } from "../Interfaces/common.interface";

const ratingSchema: Schema = new Schema<IRatingReview>({
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

const Rating = model<IRatingReview>("Rating", ratingSchema);
export default Rating;