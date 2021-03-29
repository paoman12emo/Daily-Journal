//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

// Mongoose Database Section
mongoose.connect("mongodb://localhost:27017/dailyDB", {
  useNewUrlParser: true,
  useNewUrlParser: true
});

const dailySchema = mongoose.Schema({
  title: String,
  content: String
});

const DailyModel = mongoose.model("Compose", dailySchema);

// App Setup Section

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

// App get req Section

app.get("/", function(req, res) {

  DailyModel.find({}, function(err, results) {
    res.render("home", {
      homeHeader: "Home",
      homePageContent: homeStartingContent,
      newPost: results
    });
  });
});


app.get("/about", function(req, res) {
  res.render("about", {
    aboutHeader: "About",
    aboutPageContent: aboutContent
  });
});

app.get("/contact", function(req, res) {
  res.render("contact", {
    contactHeader: "Contact",
    contactPageContent: contactContent
  });
});

app.get("/compose", function(req, res) {
  res.render("compose", {
    composeHeader: "Compose",
  });
});

app.get("/post/:title", function(req, res) {
  const parameter = req.params.title;

  DailyModel.findOne({
    _id: parameter
  }, function(err, results) {
    if (!err) {
      res.render("post", {
        title: results.title,
        content: results.content
      });
    }


  });
});


// App post req Section

app.post("/compose", function(req, res) {

  const titleInput = req.body.titleInput;
  const contentInput = req.body.composeInput;
  const post = new DailyModel({
    title: titleInput,
    content: contentInput
  });
  post.save(function(err, results) {
    res.redirect("/");
  });

});


app.post("/delete",function(req, res){
   const idPost = req.body.delete;
  DailyModel.findByIdAndDelete({_id: idPost}, function(err){
    if(err){
      console.log(err);
    }else{
      console.log("Delete Post is Success");
      res.redirect("/");
    }
  })
});



app.listen(process.env.PORT, function() {
  console.log("Server started on port 3000");
});
