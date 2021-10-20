/*const fileSystem = require('fs');

fileSystem.rmdir ("new-directory", function (error, result )
{
    if (error) {
        console.log (err);
        
    }
}

)


*/
/* const os = require("os");
console.log(os.arch());*/

/* 
 we use this becauuse in browser localhost:3000 show output but if we search localhost:3000/asa it not give the error it give the same output (route localhost :3000 and route is the asa)  
const http = require ("http");
http.createServer((request,response) =>{
    console.log( request.headers);
    response.end("hello noddy!!")

}).listen(4000);
/* 
in this node.js it dont give the erroe on the root and route  it have more paramaters to avoid this we use rxpress.js api 
*/
/*const http = require ("http");
http.createServer((request,response) =>{
    if (request.url === "/") {
        response.end("hello Nodd!!!!!!!!!!y")
    } 
    else {
        response.end("hello all this is not a route route ");
    }
    }).listen(4000);
*/
    /* REST API  
    // Re -> Representational
    //S:state
    //T  : Transfer 
    // Representing data by sharing after processing 
    // Express : it is a framework for node js. to install this use node i express
    */
  /* const express = require("express");
   // initialize//
   const noddy = express();
   noddy.use(express.json());

   // https methods -> get post put delete 
   //get -> to retrieve the data 
   // post -> to send the data to the server
   //put -->to tpdate the data 
   // delete --> to delete an existing data 
   noddy.get("/",(request,response) =>{
       return response.json({data: "Hello Guys"});
   }); 
   noddy.get("/b",(request,response) =>{
    return response.json({data: "Hello route b "});
});

   noddy.listen(4000,() =>{
       console.log("server on port 4000 is up and running")
   });
*/
require("dotenv").config();
const express = require("express");

const mongoose = require("mongoose");
//TO USE POSTMAN 
var bodyParser = require("body-parser");




const database = require ("./database/database");
//models
const BookModel =require("./database/book");
const AuthorModel =require("./database/author");
const PublicationModel =require("./database/publication");





//const { urlencoded } = require("express");
// initialize express
const booky = express();
booky.use(bodyParser.urlencoded({extended:true}));
booky.use(bodyParser.json());
mongoose.connect("mongodb+srv://Sachin:Sachin123@shaprai.cstww.mongodb.net/Sachin?retryWrites=true&w=majority",
{
    useNewUrlParser:true,
useUnifiedTopology: true,
    //useFindAndModify :false,
    //useCreateIndex :true

}).then(() =>console.log("Connection Established"));


booky.get("/",async(req,res)=>{
const getAllBooks = await BookModel.find();

return res.json(getAllBooks)

});


booky.get("/Publications",async(req,res)=>{
    const getAllPublications = await PublicationModel.find();
    
    return res.json({getAllPublications});

    
    });

    //Author 
    booky.get("/Author",async(req,res)=>{
        const getAllAuthor = await AuthorModel.find();
        
        return res.json({getAllAuthor});
        
        
        });
    

        // get a specific book on isbn

        booky.get("/is/:isbn",async (req,res) =>{
            const getSpecificBook = await BookModel.findOne({ISBN:req.params.isbn});

                

            
                if (!getSpecificBook){
                    return res.json({error:'NO book founfd Isbn ${req.params.isbn}'});
                }
                return res.json({book:getSpecificBook})
            });


            //categeory
            booky.get("/c/:category",async(req,res)=>{
                const getSpecificBook = await BookModel.findOne({category:req.params.category});

                

            
                if (!getSpecificBook){
                    return res.json({error:'NO book founfd category ${req.params.isbn}'});
                }
                return res.json({book:getSpecificBook})
            });


            //for postman
            //post 
            
booky.post("/books/new",async(req,res)=>{
    const {newBooks} =req.body;
const addNewBooks= BookModel.create(newBooks);
return res.json({
Books:addNewBooks,
message:"Book was addes !!!"

});
});
            //post 
            booky.post("/author/new",async(req,res)=>{
                const {newAuthor} =req.body;
            const addNewAuthor= AuthorModel.create(newAuthor);
            return res.json({
            author:addNewAuthor,
            message:"Author was addes !!!"
            
            });
            });
//publication 
booky.post("/publication/new", (req,res) => {
    const newPublication = req.body;
    database.publication.push(newPublication);
    return res.json(database.publication);
  });


  //update
  booky.put("/book/update/:isbn",async (req,res) => {
    const updatedBook = await BookModel.findOneAndUpdate(
      {
        ISBN: req.params.isbn
      },
      {
        title: req.body.bookTitle
      },
      {
        new: true
      }
    );
  
    return res.json({
      books: updatedBook
    });
  });


  //
  booky.put("/book/author/update/:isbn", async(req,res) =>{
    //Update book database
  const updatedBook = await BookModel.findOneAndUpdate(
    {
      ISBN: req.params.isbn
    },
    {
      $addToSet: {
        authors: req.body.newAuthor
      }
    },
    {
      new: true
    }
  );
  //Update the author database
  const updatedAuthor = await AuthorModel.findOneAndUpdate(
    {
      id: req.body.newAuthor
    },
    {
      $addToSet: {
        books: req.params.isbn
      }
    },
    {
      new: true
    }
  );

  return res.json(
    {
      books: updatedBook,
      authors: updatedAuthor,
      message: "New author was added"
    }
  );
} );

