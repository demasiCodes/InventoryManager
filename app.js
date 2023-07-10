window.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.querySelector('.search-bar button');
    const clearButton = document.getElementById('clear-button');

    searchButton.style.background = "transparent";
    searchInput.addEventListener('input', function () {
        const inputValue = searchInput.value;
        if (inputValue !== '') {
            clearButton.style.display = 'block';
        } else {
            clearButton.style.display = 'none';
        }
    });

    clearButton.addEventListener('click', function () {
        searchInput.value = '';
        clearButton.style.display = 'none';
    });
});