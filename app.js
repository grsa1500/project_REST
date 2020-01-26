/* Importerar */
var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var mongoose = require('mongoose');


var connection = 'mongodb+srv://greta:gretaMiun123@cluster0-u3jau.mongodb.net/bookshelf?retryWrites=true&w=majority';
var BookSchema = require('./app/models/books.js');



//Ansluta till databas 
mongoose.connect(connection, { useNewUrlParser: true });

mongoose.Promise = global.Promise;


var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));



// Läs in Schemat


/* Skapa instans av express */
var app = express();

//Middleware
app.all('/*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, X-Requested-With");
  res.header("Access-Control-Allow-Methods", "GET,PUT,PATCH,POST,DELETE");
  next();
});

function ignoreFavicon(req, res, next) {
  if (req.originalUrl === '/favicon.ico') {
    res.status(204).json({ nope: true });
  } else {
    next();
  }
}

app.use(ignoreFavicon);

// Body parser 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Skapa statisk sökväg
app.use(express.static(path.join(__dirname, 'public')));

//Skickar alla böcker 
app.get('/books', async (req, res) => {
  const books = await BookSchema.find({}).sort({ _id: -1 });

  try {
    res.json(books);
  }

  catch (err) {
    res.status(500).send(err);
  }
});


// Skickar böckerna sorterade 
app.get('/books/sort/:sorting', async (req, res) => {

  try {

   
var choice = req.params.sorting;

var books = '';

     switch (choice) {

      case '0':
        books = await BookSchema.find({}).sort({ _id: -1 });
   
       break;

      case '1':
         books = await BookSchema.find({}).sort({ title: 1 });
    
        break;

      case '2':
        books = await BookSchema.find({}).sort({ author: 1 });
    
        break;


      case '3':
         books = await BookSchema.find({}).sort({ read: 1, dateRead: 1 });
    
        break;

      case '4':
         books = await BookSchema.find({}).sort({ pages: -1 });
       
        break;

      case '5':
        books = await BookSchema.find({}).sort({ pages: 1 });
      
        break;

      case '6':
         books = await BookSchema.find({}).sort({ year: -1 });
      
        break;

      case '7':
       books = await BookSchema.find({}).sort({ year: 1 });
        
        break;
      

     }res.json(books);
     
  } catch (err) {
    res.status(500).send(err)
  }


});

module.exports = app;



//Sparar en bok
app.post('/book', async (req, res) => {
  const book = new BookSchema(req.body);


  try {
    await book.save();
    res.send(book);
  } catch (err) {
    res.status(500).send(err);
  }

});


app.delete('/book/:id', async (req, res) => {
  try {
    const book = await BookSchema.findByIdAndDelete(req.params.id)

    if (!book) res.status(404).send("No item found")
    res.status(200).send()
  } catch (err) {
    res.status(500).send(err)
  }
})

app.patch('/book/:id', async (req, res) => {
  try {
    await BookSchema.findByIdAndUpdate(req.params.id, req.body)
    res.send({'message': 'function 1'})
  } 
  catch(err) {
    res.send({'message': 'error 1'})
  }


})


// Skapa statisk sökväg
app.use(express.static(path.join(__dirname, 'public')));



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Our app is running on port ${PORT}`)
});