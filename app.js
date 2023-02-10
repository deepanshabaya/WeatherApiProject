const { response } = require("express");
const express=require("express");
const https=require("https");
//https is required so that we can get the data from external resource(api) into our webapp
const { exitCode } = require("process");
const bodyParser=require("body-parser");
const { urlencoded } = require("body-parser");
const app=express();

app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"));    //public to access image 

app.get("/",function(req,res){
res.sendFile(__dirname+"/index.html");
});

// body parser package allows us to look through the body of the post request and fetch
//  the data based on the name of the input

app.post("/",function(req,res){
 
// since the url is so long we can't see the get method properly we'll store it in a variable called url
// and use that variable url

const query=req.body.cityName;

const apikey="d3855c827e6ed4ef333add5918ad6f62";
const unit="metric";
const url="https://api.openweathermap.org/data/2.5/weather?q="+query +"&appid="+ apikey+"&units="+unit+"";
// the above url is basically broken down. the actual url after replacing variable will be:
// https://api.openweathermap.org/data/2.5/weather?q=udaipur&appid=d3855c827e6ed4ef333add5918ad6f62&units=metric


    https.get(url,function(response)
    {
        //console.log(response);        -->prints the response on console
        console.log(response.statusCode);        //-->prints 200 status code (that is ok ) successful get request

        response.on("data",function(data){
            const weateherData=JSON.parse(data);
            console.log(weateherData); // prints the full weather data received from openweathermap


// response.on method will search through the data that we got from the response
// it will correspond to the actual message body that we got back, that openweathermap has 
// actually sent us. If we console simply data it will print the response in hexadecimal format
// hence we convert into js object using json.parse(data).


            const temp=weateherData.main.temp    //pull the specific data from weather data
            console.log(temp);

            const weatherDescription=weateherData.weather[0].description;
            console.log(weatherDescription)

            const icon = weateherData.weather[0].icon;
            const imageUrl="http://openweathermap.org/img/wn/" +icon+ "@2x.png"
            res.write("<h1>The temperature in "+query+" is: "+ temp + " degree celsius </h1>")
            res.write("<p>The weather description of "+ query+" is "+ weatherDescription + "</p>");
            res.write("<img src=" +imageUrl+">");
            res.send()
    })
    
    });

    //res.send("server is up and running");

})



app.listen(3000,function(){
    console.log("Server is running at port 3000");
});






// now to get specific data from response like temp or cloud image etc. we use js object dot notation we can also
// use json viewer pro to get the path 

// we can only use one res.send method if we use multiple then our code will crash and error will be displayed
// hence we use res.write and then send using res.send