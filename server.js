const express = require('express');
const bodyPaser = require('body-parser');
//const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const app = express();

app.use(cors())

app.use(bodyPaser.json());

const database = {
    users: [
        {
            id: '101',
            name: 'jim',
            email: 'jim@gmail.com',
            password: 'rem',
            imageInput: 0,
            joined: new Date()
        },
        {
            id: '102',
            name: 'liza',
            email: 'liza@gmail.com',
            password: 'deku',
            imageInput: 0,
            joined: new Date()
        }
    ]
}

app.get('/', (req, res) => {
    res.send(database.users);
})

app.post('/signin', (req, res) => {
    if(req.body.email === database.users[0].email &&
        req.body.password === database.users[0].password){
            res.json(database.users[0]);
        } else{
            res.status(400).json('Wrong password or email');
        }
})

app.post('/register', (req, res) => {
    const {email, name, password } = req.body;
    database.users.push({
        id: '103',
        name: name,
        email: email,
        imageInput: 0,
        joined: new Date()
    });
    res.json(database.users[database.users.length-1]);
});

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    let found = false; 

    database.users.forEach(user => {
        if(user.id === id){
            found = true;
           return res.json(user);
        }
    });
    if(!found){
        res.status(404).json('u haven\'t been register');
    }
});

app.put('/image', (req, res) => {
    const { id } = req.body;
    let found = false; 

    database.users.forEach(user => {
        if(user.id === id){
            found = true;
            user.imageInput++
           return res.json(user.imageInput);
        }
    });
    if(!found){
        res.status(404).json('u haven\'t been register');
    }
})

app.listen(3001, () => {
    console.log('working great');
});

/*
signIn ==> Post
register ==> Post
profile/:userid ==> Get
image ==> Put

*/