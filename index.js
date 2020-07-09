const searcherCore = require('./searcher.js')()
const express = require('express')
const cors = require('cors')
const app = express()
const PORT = process.env.PORT || 3033

app.use(cors())

app.get('/:search', async (req, res) => {
	try {
		const searcher = await searcherCore
		const results = await searcher(req.params.search)
		res.status(200).json(results)
	} catch(error) {
		console.error(error)
		res.status(500).json(error)
		return e
	}
})

app.listen(PORT, () => console.log(`Running in ${PORT} port.`))
