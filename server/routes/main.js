const express = require('express');
const router = express.Router();
const Post = require('../models/post')

//WORKING OUT THE ARTICLE AS WLL AS PAGINATION PART SO 
//THAT EVERYTIME WE CLICK VIEW OLDER POST WE WILL GET ANOTHER 10 BLOGS
router.get('',async (req,res)=>{
    
    try {
        
        const locals = {
            "title":"BLOG-APP",
            "Description":"This is my first Blog app"
        }
        let perpage = 6;
        let page = req.query.page || 1;
        const data = await Post.aggregate([{$sort:{createdAt: -1}}])
        .skip(perpage*page - perpage)
        .limit(perpage)
        .exec();

        const count = await Post.countDocuments();
        const nextPage = parseInt(page)+1;
        const hasNextPage = nextPage<=Math.ceil(count/perpage);


        res.render('index.ejs',{
            locals,
            data,
            current: page,
            nextPage: hasNextPage? nextPage : null
        });
    } 
    catch (error) {
        console.log(error);
    }
    
});




//THIS CODE ONLY MAKES THE ARTICLE PORTIONS
// router.get('',async (req,res)=>{
//     const locals = {
//         "title":"BLOG-APP",
//         "Description":"This is my first Blog app"
//     }
//     try {
//         const data = await Post.find();
//         res.render('index.ejs',{locals,data});
//     } catch (error) {
//         console.log(error);
//     }
    
// });

//Same code without async await 
// router.get('', (req, res) => {
//     const locals = {
//         "title": "BLOG-APP",
//         "Description": "This is my first Blog app"
//     };
    
//     Post.find()
//         .then((data) => {
//             res.render('index.ejs', { locals, data });
//         })
//         .catch((error) => {
//             console.log(error);
//         });
// });


// function insertPostData () {
//   Post.insertMany([
//     {
//       title: "Building APIs with Node.js",
//       body: "Learn how to use Node.js to build RESTful APIs using frameworks like Express.js"
//     },
//     {
//       title: "Deployment of Node.js applications",
//       body: "Understand the different ways to deploy your Node.js applications, including on-premises, cloud, and container environments..."
//     },
//     {
//       title: "Authentication and Authorization in Node.js",
//       body: "Learn how to add authentication and authorization to your Node.js web applications using Passport.js or other authentication libraries."
//     },
//     {
//       title: "Understand how to work with MongoDB and Mongoose",
//       body: "Understand how to work with MongoDB and Mongoose, an Object Data Modeling (ODM) library, in Node.js applications."
//     },
//     {
//       title: "build real-time, event-driven applications in Node.js",
//       body: "Socket.io: Learn how to use Socket.io to build real-time, event-driven applications in Node.js."
//     },
//     {
//       title: "Discover how to use Express.js",
//       body: "Discover how to use Express.js, a popular Node.js web framework, to build web applications."
//     },
//     {
//       title: "Asynchronous Programming with Node.js",
//       body: "Asynchronous Programming with Node.js: Explore the asynchronous nature of Node.js and how it allows for non-blocking I/O operations."
//     },
//     {
//       title: "Learn the basics of Node.js and its architecture",
//       body: "Learn the basics of Node.js and its architecture, how it works, and why it is popular among developers."
//     },
//     {
//       title: "NodeJs Limiting Network Traffic",
//       body: "Learn how to limit netowrk traffic."
//     },
//     {
//       title: "Learn Morgan - HTTP Request logger for NodeJs",
//       body: "Learn Morgan."
//     },
//   ])
// }

// insertPostData();


/**
 * GETTING POST:ID
 */
router.get('/post/:id',async (req,res)=>{
    
    try {       
        let slug = req.params.id;
        const data = await Post.findById({_id:slug});
        const locals = {
            "title":data.title,
            "Description":"This is my first recipei app"
        }
        res.render('post.ejs',{locals,data});
    } catch (error) {
        console.log(error);
    }

});



/**
 * GETTING POST:SEARCHBAR
 */

router.post('/search',async (req,res)=>{
    
    try {
        const locals = {
            "title":"Search",
            "Description":"This is my first recipie app"
        }

        let searchTerm = req.body.searchTerm;
        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9]/g,"")
        const data = await Post.find({
            $or: [
                {title:{$regex: new RegExp(searchNoSpecialChar,'i')}},
                //{body:{$regex: new RegExp(searchNoSpecialChar,'i')}}
            ]
        });
        res.render('search.ejs',{locals,data});
    } catch (error) {
        console.log(error);
    }
    
});




//Function to insert recipe data
function insertRecipeData() {
    Post.insertMany([
      {
        title: "Classic Spaghetti Carbonara",
        body: "Learn how to make a creamy and delicious spaghetti carbonara using eggs, cheese, pancetta, and black pepper."
      },
      {
        title: "Homemade Margherita Pizza",
        body: "Master the art of making a perfect Margherita pizza with fresh mozzarella, basil, and homemade pizza dough."
      },
      {
        title: "Vegetarian Tacos with Black Beans",
        body: "Discover how to prepare healthy and flavorful vegetarian tacos filled with black beans, avocado, and a zesty lime dressing."
      },
      {
        title: "Ultimate Chocolate Chip Cookies",
        body: "Bake the ultimate chocolate chip cookies that are soft, chewy, and packed with gooey chocolate chunks."
      },
      {
        title: "Creamy Chicken Alfredo Pasta",
        body: "Learn to cook a rich and creamy chicken alfredo pasta, perfect for a comforting dinner."
      },
      {
        title: "Authentic Pad Thai",
        body: "Cook an authentic Pad Thai with stir-fried rice noodles, shrimp, tofu, and a tangy tamarind sauce."
      },
      {
        title: "Healthy Green Smoothie Bowl",
        body: "Create a nutritious green smoothie bowl topped with fresh fruits, granola, and chia seeds."
      },
      {
        title: "Garlic Butter Shrimp",
        body: "Sauté shrimp in a garlic butter sauce for a quick and flavorful seafood dish."
      },
      {
        title: "Vegan Lentil Curry",
        body: "Prepare a hearty vegan lentil curry with coconut milk, tomatoes, and Indian spices."
      },
      {
        title: "Homemade Cinnamon Rolls",
        body: "Make soft and fluffy cinnamon rolls from scratch, topped with a creamy glaze."
      },
    ])
    .then(() => console.log("Recipes inserted successfully"))
    .catch((err) => console.error("Error inserting recipes:", err));
  }
  
  // Call the function to insert recipe data
  insertRecipeData();



// Post.deleteMany({})
// .then(() => console.log("Existing data deleted"))
// .then(() => insertRecipeData())
// .catch((err) => console.error("Error clearing data:", err));






router.get('/about',(req,res)=>{
    res.render('about.ejs');
    
})



module.exports = router;
