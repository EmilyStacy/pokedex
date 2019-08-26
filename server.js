
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const POKEDEX = require('./pokedex.json');
const cors = require('cors');
const app = express();
const morganSetting = process.env.NODE_ENV === 'production'?'tiny':'common';
app.use(morgan(morganSetting));
app.use(cors());
// console.log(process.env.API_TOKEN);
console.log('process env is', process.env.NODE_ENV)
app.use(function validateBearerToken(req,res,next) {
    // const bearerToken = req.get('Authorization').split(' ')[1];=>cause error when there is no authorization
    //if(bearerToken !== apiToken) {
    //     return res.status(401).json({error: 'Unauthorized request'});
    // }
    const authToken=req.get('Authorization');
    const apiToken = process.env.API_TOKEN;
    console.log('validate bearer token middleware is',authToken.split(' ')[1]);
    console.log('apiToken is',apiToken);
    console.log('req.get is', authToken);
    if(!authToken || (authToken.split(' ')[1] !== apiToken)) {
        return res.status(401).json({error: 'Unauthorized request'});
    }
    next()
})
// console.log('that is',process.env.API_TOKEN);

/*get types */
const validTypes = [`Bug`, `Dark`, `Dragon`, `Electric`, `Fairy`, `Fighting`, `Fire`, `Flying`, `Ghost`, `Grass`, `Ground`, `Ice`, `Normal`, `Poison`, `Psychic`, `Rock`, `Steel`, `Water`]

app.get('/pokedex', function handleGetTypes(req,res) {
    res.json(POKEDEX);
});

app.get('/types', function handleGetTypes(req,res) {
    res.json(validTypes);
});

/*get pokemon */
app.get('/pokemon', function handleGetPokemon (req,res) {
    //use POKEDEX
    let response = POKEDEX.pokemon;
    // console.log('pokedex is', POKEDEX.pokemon);
    console.log('query name =', req.query.name);
    if(req.query.name) {
        response = response.filter(pokemon => {
            console.log('pokemon.name',pokemon.name.toLowerCase());
            console.log('req name',req.query.name.toLowerCase());
           return pokemon.name.toLowerCase().includes(req.query.name.toLowerCase());
       })
    }
    console.log(response);
    if(req.query.type) {
        response = response.filter(pokemon => pokemon.type.includes(req.query.type));
    }
    res.json(response);
});
const PORT = process.env.PORT || 8000;
app.listen(PORT,()=> {
    console.log(`Server listening at http://localhost:${PORT}`)
})


