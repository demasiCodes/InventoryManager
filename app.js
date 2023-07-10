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
    /******** Item List ********/
    const blockContainer = document.querySelector('.block-container');
    const addButton = document.getElementById('add-button');
    let blocksData = [];
    // Load blocks from local storage
    if (localStorage.getItem('blocksData')) {
        blocksData = JSON.parse(localStorage.getItem('blocksData'));
        renderBlocks();
    }
    addButton.addEventListener('click', function () {
        // Create a new block element
        const newBlock = document.createElement('div');
        newBlock.classList.add('block');
        newBlock.textContent = 'New Block';
        // Append the new block to the container
        blockContainer.appendChild(newBlock);
        // Store the block data in the array
        blocksData.push('New Block');
        saveBlocksData();
    });
    blockContainer.addEventListener('click', function (event) {
        // Check if the click target is a block element
        if (event.target.classList.contains('block')) {
            // Remove the clicked block
            event.target.remove();
            // Remove the block data from the array
            const index = Array.from(blockContainer.children).indexOf(event.target);
            blocksData.splice(index, 1);
            saveBlocksData();
        } 
    });
    // Render storage
    function renderBlocks() {
        // Clear the block container
        blockContainer.innerHTML = '';

        // Create and append blocks based on the data array
        blocksData.forEach(function (blockText) {
            const block = document.createElement('div');
            block.classList.add('block');
            block.textContent = blockText;
            blockContainer.appendChild(block);
        });
    }
    function saveBlocksData() {
        // Save the block data to local storage
        localStorage.setItem('blocksData', JSON.stringify(blocksData));
    }
});