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
    // Handle item retrieval

});

app.put('/update/:itemId', async (req, res) => {
    // Handle item update
});

app.delete('/delete/:itemId', async (req, res) => {
    // Handle item deletion
});