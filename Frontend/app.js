/*** Server Setup *******/

/***End Server Setup *******/
/******** Item Class ********/
class Item {
    constructor(name, quantity, description) {
        this.name = name;
        this.quantity = quantity;
        this.description = description;
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
            filteredBlocks = searchBlocks(inputValue, blocksData);
        } else {
            filteredBlocks = blocksData;
            searchBarContainer.classList.remove('active'); // Remove the .active class
        }
        renderBlocks();
    });
    // Add an event listener for entering search input
    searchInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            const inputValue = searchInput.value;
            // Call the renderBlocks function with the search query
            filteredBlocks = searchBlocks(inputValue, blocksData);
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
    function searchBlocks(query, blocksData, maxDistance = 4) {
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
    }
    /******** End Search Algorithm ********/
/******** End Search Bar ********/
/******** Item List ********/
    const blockContainer = document.querySelector('.block-container');
    const addButton = document.getElementById('add-button');
    const modal = document.getElementById('myModal'); // new item pop-ups
    const confirmButton = document.getElementById('confirm'); // new item pop-ups
    const cancelButton = document.getElementById('cancel'); // new item pop-ups
    let blocksData = [];
    let filteredBlocks = [];
    // Function to sort the blocksData array alphabetically by item name
    function sortBlocksDataAlphabetically() {
        blocksData.sort((a, b) => {
            return a.getName().localeCompare(b.getName());
        });
    }
    // Load blocks from local storage
    if (localStorage.getItem('blocksData')) {
        blocksData = JSON.parse(localStorage.getItem('blocksData')).map(itemData => new Item(itemData.name, itemData.quantity, itemData.description));
        renderBlocks();
    }
    /**
     * Add Blocks
     */
    addButton.addEventListener('click', function () {
        modal.style.display = 'block';
    });
    confirmButton.addEventListener('click', function (event) {
        // Prevent the default form submission behavior
        event.preventDefault();
        // Prompt for user input
        const name = document.getElementById('name').value;
        const quantity = parseInt(document.getElementById('quantity').value);
        const description = document.getElementById('description').value;
        // Check if all fields are filled
        if (name && !isNaN(quantity) && description) {
            // Create a new block and item element
            const newItem = new Item(name, quantity, description);
            //send data to backend
            axios.post('/create', newItem)
                .then(response => {
                    // Handle Success
                    console.log('Item added:', response.data);
                    const newBlock = document.createElement('div');
                    newBlock.classList.add('block');
                    newBlock.textContent = newItem.getName();
                    // Append the new block to the container
                    blockContainer.appendChild(newBlock);
                    // Store the block data in the array
                    blocksData.push(newItem);
                    saveBlocksData();
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
        // Get the current search input value
        const searchInputValue = searchInput.value.trim();
        // Determine which array to use based on search input
        const arrayToRender = searchInputValue === '' ? blocksData : filteredBlocks;
        // Create and append blocks based on the data array
        arrayToRender.forEach(function (item, index) {
            const block = document.createElement('div');
            block.classList.add('block');
            // Create a container for item name and description
            const infoContainer = document.createElement('div');
            infoContainer.classList.add('info-container');
            // Create a paragraph element for displaying the item name and description
            const itemName = document.createElement('p');
            itemName.textContent = item.name; //FIXME
            itemName.classList.add('item-name'); // Add a class for styling
            // Create a paragraph element for displaying the item description
            const itemDescription = document.createElement('p');
            itemDescription.textContent = item.description; //FIXME
            itemDescription.classList.add('item-description');
            // Append name and description to the container
            infoContainer.appendChild(itemName);
            infoContainer.appendChild(itemDescription);
            // Create a paragraph element for displaying the quantity
            const quantityContainer = document.createElement('div');
            quantityContainer.classList.add('quantity-container');
            const quantityInfo = document.createElement('p');
            quantityInfo.textContent = item.quantity; //FIXME
            quantityInfo.classList.add('quantity-info'); // Add a class for styling
            quantityContainer.appendChild(quantityInfo);
            infoContainer.appendChild(quantityContainer);
            // append info
            block.appendChild(infoContainer);
            blockContainer.appendChild(block);
            //set attribute to keep track of index in blocksData
            block.setAttribute('ogIndex', blocksData.indexOf(item));
            // Add an event listener to each block for options
            block.addEventListener('click', function () {
                showModalAttributes(index, block);
            });
        });
        // Update the item count display
        const itemCountElement = document.getElementById('item-count');
        itemCountElement.textContent = Item.getItemCount();
    }
    /**
     * Edit Blocks
     */
    function showModalAttributes(index, block) {
        const modal = document.getElementById('modalAttributes');
        const nameInput = document.getElementById('nameInput');
        const descriptionInput = document.getElementById('descriptionInput');
        const quantityInput = document.getElementById('quantityInput');
        const saveChangesButton = document.getElementById('saveChangesButton');
        const removeItemButton = document.getElementById('removeItemButton');
        const cancelButton = document.getElementById('cancelButton');
        // Show the modal
        modal.style.display = 'block';
        // Retrieve the correct block data from the filteredBlocks array
        const ogIndex = parseInt(block.getAttribute('ogIndex'));
        const selectedBlockData = blocksData[ogIndex];
        // Fill the input boxes with the current values
        nameInput.value = selectedBlockData.getName();
        descriptionInput.value = selectedBlockData.getDescription();
        quantityInput.value = selectedBlockData.getQuantity();
        // Close the modal only when releasing the mouse button outside of the modal
        const clickOutsideModal = function (event) {
            if (event.target === modal) {
                modal.style.display = 'none';
                window.removeEventListener('click', clickOutsideModal);
                removeEventListeners();
            }
        };
        // Create named functions for event listeners
        const onSaveChangesClicked = function () {
            // Update the attributes with the new values
            const newName = nameInput.value;
            const newDescription = descriptionInput.value;
            const newQuantity = parseInt(quantityInput.value);
            if (newName.trim() !== '') {
                blocksData[ogIndex].setName(newName);
                filteredBlocks[index].setName(newName);
            }
            if (newDescription.trim() !== '') {
                blocksData[ogIndex].setDescription(newDescription);
                filteredBlocks[index].setDescription(newDescription);
            }
            if (!isNaN(newQuantity) && newQuantity.toString().trim() !== '') {
                blocksData[ogIndex].setQuantity(newQuantity);
                filteredBlocks[index].setQuantity(newQuantity);
            } else {
                alert('Quantity must be a valid number.');
                return;
            }
            saveBlocksData();
            renderBlocks();
            modal.style.display = 'none';
            removeEventListeners();
        };
        // Create named functions for event listeners
        const onRemoveItemClicked = function () {
            const confirmDelete = confirm('Are you sure you want to remove this item?');
            if (confirmDelete) {
                // Remove the clicked block
                block.remove();
                // Remove the block data from the array
                blocksData.splice(ogIndex, 1);
                filteredBlocks.splice(index, 1);
                Item.decrementItemCount();
                saveBlocksData();
                renderBlocks();
                modal.style.display = 'none';
                removeEventListeners();
            }
        };
        // Create named functions for event listeners
        const onCancelClicked = function () {
            modal.style.display = 'none';
            removeEventListeners();
        };
        // Add event listeners using the named functions
        saveChangesButton.addEventListener('click', onSaveChangesClicked);
        removeItemButton.addEventListener('click', onRemoveItemClicked);
        cancelButton.addEventListener('click', onCancelClicked);
        // Function to remove event listeners
        function removeEventListeners() {
            saveChangesButton.removeEventListener('click', onSaveChangesClicked);
            removeItemButton.removeEventListener('click', onRemoveItemClicked);
            cancelButton.removeEventListener('click', onCancelClicked);
        }
    }
    // Save blocks
    function saveBlocksData() {
        sortBlocksDataAlphabetically();
        // Convert Item objects to plain data objects for storage
        const plainData = blocksData.map(item => ({ name: item.getName(), quantity: item.getQuantity(), description: item.getDescription() }));
        // Save the block data to local storage
        localStorage.setItem('blocksData', JSON.stringify(plainData));
    }
});
/******** End Item List ********/