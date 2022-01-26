if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const path = require('path')
const errorHandler = require('./errors/errorHandler')
const Post = require('./models/post')
const auth = require('./authentication')
const deletePost = require('./controllers/deletePost')
const submitPost = require('./controllers/submitPost')
const updatePost = require('./controllers/updatePost')

const app = express()
const port = process.env.PORT

///////////////////////////mongo connection//////////////////

const connectionString = process.env.MONGO_LOCAL_CONN_URL
    
mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true})

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
    console.log('Database connected')
})

////////////////////////middleware///////////////////////////

app.use(express.static(path.join(__dirname, 'client/public')))
app.use(express.urlencoded({ extended: true}))
app.use(express.json())
app.use(cors())
app.use(cors({ origin: 'https://kind-shaw-87f836.netlify.app/' }))

/////////////////////////routes//////////////////////////////

//auth init
app.get('/auth', async (req, res) => res.send(
    {   
        Userfront :
            {   tenantId: process.env.USERFRONT_TENANT_ID, 
                toolId: process.env.USERFRONT_TOOLID
            },
        Cloudinary :
            {
                cloudName: process.env.CLOUDINARY_CLOUD_NAME,
                apiKey: process.env.CLOUDINARY_API_KEY 
            }
    }
))

//all posts
app.get('/blog', async (req, res) => {
    const posts = await Post.find({}).sort({"_id": -1})
    res.send(posts)
})

//single post
app.get('/blog/post/:id', async (req, res) => {
    const { id } = req.params
    const post = await Post.findById(id)
    res.send(post)
})

app.post('/blog/newpost', auth, submitPost)

app.put('/blog/updatepost/:id', auth, updatePost)

app.delete('/blog/deletepost/:id', auth, deletePost)

/////////////error handler, needs to be last///////////////////
app.use(errorHandler)

app.listen(port, () => {
    console.log(`listening on port ${port}`);
})
