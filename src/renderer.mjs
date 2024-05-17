// all the elements needed
const closeBtn = document.querySelector('.close');
const modal = document.querySelector('.add-article-modal');
const addBtn = document.querySelector('#add-new-article');
const addArticleForm = document.querySelector('#add-article-form');
const searchInput = document.querySelector('#search');

//open the modal window when the add button is clicked
addBtn.addEventListener('click', () => {
    modal.style.display = 'block';

    // get data when submit button is clicked
    addArticleForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.querySelector('#title').value;
        const content = document.querySelector('#content').value;
        console.log(title, content);
        // addArticle(title, content);
        console.log(window.api)
        const id = window.api.uuid;
        window.api.send('database-operation', { operation: 'insert', data: [id, title, content] });
        modal.style.display = 'none';
    });
});

// close the modal window when the close button is clicked
closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

// listen for enter key press and get the data in input field
// TODO: implement complete search functionality
searchInput.addEventListener('keyup', async(e) => {
    if (e.key === 'Enter') {
        const searchValue = searchInput.value;
        console.log(searchValue);

        // get all articles
        try {
            const result = await window.api.send('database-operation', { operation: 'select' });
            console.log(result);
            // TODO: dislay the search result
        } catch (error) {
            console.error(error);
        }
    }
});

// listen for the database operation reply
window.api.receive('database-operation-reply', (data) => {
    console.log('Database operation reply:', data);
});