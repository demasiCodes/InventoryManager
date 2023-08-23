/*** Server Setup *******/

/***End Server Setup *******/
/******** Item Class ********
class Item {
    constructor(name, quantity, description, id) {
        this.name = name;
        this.quantity = quantity;
        this.description = description;
        this._id = id;
        Item.itemCount++;
    }
    //getters
    getName() {
        return this.name;
    }
    getQuantity() {
        return this.quantity;
    }
    getDescription() {
        return this.description;
    }
    getId() {
        return this._id;
    }
    //setters
    setName(n) {
        this.name = n;
    }
    setDescription(d) {
        this.description = d;
    }
    setQuantity(q) {
        this.quantity = q;
    }
    setId(id) {
        this._id = id;
    }
    static decrementItemCount() {
        Item.itemCount--;
    }
    static getItemCount() {
        return Item.itemCount;
    }
}
Item.itemCount = 0;
/******** End Item Class ********/
/******** Search Bar ********/
window.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('search-input');
    const clearButton = document.getElementById('clear-button');
    const searchBarContainer = document.querySelector('.search-bar-container');
    searchInput.addEventListener('input', function () {
        const inputValue = searchInput.value;
        if (inputValue !== '') {
            searchBarContainer.classList.add('active'); // Add the .active class
            //filteredBlocks = searchBlocks(inputValue, blocksData);
        } else {
            //filteredBlocks = blocksData;
            searchBarContainer.classList.remove('active'); // Remove the .active class
        }
        renderBlocks();
    });
    // Add an event listener for entering search input
    searchInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            const inputValue = searchInput.value;
            // Call the renderBlocks function with the search query
            //filteredBlocks = searchBlocks(inputValue, blocksData);
            renderBlocks();
            // Prevent the default behavior of the Enter key (form submission)
            event.preventDefault();
        }
    });
    clearButton.addEventListener('click', function () {
        searchInput.value = '';
        renderBlocks();
        searchBarContainer.classList.remove('active'); // Remove the .active class
    });
    /******** Search Algorithm ********/
    function calculateLevenshteinDistance(a, b) {
        // Remove spaces and non-alphabetic characters and convert to lowercase
        a = a.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        b = b.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        const dp = Array.from(Array(a.length + 1), () => Array(b.length + 1).fill(0));
        for (let i = 0; i <= a.length; i++) {
            for (let j = 0; j <= b.length; j++) {
                if (i === 0) {
                    dp[i][j] = j;
                } else if (j === 0) {
                    dp[i][j] = i;
                } else {
                    dp[i][j] = Math.min(
                        dp[i - 1][j - 1] + (a[i - 1] !== b[j - 1] ? 1 : 0),
                        dp[i][j - 1] + 1,
                        dp[i - 1][j] + 1
                    );
                }
            }
        }
        return dp[a.length][b.length];
    }
    /*function searchBlocks(query, blocksData, maxDistance = 4) {
        const results = [];
        for (const blockData of blocksData) {
            const itemName = blockData.name;
            const distance = calculateLevenshteinDistance(query, itemName);
            if (distance <= maxDistance) {
                results.push({ blockData, distance });
            }
        }
        results.sort((a, b) => a.distance - b.distance);
        const orderedBlocks = results.map(result => result.blockData);
        return orderedBlocks;
    } */
    /******** End Search Algorithm ********/
