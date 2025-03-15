import express  from "express";
import mongoose from "mongoose";
export const app = express();
import { connect } from "mongoose";
import Listing from "./init/listing.js";
import methodOverride from "method-override";
import path from "path";
import ejsMate from "ejs-mate";
import { fileURLToPath } from "url";

// Convert `import.meta.url` to a file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log(__dirname); // Outputs the directory of the current file

const DB_URI="mongodb://127.0.0.1:27017/wanderlust";






main()
   .then(()=>{ 
    console.log("connected to database");
})
   .catch(err =>{
   console.log(err);
});
 async function main() {
   await connect(DB_URI);
}




app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true})) ;
app.use(methodOverride("method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"public")));







app.get('/',( _req ,res)=>{
    res.send("hi I am a root");
});
//index route
app.get('/listings',async (_req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
})
//new route
app.get("/listings/new", (_req,res)=>{
   res.render("listings/new.ejs");
});
//showroute
app.get ("/listings/:id",async(req,res)=>{
   let {id}=req.params;
   const listing = await Listing.findById(id);  
   res.render("listings/show.ejs",{listing});
   });
//CREATE ROUTE
app.post("/listings",async(req,res)=>{
   //let {name,loction,facilities,price}=req.body;
   const newlisting=  new Listing(req.body.listing); 
   await newlisting.save();
   res.redirect("/listings");
}); 
//edit route
app.get("/listings/:id/edit",async(req,res)=>{
    let {id}=req.params;
    const listing = await Listing.findById(id); 
    res.render("listings/edit",{listing})
});
//updaterout 
app.put("/listings/:id", async( req , res )=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
});
//DELETEROUT
app.delete("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    let deletedlisting = await Listing.findByIdAndDelete(id);
    console.log(deletedlisting);
    res.redirect ("/ listings");
});
app.listen(8080,()=>{
    console.log("server is listening to port 8080");
});
export default app; 