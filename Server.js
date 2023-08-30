const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
require('./models/Model')
require('./models/post')

const PORT = 5000

const app = express()

app.use(cors())
app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/createpost'))



mongoose.connect('mongodb://127.0.0.1:27017/instagram') //name of db
mongoose.connection.on("connected", ()=>{
    console.log("connected to database")
})


app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
})