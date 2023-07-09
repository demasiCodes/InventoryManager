window.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('search-input');
    const searchIcon = document.getElementById('search-icon');
    const searchButton = document.querySelector('.search-bar button');

    searchInput.addEventListener('input', function () {
        const inputValue = searchInput.value;
        if (inputValue !== '') {
            searchIcon.style.fill = 'white'; // Change the color of the icon to white when there is input
            searchButton.style.background = 'green'; // Change the background color to green when there is input
        } else {
            searchIcon.style.fill = 'black'; // Revert the color of the icon to the original color when input is empty
            searchButton.style.background = 'rgb(154, 153, 153)'; // Revert the background color to the original color when input is empty
        }
    });
});