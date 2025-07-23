const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

const users = []

const SECRET = 'dontputthisinhereforreal'

app.post('/signup', async (req, res) => {
    const { email, password } = req.body
    const hashed = await bcrypt.hash(password, 10)

    users.push({ email, password: hashed })
    res.status(201).json({ message: 'Successfully signed up'})
})

app.post('/login', async (req, res) => {
    const { email, password } = req.body
    const user = users.find(u => u.email == email)

    if(!user) return res.status(400).json({ message: 'User not found' })
    
    const match = await bcrypt.compare(password, user.password)
    if(!match) return res.status(400).json({ message: 'Wrong password' })

    const token = jwt.sign({ email }, SECRET, { expiresIn: '1h' })
    res.json({ token })
})

app.listen(3001, () => console.log('Server running on port 3001'))
