const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000

const app = express()
app.use(cors())
app.use(express.json())
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vuba6ki.mongodb.net/?retryWrites=true&w=majority`

const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
});


async function run() {
try {

    const tasksCollection = client.db("taskNinjaDB").collection('tasksCollection')
    
    app.get('/',(req,res)=>{
        res.send('TaskNinja Server is Running!')
    })

    app.get('/tasks/to-do',async(req,res)=>{
        const {email} = req.query || {}
        console.log(email);
        const cursor = tasksCollection.find({email,type:'to-do'})
        const result = await cursor.toArray();
        res.send(result)
    })

    app.get('/tasks/ongoing',async(req,res)=>{
        const {email} = req.query || {}
        console.log(email);
        const cursor = tasksCollection.find({email,type:'ongoing'})
        const result = await cursor.toArray();
        res.send(result)
    })

    app.get('/tasks/completed-tasks',async(req,res)=>{
        const {email} = req.query || {}
        console.log(email,'completed');
        const cursor = tasksCollection.find({email,type:'completed'})
        const result = await cursor.toArray();
        console.log(result);
        res.send(result)
    })

    app.post('/tasks/to-do',async(req,res)=>{
        const task = req?.body
        console.log(task);
        const addTask = await tasksCollection.insertOne({...task,type:'to-do'});
        res.send(addTask)
    })

    app.delete('/tasks/to-do/:id',async(req,res)=>{
        const {id} = req.params
        console.log(id);
        const query = {_id: new ObjectId(id)}
        console.log(query);
        const result = await tasksCollection.deleteOne(query)
        res.send(result)
    })

    app.patch('/tasks/to-do',async(req,res)=>{
        const {id,type} = req?.body || {}
        console.log(type);
        const filter = {_id: new ObjectId(id)}
        const updatedTask = {
            $set:{type}
        }
        const result = await tasksCollection.updateOne(filter,updatedTask)
        res.send(result)
    })

    // app.put('/tasks/to-do',async(req,res)=>{
    //     const {id,modifiedTask} = req?.body || {}
    //     console.log(id);
    //     const filter = {_id: new ObjectId(id)}
    //     const updatedTask = {
    //         $set:{modifiedTask}
    //     }
    //     const result = await tasksCollection.updateOne(filter,updatedTask)
    //     res.send(result)
    // })


    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
} finally {}
}
run().catch(console.dir);



app.listen(port,()=>{
    console.log(`TaskNinja Server is running on ${port}`);
})