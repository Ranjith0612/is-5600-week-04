const fs = require('fs').promises
const path = require('path')
const express = require('express')

const port = process.env.PORT || 3000
const app = express()

app.use(express.json())
app.use(express.static(__dirname + '/public'))

app.get('/', handleRoot)
app.get('/products', listProducts)
app.get('/products/:id', getProduct)
app.post('/products', createProduct)
app.put('/products/:id', updateProduct)
app.delete('/products/:id', deleteProduct)

app.listen(port, () => console.log(`Server listening on port ${port}`))

function handleRoot(req, res) {
  res.sendFile(path.join(__dirname, '/index.html'))
}

async function listProducts(req, res) {
  const productsFile = path.join(__dirname, 'data/full-products.json')
  try {
    const data = await fs.readFile(productsFile)
    res.json(JSON.parse(data))
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

async function getProduct(req, res) {
  const productsFile = path.join(__dirname, 'data/full-products.json')
  try {
    const data = await fs.readFile(productsFile)
    const products = JSON.parse(data)
    // Fixed - using String comparison instead of parseInt
    const product = products.find(p => String(p.id) === String(req.params.id))
    if (!product) return res.status(404).json({ error: 'Product not found' })
    res.json(product)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

async function createProduct(req, res) {
  const productsFile = path.join(__dirname, 'data/full-products.json')
  try {
    const data = await fs.readFile(productsFile)
    const products = JSON.parse(data)
    const newProduct = {
      id: Date.now().toString(),
      ...req.body
    }
    products.push(newProduct)
    await fs.writeFile(productsFile, JSON.stringify(products))
    res.status(201).json(newProduct)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

async function updateProduct(req, res) {
  const productsFile = path.join(__dirname, 'data/full-products.json')
  try {
    const data = await fs.readFile(productsFile)
    const products = JSON.parse(data)
    // Fixed - using String comparison
    const index = products.findIndex(p => String(p.id) === String(req.params.id))
    if (index === -1) return res.status(404).json({ error: 'Product not found' })
    products[index] = { ...products[index], ...req.body }
    await fs.writeFile(productsFile, JSON.stringify(products))
    res.json(products[index])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

async function deleteProduct(req, res) {
  const productsFile = path.join(__dirname, 'data/full-products.json')
  try {
    const data = await fs.readFile(productsFile)
    const products = JSON.parse(data)
    // Fixed - using String comparison
    const index = products.findIndex(p => String(p.id) === String(req.params.id))
    if (index === -1) return res.status(404).json({ error: 'Product not found' })
    products.splice(index, 1)
    await fs.writeFile(productsFile, JSON.stringify(products))
    res.json({ message: 'Product deleted' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}