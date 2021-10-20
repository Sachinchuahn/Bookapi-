const books = [{
    ISBN: "12345678",
     title : "tesla", 
     pubdate:"2021-4-21", 
     language :"en",
     numPage:250 , 
     author:[1,2],
     publications:[1],
     category:["tech","space","education"]

}]
 
const author = [
{ id:1, name :"Sachin",books:["12345Book","12354234Bolk"]},
{ id:2, name :"Sachex",books:["12345Book","12354234Bolk"]}
]
const publication =[{
id:1 , name:"writex",books:["1234567Books"],id:2 , name:"writex",books:["1234567Books"]


}]

module.exports={books, author, publication }