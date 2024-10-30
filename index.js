const express = require('express');
const { resolve } = require('path');

const app = express();
const port = 3010;

app.use(express.static('static'));
const cors=require('cors');
const {open}=require('sqlite')
const sqlite3=require('sqlite3').verbose();
let db;
(async ()=>{
  db=await open({
    filename:'./database.sqlite',
    driver:sqlite3.Database,
  });
})();
async function fetchAllRestaurants(){
  let query="SELECT * FROM restaurants"
  let response=await db.all(query,[])
  return ({restaurants:response})
}
app.get('/restaurants',async (req,res)=>{
  try{
    let results=await fetchAllRestaurants();
    if(results.restaurants.length===0){
      res.status(404).json({message:"No restaurants found"})
    }
    res.status(200).json(results);
  }catch(err){
    res.status(500).json({error:err.message});
  }

})
async function fetchRestaurantById(id){
  let query="SELECT * FROM restaurants WHERE id=?"
  let response=await db.all(query,[id])
  return ({restaurants:response})
}

app.get('/restaurants/details/:id',async (req,res)=>{
  try{
    let id=req.params.id;
    let results=await fetchRestaurantById(id);
    if(results.restaurants.length===0){
      res.status(404).json({message:"No restaurants found"})
    }
    res.status(200).json(results);

  }catch(err){
    res.status(500).json({error:err.message});
  }
  
})


async function fetchRestaurantByCuisine(cuisine){
  let query="SELECT * FROM restaurants WHERE cuisine=?"
  let response=await db.all(query,[cuisine])
  return ({restaurants:response})
}

app.get('/restaurants/cuisine/:cuisine',async (req,res)=>{
  try{
    let cuisine=req.params.cuisine;
    let results=await fetchRestaurantByCuisine(cuisine);
    if(results.restaurants.length===0){
      res.status(404).json({message:"No restaurants found"})
    }
    res.status(200).json(results);

  }catch(err){
    res.status(500).json({error:err.message});
  }
  
})
async function getRestaurantByFilter(isVeg,hasOutdoorSeating,isLuxury){
  let query="SELECT * FROM restaurants WHERE isVeg=? AND hasOutdoorSeating=? AND isLuxury=?"
  let response=await db.all(query,[isVeg,hasOutdoorSeating,isLuxury]);
  return ({restaurants:response});
}
app.get('/restaurants/filter',async (req,res)=>{
  try{
    let isVeg=req.query.isVeg;
  let hasOutdoorSeating=req.query.hasOutdoorSeating;
  let isLuxury=req.query.isLuxury;
  let results=await getRestaurantByFilter(isVeg,hasOutdoorSeating,isLuxury);
  if(results.restaurants.length===0){
    res.status(404).json({message:"No restaurants found"})
  }
  res.status(200).json(results);
  }catch(err){
    res.status(500).json({error:err.message});
  }

})


async function fetchRatingSorted(){
  let query="SELECT * FROM restaurants ORDER BY rating DESC"
  let response=await db.all(query,[])
  return ({restaurants:response})
}
app.get('/restaurants/sort-by-rating',async (req,res)=>{
  try{
    let results=await fetchRatingSorted()
    if(results.restaurants.length===0){
      res.status(404).json({message:"No restaurants found"})
    }
    res.status(200).json(results);
  }catch(err){
    res.status(500).json({error:err.message});
  }

})
async function fetchAllDishes(){
  let query="SELECT * FROM dishes"
  let response=await db.all(query,[])
  return ({dishes:response})
}
app.get('/dishes',async (req,res)=>{
  try{
    let results=await fetchAllDishes();
    if(results.dishes.length===0){
      res.status(404).json({message:"No restaurants found"})
    }
    res.status(200).json(results);
  }catch(err){
    res.status(500).json({error:err.message});
  }

})

async function fetchDishesById(id){
  let query="SELECT * FROM dishes WHERE id=?"
  let response=await db.all(query,[id])
  return ({dishes:response})
}


app.get('/dishes/details/:id',async (req,res)=>{
  try{
  let id=req.params.id;
  let results=await fetchDishesById(id);
  if(results.dishes.length===0){
    res.status(404).json({message:"No restaurants found"})
  }
  res.status(200).json(results);
  }
  catch(err){
    res.status(500).json({error:err.message});
  }

})
async function fetchDishesByVeg(isVeg){
  let query="SELECT * FROM dishes where isVeg=?"
  let response=await db.all(query,[isVeg])
  return ({dishes:response})
}

app.get('/dishes/filter',async (req,res)=>{
  try{
    let isVeg=req.query.isVeg;
    let results=await fetchDishesByVeg(isVeg);
    if(results.dishes.length===0){
      res.status(404).json({message:"No restaurants found"})
    }
    res.status(200).json(results);
  }catch(err){
    res.status(500).json({error:err.message});
  }

})
async function sortByPrice(){
  let query="SELECT * FROM dishes ORDER BY price"
  let response=await db.all(query,[])
  return ({dishes:response})
}
app.get('/dishes/sort-by-price',async (req,res)=>{
  try{
    let results=await sortByPrice()
    if(results.dishes.length===0){
      res.status(404).json({message:"No restaurants found"})
    }
    res.status(200).json(results);
  }catch(err){
    res.status(500).json({error:err.message});
  }
})



app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
