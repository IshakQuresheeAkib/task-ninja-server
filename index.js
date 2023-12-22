const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cookieParser = require('cookie-parser')
const port = process.env.PORT || 5000

const app = express()
app.use(cors())
app.use(express.json())
app.use(cookieParser())
const uri = process.env.DATA_URI

const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
});


async function run() {
try {

    const tasksCollection = client.db("taskNinjaDB").collection('toDoTasks')
    
    app.get('/to-do',async(req,res)=>{
        const {email} = req.query || {}
        const query = {email}
        const cursor = tasksCollection.find(query)
        const result = await cursor.toArray();
        return res.send(result)
    })

    app.post('/to-do',async(req,res)=>{
        const task = req?.body
        console.log(task);
        const addTask = await tasksCollection.insertOne(task);
        return res.send(addTask)
    })

    app.delete('/to-do/:id',async(req,res)=>{
        const {id} = req.params
        const query = {_id: new ObjectId(id)}
        const result = await tasksCollection.deleteOne(query)
        return res.send(result)
    })

    app.get('/',(req,res)=>{
        return res.send('TaskNinja Server is Running!')
    })

    client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
} finally {}
}
run().catch(console.dir);



app.listen(port,()=>{
    console.log(`TaskNinja Server is running on ${port}`);
})