const express = require('express');
const bodyPaser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : 'krunal',
      database : 'smart-brain'
    }
  });


const app = express();

app.use(cors())

app.use(bodyPaser.json());

app.get('/', (req, res) => {
    res.send(database.users);
})

app.post('/signin', (req, res) => {
    db.select('email', 'hash').from('login')
      .where('email', '=', req.body.email)
      .then(data => {
          const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
          if(isValid){
            return  db.select('*').from('users')
              .where('email', '=', req.body.email)
              .then(user => {
                  res.json(user[0])
              })
              .catch(err => res.status(400).json('unable to ge user'))
          }else{
            res.status(400).json('Wrong email or password');
          }
      })
      .catch(err => res.status(400).json('Wrong email or password'))
})

app.post('/register', (req, res) => {
    const {email, name, password } = req.body;
    const hash = bcrypt.hashSync(password);
    db.transaction(trx => {
        return trx
        .insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
            return trx('users')
                .returning('*')
                .insert({
                    email: loginEmail[0],
                    name: name,
                    joined: new Date()
                })
                .then(user => {
                    res.json(user[0])
                })
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
    .catch(err => res.status(400).json('unable to join'))
});

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;

    db.select('*').from('users').where({id})
      .then(user => {
          if(user.length){
            res.json(user[0])
            }else{
                res.status(400).json('user not found');
            }
        })
    .catch(err => res.status(400).json('user not found'))
});

app.put('/image', (req, res) => {
    const { id } = req.body;
    db('users').where('id', '=', id)
    .increment('imageInput', 1)
    .returning('imageInput')
    .then(imageInput => {
        res.json(imageInput[0]);
    })
    .catch(err => res.status(400).json('unable to get count'))
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