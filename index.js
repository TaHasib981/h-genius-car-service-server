const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000

// midleware 
app.use(cors())
app.use(express.json())

// get 
app.get('/', (req, res) => {
    console.log('Running genius car service')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.r6qz6.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect()
        const serviceCollection = client.db('geniusCar').collection('service')

        app.get('/service', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query)
            const services = await cursor.toArray()
            res.send(services)
        })
        app.get('/service/:id', async (req, res) =>{
            const id = req.params.id
            const query ={_id: ObjectId(id)}
            const service = await serviceCollection.findOne(query)
            res.send(service)
        })
        // POST...
        app.post('/service', async(req, res) =>{
            const newService = req.body
            const result = await serviceCollection.insertOne(newService)
            res.send(result)
        })
        // DELETE...
        app.delete('/service/:id', async(req, res) =>{
            const id = req.params.id
            const query = {_id: ObjectId(id)}
            const result = await serviceCollection.deleteOne(query)
            res.send(result)
        })
    }
    finally {

    }
}
run().catch(console.dir)


// listen (to show the backend page in UI)
app.listen(port, () => {
    console.log('Listening to port :', port)
})