/******** End Search Bar ********/
/******** Item List ********/
    const blockContainer = document.querySelector('.block-container');
    const addButton = document.getElementById('add-button');
    const modal = document.getElementById('myModal'); // new item pop-ups
    const confirmButton = document.getElementById('confirm'); // new item pop-ups
    const cancelButton = document.getElementById('cancel'); // new item pop-ups
    //let blocksData = []; //REMOVE
    //let filteredBlocks = [];
    /*async function initializeApp() { // DO I NEED THIS???
        try {
            // Fetch data from the backend using an HTTP request
            const response = await axios.get('http://localhost:3000/items');
            renderBlocks(); // Call a rendering function to display the blocks
        } catch (error) {
            console.error('Error initializing app:', error);
        }
    }
    initializeApp(); */
    // initilize app
    renderBlocks();
    // Function to sort the blocksData array alphabetically by item name
    /*function sortBlocksDataAlphabetically() {
        blocksData.sort((a, b) => {
            return a.getName().localeCompare(b.getName());
        });
    } */
    /**
     * Add Blocks
     */
    addButton.addEventListener('click', function () {
        modal.style.display = 'block';
    });
    document.getElementById('inventoryForm').addEventListener('submit', function (event) {
        // Prevent the default form submission behavior
        event.preventDefault();
        // Prompt for user input
        const name = document.getElementById('name').value;
        const quantity = parseInt(document.getElementById('quantity').value);
        const description = document.getElementById('description').value;
        // Check if all fields are filled
        if (name && !isNaN(quantity) && description) {
            // Create a new block and item element
            const newItem = {
                name: name,
                quantity: quantity,
                description: description
            };
            //send data to backend
            axios.post('http://localhost:3000/create', newItem) //FIXME ************************************
                .then(response => {
                    // Handle Success
                    console.log('Item added:', response.data);
                    const newBlock = document.createElement('div');
                    newBlock.classList.add('block');
                    newBlock.textContent = newItem.name;
                    // Set the data-id attribute to store the MongoDB _id
                    newBlock.setAttribute('data-id', response.data);
                    // Append the new block to the container
                    blockContainer.appendChild(newBlock);
                    //Fetch and Render updated backend
                    renderBlocks();
                    // Close the modal after adding the item
                    clearInputFields();
                    modal.style.display = 'none';
                })
                .catch(error => {
                    // Handle error
                    console.error('Error adding item:', error);
                });
        } 
        else if (isNaN(quantity)) {
            alert('Please set quantity to valid number.');
        }
        else {
            alert('Please fill in all fields.');
        }
    });
    function clearInputFields() {
        document.getElementById('name').value = '';
        document.getElementById('quantity').value = '';
        document.getElementById('description').value = '';
    }
    cancelButton.addEventListener('click', function () {
        // Close the modal without adding the item
        clearInputFields();
        modal.style.display = 'none';
    });
    // Render storage
    function renderBlocks() {
        // Clear the block container
        blockContainer.innerHTML = '';
        // Fetch data from the backend using GET request to /items
        axios.get('http://localhost:3000/items')
            .then(response => {
                const items = response.data;
                /*// Get the current search input value
                const searchInputValue = searchInput.value.trim();
                // Determine which array to use based on search input
                const arrayToRender = searchInputValue === '' ? blocksData : filteredBlocks; */
                // Create and append blocks based on the data array
                items.forEach(item => {
                    const block = document.createElement('div');
                    block.classList.add('block');
                    // Set the MongoDB _id as an attribute
                    block.setAttribute('data-id', item._id);
                    // Create a container for item name and description
                    const infoContainer = document.createElement('div');
                    infoContainer.classList.add('info-container');
                    // Create a paragraph element for displaying the item name and description
                    const itemName = document.createElement('p');
                    itemName.textContent = item.name;
                    itemName.classList.add('item-name'); // Add a class for styling
                    // Create a paragraph element for displaying the item description
                    const itemDescription = document.createElement('p');
                    itemDescription.textContent = item.description; 
                    itemDescription.classList.add('item-description');
                    // Append name and description to the container
                    infoContainer.appendChild(itemName);
                    infoContainer.appendChild(itemDescription);
                    // Create a paragraph element for displaying the quantity
                    const quantityContainer = document.createElement('div');
                    quantityContainer.classList.add('quantity-container');
                    const quantityInfo = document.createElement('p');
                    quantityInfo.textContent = item.quantity;
                    quantityInfo.classList.add('quantity-info'); // Add a class for styling
                    quantityContainer.appendChild(quantityInfo);
                    infoContainer.appendChild(quantityContainer);
                    // append info
                    block.appendChild(infoContainer);
                    blockContainer.appendChild(block);
                    // Add an event listener to each block for options
                    block.addEventListener('click', function () {
                        showModalAttributes(block);
                    });
                });
                // Update the item count display
                const itemCountElement = document.getElementById('item-count');
                itemCountElement.textContent = items.length;
            })
            .catch(error => {
                console.error('Error fetching items:', error);
            });
    }
    /**
     * Edit Blocks
     */
    function showModalAttributes(block) {
        const modal = document.getElementById('modalAttributes');
        const nameInput = document.getElementById('nameInput');
        const descriptionInput = document.getElementById('descriptionInput');
        const quantityInput = document.getElementById('quantityInput');
        const saveChangesButton = document.getElementById('saveChangesButton');
        const removeItemButton = document.getElementById('removeItemButton');
        const cancelButton = document.getElementById('cancelButton');
        // Show the modal
        modal.style.display = 'block';
        // Retrieve the id of the clicked block
        const id = block.getAttribute('data-id');
        axios.get(`http://localhost:3000/items/${id}`)
            .then(response => {
                const selectedItem = response.data;
                // Fill the input boxes with the current values
                nameInput.value = selectedItem.name;
                descriptionInput.value = selectedItem.description;
                quantityInput.value = selectedItem.quantity;
                // Create named functions for event listeners
                const onSaveChangesClicked = function (event) {
                    event.preventDefault();
                    // Update the attributes with the new values
                    const newName = nameInput.value;
                    const newDescription = descriptionInput.value;
                    const newQuantity = parseInt(quantityInput.value);
                    if (newName.trim() !== '' && newDescription.trim() !== '' && !isNaN(newQuantity)) {
                        const updatedItem = {
                            name: newName,
                            description: newDescription,
                            quantity: newQuantity
                        };
                        axios.put(`http://localhost:3000/items/${id}`, updatedItem)
                            .then(response => {
                                console.log('Item updated:', response.data);
                                renderBlocks();
                                modal.style.display = 'none';
                                removeEventListeners();
                            })
                            .catch(error => {
                                console.error('Error updating item:', error);
                            });
                    } else {
                        alert('Please fill in all fields and provide a valid quantity.');
                    }
                };
                // Create named functions for event listeners
                const onRemoveItemClicked = function (event) {
                    event.preventDefault();
                    const confirmDelete = confirm('Are you sure you want to remove this item?');
                    if (confirmDelete) {
                        axios.delete(`http://localhost:3000/items/${id}`)
                            .then(() => {
                                // Remove the clicked block
                                block.remove();
                                // Update the item count display
                                const itemCountElement = document.getElementById('item-count');
                                itemCountElement.textContent = parseInt(itemCountElement.textContent) - 1;
                            })
                            .catch(error => {
                                console.error('Error deleting item:', error);
                            })
                            .finally(() => {
                                renderBlocks();
                                modal.style.display = 'none';
                                removeEventListeners();
                            });
                    }
                };
                // Create named functions for event listeners
                const onCancelClicked = function () {
                    modal.style.display = 'none';
                    removeEventListeners();
                };
                // Add event listeners using the named functions
                document.getElementById('editForm').addEventListener('submit', onSaveChangesClicked);
                document.getElementById('deleteForm').addEventListener('submit', onRemoveItemClicked);
                cancelButton.addEventListener('click', onCancelClicked);
                // Function to remove event listeners
                function removeEventListeners() {
                    saveChangesButton.removeEventListener('submit', onSaveChangesClicked);
                    removeItemButton.removeEventListener('click', onRemoveItemClicked);
                    cancelButton.removeEventListener('click', onCancelClicked);
                }
            })
            .catch(error => {
                console.error('Error fetching item details:', error);
            });
    }
    // Save blocks
    /*function saveBlocksData() {
        sortBlocksDataAlphabetically();
        // Convert Item objects to plain data objects for storage
        const plainData = blocksData.map(item => ({ name: item.getName(), quantity: item.getQuantity(), description: item.getDescription() }));
        // Save the block data to local storage
        localStorage.setItem('blocksData', JSON.stringify(plainData));
    } */
});
/******** End Item List ********/