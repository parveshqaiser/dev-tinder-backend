

var fs = require("fs");

let express = require("express");

let app = express();

let event = require("events");

let newEvent = new event.EventEmitter();

let count =0;

newEvent.on("api",()=>{
    console.log(count)
})

// var http = require("https"); 

// http.get("https://fakestoreapi.com/products",(req,res)=>{
//     console.log("api data");
// });

// setImmediate(()=> console.log("set immediate"))

// setTimeout(()=>{
//     console.log("Timer expired");
// },0);

// fs.readFile("./notes.txt","utf8",()=>{

//     setImmediate(()=> console.log("4 four"));
//     setTimeout(()=>{console.log("3 three")},0);

//     process.nextTick(()=> console.log("two"));
    
// });

// setImmediate(()=> console.log("set immediate 3"))

// process.nextTick(()=> console.log("one"));
// console.log(" last line of code");


app.get("/", (req,res)=>{
    count ++;
    newEvent.emit("api")
    res.json({message : "Hello World", success : true})
});

console.log(count);

app.listen(7100,()=>{
    console.log("server listening at port 7100")
})

// last line of code
// one
// timer expired
// two
// 4 four
// 3 three