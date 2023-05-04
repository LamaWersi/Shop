const { formToJSON } = require('axios');
const e = require('express');
let express = require(`express`);
let app = express();
let port = 3002;

app.listen(port, function () {
    console.log(`http://localhost:${port}`);
})


app.use(express.static(`public`));


const hbs = require('hbs');
app.set('views', 'views');
app.set('view engine', 'hbs');

app.use(express.urlencoded({ extended: true }))

let mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/shop_EaterOfKegas');

let ingredientSchema = new mongoose.Schema(
    {
        ingredient: String,
        type: String,
        amount: Number,
        weight: Number,
        max: Number
    }
);

let ingredient = mongoose.model('ingredient', ingredientSchema);

let foodsSchema = new mongoose.Schema(
    {
        name:String,
        price: Number,
        calories: Number,
        consist:String,
        description: String
    }
);

let food = new mongoose.model('food', foodsSchema);


let usersSchema = new mongoose.Schema(
    {
        name: String,
        password: String,
        on: Boolean,
        level:Number
    }
);

let user = new mongoose.model('user', usersSchema);

app.get(`/`, async function(req,res)
{
    let food1 = await food.find();
    res.render('index',{foods : food1});
});

app.get(`/adm`, async function(req,res)
{
    let ingr = await ingredient.find();
    res.render('admin', {foods : ingr});
});

app.post(`/adm/add`, async function(req,res)
{
    let id = req.query.i;
    let type =  req.query.type;
    let aboba = await ingredient.find({type : type});
    let i = aboba[0].amount;
    if(aboba[0].amount + Number(req.query.i) > 0 && aboba[0].amount  + Number(req.query.i) <= aboba[0].max){i = Number(req.query.i) + aboba[0].amount;}
    await ingredient.updateOne({type : type}, {$set: {amount : i}});

    res.redirect('/adm');
});

app.post(`/adm/add/ingredient`, async function(req,res)
{
    let ingredient1 = req.body.ingredient;
    let type = req.body.type;
    let amount = Number(req.body.amount);
    let max1 = Number(req.body.max);
    let fd = await ingredient.find({ingredient : ingredient1});
    let fd2 = await ingredient.find({type : type});
    if(fd.length == 0 && fd2.length == 0 && type)
    {
        if(max1 < 10)max1 = 10;
        if(amount < 0)amount = 2;
        else if(amount > max1 - 1)amount = max1 - 5;
        let SaveIt = new ingredient({
            ingredient: ingredient1,
            type: type,
            amount: amount,
            max: max1
        });
        await SaveIt.save();
    }

    res.redirect(`/adm`);

})

app.post(`/adm/delete`, async function(req,res)
{
    let id = req.query.id;
    await ingredient.deleteOne({_id : id});
    res.redirect('/adm');
});

app.get(`/admfood`, async function(req,res)
{
    let food1 = await food.find();
    res.render('admin2', {foods : food1});
});

app.post(`/admfood/change`, async function(req,res)
{
    let name = req.body.name;
    let description = req.body.description;
    let consist = req.body.consist;
    let calories = req.body.calories;
    let price = req.body.price;
    let id = req.query.id;

    await food.updateOne({_id : id}, {$set : {name : name,description : description, consist : consist, calories : calories, price : price} });

    res.redirect('/admfood');

});

app.post(`/admfood/delete`, async function(req,res)
{
    let id = req.query.id;

    await food.deleteOne({_id : id});

    res.redirect('/admfood');
});

app.post(`/admfood/add`, async function(req,res)
{
    let name = req.body.name;
    let description = req.body.description;
    let consist = req.body.consist;
    let calories = req.body.calories;
    let price = req.body.price;
    let food1 = new food({
        name: name,
        description: description,
        consist: consist,
        calories: calories,
        price: price
    });

    await food1.save();
    res.redirect('/admfood');
});



app.get('/room', function(req,res)
{
    res.render('room');
});