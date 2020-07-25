
var mongoose=require("mongoose");

var campgroundSchema=new mongoose.Schema({
	title:String,
	price:String,
	image:String,
	createdAt: { type: Date, default: Date.now },
	   author: {
	
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref:"User"
		},
		username:String
		
	},
	description:String,
	   comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ],
	  reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    rating: {
        type: Number,
        default: 0
    }
});
var campground=mongoose.model("campground",campgroundSchema);


module.exports = mongoose.model("Campground", campgroundSchema);