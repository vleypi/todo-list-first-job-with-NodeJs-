const express = require('express')
const config = require('config')
const mongoose = require('mongoose')

const app = express()
const PORT = config.get('port') || 5000

app.use(express.json({
    extended: true
}))

app.use('/api/auth',require('./routes/auth'))
app.use('/api/todo',require('./routes/todo'))

const start = async () => {
    try{
        await mongoose.connect(config.get('mongoUrl'),{useNewUrlParser: true, useUnifiedTopology:true,useCreateIndex:true})
        app.listen(PORT,()=>console.log('server has been started on' + PORT))
    }
    catch(err){
        console.log(err.message)
        process.exit(1)
    }
}

start()

