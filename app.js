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
    getPrice() {
        return this.price;
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
    let blocksData = [];
    // Load blocks from local storage
    if (localStorage.getItem('blocksData')) {
        blocksData = JSON.parse(localStorage.getItem('blocksData')).map(itemData => new Item(itemData.name, itemData.quantiy, itemData.description));
        renderBlocks();
    }
    // Add blocks
    addButton.addEventListener('click', function () {
        // Create a new block and item element
        const newItem = new Item('New Item', 0, 'Default description');
        const newBlock = document.createElement('div');
        newBlock.classList.add('block');
        newBlock.textContent = newItem.getName();
        // Append the new block to the container
        blockContainer.appendChild(newBlock);
        // Store the block data in the array
        blocksData.push(newItem);
        saveBlocksData();
        renderBlocks();
    });
    // Remove blocks
    blockContainer.addEventListener('click', function (event) {
        // Check if the click target is a block element
        if (event.target.classList.contains('block')) {
            // Remove the clicked block
            event.target.remove();
            // Remove the block data from the array
            const index = Array.from(blockContainer.children).indexOf(event.target);
            blocksData.splice(index, 1);
            saveBlocksData();
            // Decrement item count
            Item.decrementItemCount();
            renderBlocks();
        }
    });
    // Render storage
    function renderBlocks() {
        // Clear the block container
        blockContainer.innerHTML = '';
        // Create and append blocks based on the data array
        blocksData.forEach(function (item) {
            const block = document.createElement('div');
            block.classList.add('block');
            // Create a paragraph element for displaying the item name and description
            const itemInfo = document.createElement('p');
            itemInfo.textContent = item.getName() + ' \n ' + item.getDescription();
            // append info
            block.appendChild(itemInfo);
            blockContainer.appendChild(block);
        });
        // Update the item count display
        const itemCountElement = document.getElementById('item-count');
        itemCountElement.textContent = 'Total Items: ' + Item.getItemCount();
    }
    // Save blocks
    function saveBlocksData() {
        // Convert Item objects to plain data objects for storage
        const plainData = blocksData.map(item => ({ name: item.getName(), price: item.getPrice(), quantity: item.getQuantity() }));
        // Save the block data to local storage
        localStorage.setItem('blocksData', JSON.stringify(plainData));
    }
});
/******** End Item List ********/