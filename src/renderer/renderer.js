// all the elements needed
const closeBtn = document.querySelector('.close');
const modal = document.querySelector('.add-article-modal');
const addBtn = document.querySelector('#add-new-article');

//open the modal window when the add button is clicked
addBtn.addEventListener('click', () => {
    modal.style.display = 'block';
});

// close the modal window when the close button is clicked
closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});