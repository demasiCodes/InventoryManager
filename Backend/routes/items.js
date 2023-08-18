const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://dandemasi:VMXryiCAa5dCCUPa@aeroinventory.hcydr3n.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });
const ItemSchema = new mongoose.Schema({
    name: String,
    quantity: Number,
    description: String,
});
const ItemModel = mongoose.model('Item', ItemSchema);
// Create an item
router.post('/', (req, res) => {
    // Retrieve item data from request body
    const newItem = req.body;

    ItemModel.create(newItem)
        .then(createdItem => {
            res.status(201).json(createdItem);
        })
        .catch(error => {
            console.error('Error creating item:', error);
            res.status(500).json({ error: 'Server error' });
        });
});
// Read all items
router.get('/', async (req, res) => {
    try {
        const items = await ItemModel.find();
        res.json(items);
    } catch (error) {
        console.error('Error fetching items:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
// Update an item
router.put('/:id', (req, res) => {
    const itemId = req.params.id;
    res.status(200).json({ message: `Item ${itemId} updated` }); //FIXME
});
// Delete an item
router.delete('/:id', (req, res) => {
    const itemId = req.params.id;
    // Delete the item with ID itemId (Replace this with database logic)
    res.status(204).send(); //FIXME
});
module.exports = router;