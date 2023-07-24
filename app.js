/******** Item Class ********/
class Item {
    constructor(name, quantity, description) {
        this.name = name;
        this.quantity = quantity;
        this.description = description;
        Item.itemCount++;
    }
    getName() {
        return this.name;
    }
    getQuantity() {
        return this.quantity;
    }
    getDescription() {
        return this.description;
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
window.addEventListener('DOMContentLoaded', function () {
    /******** Search Bar ********/
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
    // Add blocks
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
    function showModalAttributes(index) {
        const modal = document.getElementById('modalAttributes');
        const nameInput = document.getElementById('nameInput');
        const descriptionInput = document.getElementById('descriptionInput');
        const quantityInput = document.getElementById('quantityInput');
        // Show the modal
        modal.style.display = 'block';
        // Fill the input boxes with the current values
        nameInput.value = blocksData[index].getName();
        descriptionInput.value = blocksData[index].getDescription();
        quantityInput.value = blocksData[index].getQuantity();
        // Add event listener to the "Save Changes" button
        document.getElementById('saveChangesButton').addEventListener('click', function () {
            // Update the attributes with the new values
            blocksData[index].setName(nameInput.value);
            blocksData[index].setDescription(descriptionInput.value);
            blocksData[index].setQuantity(parseInt(quantityInput.value));
            saveBlocksData();
            renderBlocks();
            modal.style.display = 'none';
        });
        // Add event listener to the "Remove Item" button
        document.getElementById('removeItemButton').addEventListener('click', function () {
            // Remove the clicked block
            block.remove();
            // Remove the block data from the array
            blocksData.splice(index, 1);
            saveBlocksData();
            // Decrement item count
            Item.decrementItemCount();
            modal.style.display = 'none';
        });
        // Add event listener to the "Cancel" button
        document.getElementById('cancelButton').addEventListener('click', function () {
            modal.style.display = 'none';
        });
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