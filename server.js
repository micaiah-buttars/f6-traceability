const express = require('express')
const path = require('path')
const Rollbar = require('rollbar')

const rollbar = new Rollbar({
    accessToken: '9e6cc8be40434a038c3e215e98486daa',
    captureUncaught: true,
    captureUnhandledRejections: true
})

const app = express()

app.use(express.json())

let words = []

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'))
    rollbar.info('HTML file served successfully')
})

app.post('/api/word', (req,res) => {
    let {word} = req.body
    word = word.trim()

    const index = words.findIndex(existingWord => existingWord === word)

    if(index === -1 && word !== ''){
        words.push(word)
        rollbar.log('Word added successfully', {author: 'Micaiah', type: 'manual entry'})
        res.status(200).send(words)
    } else if (word === ''){
        rollbar.error('No word given')
        res.status(400).send('Must provide a word.')
    } else {
        rollbar.error('Word is already in list')
        res.status(400).send('that word is listed already')
    }
    
    
})

const port = process.env.PORT || 4554

app.use(rollbar.errorHandler())

app.listen(port, () => console.log(`Take us to warp ${port}!`))