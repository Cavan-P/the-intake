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
    const { username, email, password } = req.body
    const hashed = await bcrypt.hash(password, 10)

    users.push({ username, email, password: hashed })
    res.status(200).json({ message: 'Successfully signed up'})
})

app.post('/login', async (req, res) => {
    const { username, email, password } = req.body
    const user = users.find(u => u.email == email)

    if(!user) return res.status(404).json({ message: 'User not found' })
    
    const match = await bcrypt.compare(password, user.password)
    if(!match) return res.status(401).json({ message: 'Wrong password' })

    const token = jwt.sign({ email, username }, SECRET, { expiresIn: '1h' })
    res.json({ token })
})

app.listen(3001, () => console.log('Server running on port 3001'))
