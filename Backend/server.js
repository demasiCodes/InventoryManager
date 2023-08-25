//connection to database
const { MongoClient, ObjectId } = require('mongodb');
const client = new MongoClient(process.env.MONGODB_CONNECTION_STRING);

/*connection to frontend* ///for testing locally
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
/*connection to frontend*/

exports.handler = async (event, context) => {
    try {
        await client.connect();
        const db = client.db("Inventory");
        const collection = db.collection("Items");
        const responseHeaders = {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*', // FIXME put github url
        };
        const httpMethod = event.httpMethod;
        const path = event.path;
        if (httpMethod === 'POST' && path === '/create') {
            const newItemData = JSON.parse(event.body);
            try {
                const result = await collection.insertOne(newItemData);
                return {
                    statusCode: 201,
                    headers: responseHeaders,
                    body: JSON.stringify({ insertedId: result.insertedId }),
                };
            } catch (error) {
                console.error('Error creating item:', error);
                return {
                    statusCode: 500,
                    headers: responseHeaders,
                    body: JSON.stringify({ error: 'Failed to create item' }),
                };
            }
        } else if (event.httpMethod === 'GET') {
            if (event.path === '/items') {
                try {
                    const items = await collection.find().toArray();
                    return {
                        statusCode: 200,
                        headers: responseHeaders,
                        body: JSON.stringify(items),
                    };
                } catch (error) {
                    console.error('Error fetching items:', error);
                    return {
                        statusCode: 500,
                        headers: responseHeaders,
                        body: JSON.stringify({ error: 'Failed to fetch items' }),
                    };
                }
            } else if (event.path === '/items/{id}') {
                const itemId = event.pathParameters.id;
                try {
                    const result = await collection.findOne({ _id: new ObjectId(itemId) });
                    if (result) {
                        return {
                            statusCode: 200,
                            headers: responseHeaders,
                            body: JSON.stringify(result),
                        };
                    } else {
                        return {
                            statusCode: 404,
                            headers: responseHeaders,
                            body: JSON.stringify({ error: 'Item not found' }),
                        };
                    }
                } catch (error) {
                    console.error('Error fetching item details:', error);
                    return {
                        statusCode: 500,
                        headers: responseHeaders,
                        body: JSON.stringify({ error: 'Failed to fetch item details' }),
                    };
                }
            } else if (event.path === '/items/search/{query}') {
                const searchQuery = event.pathParameters.query;
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
                    
                    return {
                        statusCode: 200,
                        headers: responseHeaders,
                        body: JSON.stringify(searchResults),
                    };
                } catch (error) {
                    console.error('Error searching items:', error);
                    return {
                        statusCode: 500,
                        headers: responseHeaders,
                        body: JSON.stringify({ error: 'Failed to search items' }),
                    };
                }
            }
        } else if (event.httpMethod === 'PUT' && path === '/items/{id}') {
            const itemId = event.pathParameters.id;
            const updatedItemData = JSON.parse(event.body);
            try {
                const result = await collection.updateOne(
                    { _id: new ObjectId(itemId) },
                    { $set: updatedItemData }
                );
                if (result.modifiedCount > 0) {
                    return {
                        statusCode: 200,
                        headers: responseHeaders,
                        body: JSON.stringify({ message: 'Item updated successfully' }),
                    };
                } else {
                    return {
                        statusCode: 404,
                        headers: responseHeaders,
                        body: JSON.stringify({ error: 'Item not found' }),
                    };
                }
            } catch (error) {
                console.error('Error updating item:', error);
                return {
                    statusCode: 500,
                    headers: responseHeaders,
                    body: JSON.stringify({ error: 'Failed to update item' }),
                };
            }
        } else if (event.httpMethod === 'DELETE' && path === '/items/{id}') {
            const itemId = event.pathParameters.id;
            try {
                const result = await collection.deleteOne({ _id: new ObjectId(itemId) });
                if (result.deletedCount === 1) {
                    return {
                        statusCode: 204,
                        headers: responseHeaders,
                        body: JSON.stringify({}),
                    };
                } else {
                    return {
                        statusCode: 404,
                        headers: responseHeaders,
                        body: JSON.stringify({ error: 'Item not found' }),
                    };
                }
            } catch (error) {
                console.error('Error deleting item:', error);
                return {
                    statusCode: 500,
                    headers: responseHeaders,
                    body: JSON.stringify({ error: 'Failed to delete item' }),
                };
            }
        }

        return {
            statusCode: 404,
            headers: responseHeaders,
            body: JSON.stringify({ error: 'Route not found' })
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers: responseHeaders,
            body: JSON.stringify({ error: 'Internal server error' })
        };
    } finally {
        await client.close();
    }
};

/* Can't use express for lambda *
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
*/