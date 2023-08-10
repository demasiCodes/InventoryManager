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
        } else {
            searchBarContainer.classList.remove('active'); // Remove the .active class
        }
    });
    clearButton.addEventListener('click', function () {
        searchInput.value = '';
        searchBarContainer.classList.remove('active'); // Remove the .active class
    });
    /******** End Search Bar ********/
    /******** Item List ********/
    const blockContainer = document.querySelector('.block-container');
    const addButton = document.getElementById('add-button');
    const modal = document.getElementById('myModal'); // new item pop-ups
    const confirmButton = document.getElementById('confirm'); // new item pop-ups
    const cancelButton = document.getElementById('cancel'); // new item pop-ups
    let blocksData = [];
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
    confirmButton.addEventListener('click', function () {
        // Prompt for user input
        const name = document.getElementById('name').value;
        const quantity = parseInt(document.getElementById('quantity').value);
        const description = document.getElementById('description').value;
        // Check if all fields are filled
        if (name && !isNaN(quantity) && description) {
            // Create a new block and item element
            const newItem = new Item(name, quantity, description);
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
    // Close the modal when clicking anywhere outside of the modal
    window.addEventListener('click', function (event) {
        if (event.target === modal) {
            modal.style.display = 'none'; 
        }
    });
    // Render storage
    function renderBlocks() {
        // Clear the block container
        blockContainer.innerHTML = '';
        // Create and append blocks based on the data array
        blocksData.forEach(function (item, index) {
            const block = document.createElement('div');
            block.classList.add('block');
            // Create a paragraph element for displaying the item name and description
            const itemInfo = document.createElement('p');
            itemInfo.textContent = item.getName() + ' : ' + item.getDescription() + ' : ' + item.getQuantity();
            // append info
            block.appendChild(itemInfo);
            blockContainer.appendChild(block);
            // Add an event listener to each block for options
            block.addEventListener('click', function () {
                showModalAttributes(index);
            });
        });
        // Update the item count display
        const itemCountElement = document.getElementById('item-count');
        itemCountElement.textContent = 'Total Items: ' + Item.getItemCount();
    }
    /**
     * Edit Blocks
     */
    function showModalAttributes(index) {
        const modal = document.getElementById('modalAttributes');
        const nameInput = document.getElementById('nameInput');
        const descriptionInput = document.getElementById('descriptionInput');
        const quantityInput = document.getElementById('quantityInput');
        const saveChangesButton = document.getElementById('saveChangesButton');
        const removeItemButton = document.getElementById('removeItemButton');
        const cancelButton = document.getElementById('cancelButton');
        // Show the modal
        modal.style.display = 'block';
        // Fill the input boxes with the current values
        nameInput.value = blocksData[index].getName();
        descriptionInput.value = blocksData[index].getDescription();
        quantityInput.value = blocksData[index].getQuantity();
        // Close the modal only when releasing the mouse button outside of the modal
        const clickOutsideModal = function (event) {
            if (event.target === modal) {
                modal.style.display = 'none';
                window.removeEventListener('click', clickOutsideModal);
                removeEventListeners();
            }
        };
        window.addEventListener('click', clickOutsideModal);
        // Create named functions for event listeners
        const onSaveChangesClicked = function () {
            // Update the attributes with the new values
            const newName = nameInput.value;
            const newDescription = descriptionInput.value;
            const newQuantity = parseInt(quantityInput.value);
            if (newName.trim() !== '') {
                blocksData[index].setName(newName);
            }
            if (newDescription.trim() !== '') {
                blocksData[index].setDescription(newDescription);
            }
            if (!isNaN(newQuantity) && newQuantity.toString().trim() !== '') {
                blocksData[index].setQuantity(newQuantity);
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
            // Remove the clicked block
            block.remove();
            // Remove the block data from the array
            blocksData.splice(index, 1);
            saveBlocksData();
            // Decrement item count
            Item.decrementItemCount();
            modal.style.display = 'none';
            removeEventListeners();
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
        // Convert Item objects to plain data objects for storage
        const plainData = blocksData.map(item => ({ name: item.getName(), quantity: item.getQuantity(), description: item.getDescription() }));
        // Save the block data to local storage
        localStorage.setItem('blocksData', JSON.stringify(plainData));
    }
});
/******** End Item List ********/