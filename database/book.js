const mongoose = require("mongoose");
// create book schema 
 const BookSchema = mongoose.Schema({

    ISBN: String,
     title : String, 
     pubdate:String, 
     language :String,
     numPage:Number , 
     author:[String],
     publications:Number,
     category:[String]
});
 const BookModel = mongoose.model("Books",BookSchema);
 module.exports = BookModel;