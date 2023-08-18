const express = require('express');
const app = express();
const itemsRoute = require('./routes/items');
const port = process.env.PORT || 3000; // Use the specified port or 3000 as a default

// Mount the items route at the /items path
app.use('/items', itemsRoute);

// Define a route for the root URL
app.get('/', (req, res) => {
    res.send('Hello, Express!');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});