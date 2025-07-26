const express = require('express')
const cors = require('cors')
const { createClient } = require('@supabase/supabase-js')

require('dotenv').config()

const app = express()
app.use(cors())
app.use(express.json())

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

async function authenticate(req, res, next){
    console.log('entered authentication')

    const authHeader = req.headers.authorization
    if(!authHeader) return res.status(401).json({ message: 'Missing auth header' })
    console.log('created auth header')

    const token = authHeader.split(' ')[1]
    if(!token){
        console.log('No token found in auth header: ', authHeader)
        return res.status(401).json({ message: 'Malformed auth header' })
    }
    console.log('found token')

    const { data: user, error } = await supabase.auth.getUser(token)

    console.log('authenticated user?')

    if(error || !user) return res.status(401).json({ message: 'Invalid or expired token' })

    req.user = user
    next()
}

app.get('/profile', authenticate, async (req, res) => {
    res.json({ email: req.user.email, username: req.user.user_metadata.username })
})

app.listen(3001, () => console.log('Server running on port 3001'))
