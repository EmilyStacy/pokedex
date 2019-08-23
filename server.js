
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const POKEDEX = require('./pokedex.json');
const app = express();
app.use(morgan('dev'));
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
    if(!authToken || authToken.split('')[1] !== apiToken) {
        return res.status(401).json({error: 'Unauthorized request'});
    }
    next()
})
// console.log('that is',process.env.API_TOKEN);

/*get types */
const validTypes = [`Bug`, `Dark`, `Dragon`, `Electric`, `Fairy`, `Fighting`, `Fire`, `Flying`, `Ghost`, `Grass`, `Ground`, `Ice`, `Normal`, `Poison`, `Psychic`, `Rock`, `Steel`, `Water`]

app.get('/types', function handleGetTypes(req,res) {
    res.json(validTypes);
});

/*get pokemon */
app.get('/pokemon', function handleGetPokemon (req,res) {
    //use POKEDEX
    let response = POKEDEX.pokemon;
    console.log('pokedex is', POKEDEX.pokemon);
    //case insensitive 
    if(req.query.name) {
       response = response.filter(pokemon => {
           pokemon.name.toLowerCase().includes(req.query.name.toLowerCase())
       })
    }
    if(req.query.type) {
        response = response.filter(pokemon=> {
            pokemon.type.includes(req.query.type)
        });
        
    }
    res.json(response);
});
const PORT = 8000;
app.listen(PORT,()=> {
    console.log(`Server listening at http://localhost:${PORT}`)
})


