var express=require("express");
var app=express();
var bodyParser=require("body-parser");
var mongoose=require("mongoose");
var campground=require("./models/campground");
var seedDB  = require("./seeds");
var Comment=require("./models/comment");
var passport=require("passport");
var LocalStrategy=require("passport-local");
var User=require("./models/user");
var methodOverride=require("method-override");
var flash=require("connect-flash");

var campgroundRoutes   =   require("./routes/campgrounds"),
	commentRoutes      =   require("./routes/comments"),
	indexRoutes        =   require("./routes/index"),
	reviewRoutes       =   require("./routes/reviews");


//mongoose.connect("mongodb://localhost:27017/yelp_camp_v12",{useNewUrlParser:true,useUnifiedTopology:true});
mongoose.connect("mongodb+srv://Mounika:process.env.password@cluster0-dzpmq.mongodb.net/test?retryWrites=true&w=majority",{useNewUrlParser:true,useUnifiedTopology:true,useCreateIndex:true}).then(() =>{
	console.log("connected to db")}).catch(err=>{
	console.log("ERROR : ",err.message)});


app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//seedDB();

//Passport configuration

app.use(require("express-session")({
	secret:"this is mounika",
	resave:false,
	saveUninitialized:false
}));

app.locals.moment = require('moment');

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req,res,next){
	res.locals.currentuser=req.user;
    res.locals.error=req.flash("error");
	res.locals.success=req.flash("success");
	next();
})

app.use(indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comment",commentRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);

app.listen(process.env.PORT,process.env.IP,function(){
	console.log("YelpCamp has started");
})