/*
Route            /book/delete
Description      Delete a book
Access           PUBLIC
Parameter        isbn
Methods          DELETE
*/

booky.delete("/book/delete/:isbn", async (req,res) => {
    //Whichever book that doesnot match with the isbn , just send it to an updatedBookDatabase array
    //and rest will be filtered out
  
    const updatedBookDatabase = await BookModel.findOneAndDelete(
      {
        ISBN: req.params.isbn
      }
    );
  
    return res.json({
      books: updatedBookDatabase
    });
  });
  


/*
Route            /book/delete/author
Description      Delete an author from a book and vice versa
Access           PUBLIC
Parameter        isbn, authorId
Methods          DELETE
*/

booky.delete("/book/delete/author/:isbn/:authorId", (req,res) => {
    //Update the book database
     database.books.forEach((book)=>{
       if(book.ISBN === req.params.isbn) {
         const newAuthorList = book.author.filter(
           (eachAuthor) => eachAuthor !== parseInt(req.params.authorId)
         );
         book.author = newAuthorList;
         return;
       }
     });
//booky.use(bodyParser.urlencoded({extended:true}));
//booky.use(bodyParser.json());
/*booky.get("/",(req,res) => {
    return res.json({books: database.books});

});


booky.get("/is/:isbn",(req,res) =>{
    const getSpecificBook = database.books.filter(
        (book) => book.ISBN === req.params.isbn
        );

        if (getSpecificBook.length === 0){
            return res.json({error:'NO book founfd Isbn ${req.params.isbn}'});
        }
        return res.json({book:getSpecificBook})
    });


    booky.get("/c/:category",(req,res)=>{
        const getSpecificBook =database.books.filter(
            (book)=> book.category.includes(req.params.category)
            )
            if(getSpecificBook.length === 0)
            {
                return res.json({error:' no book category ${req.params.category}'})
          }
          return res.json({book:getSpecificBook})

    });
//our work :- to get a list of books based on languages

//author
booky.get("/author",(req,res)=>{
    return res.json({author: database.author});
});
//our work to  get a specific author 
booky.get("/author/book/:isbn",(req,res) => {
    const getSpecificAuthor = database.author.filter(
        (author) => author.books.includes(req.params.isbn)
    );
    if(getSpecificAuthor.length === 0){
        return res.json({
             error :'NO author found ${req.params.isbn}'
        });

    }
    return res.json({authors:getSpecificAuthor});
});
booky.get("/publication",(req,res)=> {
    return res.json({publication:database.publication});
})

//post 
booky.post("/book/new",(req,res)=>{
    const newBook =req.body;
    database.books.push(newBook);
    return res.json({updatedBooks: database.books })


});
//post author 
booky.post("/author/new",(req,res)=>{
    const newAuthor =req.body;
    database.author.push(newAuthor);
    return res.json(database.author);
})

//post publication
booky.post("/publication/new",(req,res)=>{
    const newpublicaction =req.body;
    database.publication.push(newpublicaction);
    return res.json(database.publicaction);
})
;
/*put method 
booky.put("/publication/update/book/:isbn".(req,res) =>{
    database.publication.forEach((pub) => {
        if(pub.id === req.body.pubId)
        {
            return pub.books.push(req.params.isbn);
        }
  
    });

    //update the database block
    database.books.forEach((book)=>{
        if(book.ISBN === req.params.isbn)
        {
            book.publications = req.body.pubId;
             return;
        }
    });
    return res.json ({
        books:database.books,publications :database.publication, message:"sucessfully updated"
                      });
});
//
*/
/*
//delete method
booky.delete("/book/delete.:isbn",(req,res) =>{
    const updatedBookDatabase =database.books.filter(
        (book) => book.ISBN !== req.params.isbn
    )
    database.books=updatedBookDatabase;
    return res.json({books:database.books});

}); 
*/
//Update the author database
database.author.forEach((eachAuthor) => {
  if(eachAuthor.id === parseInt(req.params.authorId)) {
    const newBookList = eachAuthor.books.filter(
      (book) => book !== req.params.isbn
    );
    eachAuthor.books = newBookList;
    return;
  }
});

return res.json({
  book: database.books,
  author: database.author,
  message: "Author was deleted!!!!"
});
});



booky.listen(5000,() =>{
    console.log("Server is up running ");
});