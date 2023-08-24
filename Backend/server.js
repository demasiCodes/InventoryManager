//connection to database
const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://dandemasi:VMXryiCAa5dCCUPa@aeroinventory.hcydr3n.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);
const collection = client.db("Inventory").collection("Items");

//connection to frontend
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
app.use(express.json());
const allowedOrigins = [
    'https://demasicodes.github.io',
    'http://127.0.0.1:5500',
];
app.use(cors({
    origin: allowedOrigins,
}));

// Start the Express server
client.connect()
    .then(() => {
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch(error => {
        console.error('Error connecting to database:', error);
    });

app.post('/create', async (req, res) => {
    // Handle item creation
    const newItemData = req.body;
    try {
        const result = await collection.insertOne(newItemData);
        res.status(201).json(result.insertedId); // Return the inserted documents id
    } catch (error) {
        console.error('Error creating item:', error);
        res.status(500).json({ error: 'Failed to create item' });
    }
});

app.get('/items', async (req, res) => {
    try {
        const items = await collection.find().toArray();
        res.status(200).json(items);
    } catch (error) {
        console.error('Error fetching items:', error);
        res.status(500).json({ error: 'Failed to fetch items' });
    }
});

// GET route to fetch item details by ID
const { ObjectId } = require('mongodb');
app.get('/items/:id', async (req, res) => {
    const itemId = req.params.id;
    try {
        const result = await collection.findOne({ _id: new ObjectId(itemId) });

        if (result) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ error: 'Item not found' });
        }
    } catch (error) {
        console.error('Error fetching item details:', error);
        res.status(500).json({ error: 'Failed to fetch item details' });
    }
});

app.put('/items/:id', async (req, res) => {
    const itemId = req.params.id;
    const updatedItemData = req.body;
    try {
        const result = await collection.updateOne(
            { _id: new ObjectId(itemId) },
            { $set: updatedItemData }
        );

        if (result.modifiedCount > 0) {
            res.status(200).json({ message: 'Item updated successfully' });
        } else {
            res.status(404).json({ error: 'Item not found' });
        }
    } catch (error) {
        console.error('Error updating item:', error);
        res.status(500).json({ error: 'Failed to update item' });
    }
});

app.delete('/items/:id', async (req, res) => {
    const itemId = req.params.id;
    try {
        const result = await collection.deleteOne({ _id: new ObjectId(itemId) });
        if (result.deletedCount === 1) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Item not found' });
        }
    } catch (error) {
        console.error('Error deleting item:', error);
        res.status(500).json({ error: 'Failed to delete item' });
    }
});

app.get('/items/search/:query', async (req, res) => {
    const searchQuery = req.params.query;
    try {
        const regex = new RegExp(searchQuery, 'i'); // Case-insensitive search
        const searchResults = await collection.find({
            $or: [
                { name: { $regex: regex } },
                { description: { $regex: regex } }
            ]
        })
            .sort({ score: -1 })
            .toArray();

        res.status(200).json(searchResults);
    } catch (error) {
        console.error('Error searching items:', error);
        res.status(500).json({ error: 'Failed to search items' });
    }
});