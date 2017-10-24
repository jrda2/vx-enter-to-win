const express = require('express')
const bodyParser= require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const flash = require('req-flash')
const MongoClient = require('mongodb').MongoClient
require('dotenv').config()
const app = express()

var db_apiKey = process.env.MONGODB;

MongoClient.connect(db_apiKey, (err, database) => {
	if (err) return console.log(err)
	db = database
	app.listen(process.env.PORT || 8000, function() {
  		console.log('listening on 8000')
	})
})

app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({extended: true}))

app.use(express.static(__dirname + '/public'))

app.use(cookieParser());
app.use(session({ secret: '123' }));
app.use(flash());


app.get ('/', (req, res) => {
	res.render('index.ejs')
})

app.get ('/admin', (req, res) => {
	db.collection('form-entries').find().toArray((err, result) => {
		if (err) return console.log(err)
		res.render('admin.ejs', {entries: result})
	})
})

app.post ('/submit', (req, res) => {
	db.collection('form-entries').save(req.body, (err,result) => {
		if (err) return console.log(err)
		console.log(req.body + 'saved to database')
		res.redirect('/')
	})
})

