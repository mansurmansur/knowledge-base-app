/**
 * Represents the main renderer script for the knowledge base app.
 */

// all the elements needed
const addBtn = document.querySelector('#add-new-article');
const searchInput = document.querySelector('#search');
const mainContent = document.querySelector('.main');
const homeBtn = document.querySelector('.logo');

/**
 * Loads the specified page based on the given page name and data.
 * @param {string} page - The name of the page to load.
 * @param {object} data - The data to pass to the loaded page.
 * @returns {Promise<void>} - A promise that resolves when the page is loaded.
 */
const loadPage = async (page, data) => {
    switch (page) {
        case 'add-article':
            await loadAddArticle();
            break;
        case 'display-article':
            await loadDisplayArticle(data);
            break;
        case 'edit-article':
            await loadEditArticle(data);
            break;
        case 'search':
            loadSearch();
            break;
        default:
            loadhome();
    }
}

//open add article when the add button is clicked
addBtn.addEventListener('click', async () => {
    await loadPage('add-article', null);
});

// home button
homeBtn.addEventListener('click', () => {
    loadPage('home', null);
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
            // TODO: display the search result
        } catch (error) {
            console.error(error);
        }
    }
});

/**
 * Loads the add article page.
 * @returns {void}
 */
const loadAddArticle = () => {
    // get add article page
    fetch('./addarticle.html')
        .then(response => response.text())
        .then(data => {
            // display the add article page
            mainContent.innerHTML = data;

            // get the submit button
            const addArticleForm = document.querySelector('.submit');

            // add editor
            const quill = new Quill('#content', {
                theme: 'snow'
            }); 

            // listen for form submit
            // get data when submit button is clicked
            addArticleForm.addEventListener('click', (e) => {
                e.preventDefault();
                const title = document.querySelector('#title').value;
                let tempTags = document.querySelector('#tags').value;
                const tags = tempTags.split(',');
                const content = quill.root.innerHTML;
                const id = window.api.uuid;
                window.api.send('database-operation', { operation: 'insert', data: [id, title, content], tags: tags});

                //clear the form
                document.querySelector('#title').value = '';
                document.querySelector('#tags').value = '';
                quill.root.innerHTML = '';
            });

        })
        .catch(error => console.error(error));
}

/**
 * Loads the display article page.
 * @param {object} article - The article to display.
 * @returns {void}
 */
const loadDisplayArticle = (article) => {
    // get display article page
    fetch('./displayarticle.html')
        .then(response => response.text())
        .then(data => {
            mainContent.innerHTML = data;

            // get the display-article-content
            const displayArticleContent = document.querySelector('.display-article-content');

            // title
            const title = document.createElement('div');
            title.classList.add('title');
            title.textContent = article.title;
            displayArticleContent.appendChild(title);

            // tags
            const tags = document.createElement('div');
            tags.classList.add('tags');
            tags.textContent = article.tags;

            // content
            const content = document.createElement('div');
            content.classList.add('content');
            content.innerHTML = article.content;
            displayArticleContent.appendChild(content);
        })
        .catch(error => console.error(error));
}

/**
 * Loads the search page.
 * @returns {void}
 */
const loadSearch = () => {
    console.log('Search Page');
    // get search page
    fetch('./search.html')
        .then(response => response.text())
        .then(data => {
            console.log(data);
            mainContent.innerHTML = data;
        })
        .catch(error => console.error(error));
}

/**
 * Loads the home page.
 * @returns {void}
 */
const loadhome = () => {
    // get home page
    fetch('./home.html')
        .then(response => response.text())
        .then(data => {
            mainContent.innerHTML = data;
            // get all articles
            try {
                const articles = fetchAllArticles();
                articles.then(articles =>
                displayAllArticles(articles));
            } catch (error) {
                console.error(error);
            }
        })
        .catch(error => console.error(error));
}

/**
 * Loads the edit article page.
 * @param {object} article - The article to edit.
 * @returns {void}
 * */
const loadEditArticle = (article) => {
    // get edit article page
    fetch('./editarticle.html')
        .then(response => response.text())
        .then(data => {
            mainContent.innerHTML = data;

            // add editor
            const quill = new Quill('#content', {
                theme: 'snow'
            });

            // get all the elements
            const title = document.querySelector('#title');
            const tags = document.querySelector('#tags');
            const content = document.querySelector('#content');
            const editArticleForm = document.querySelector('.submit');
            const cancel = document.querySelector('.cancel');

            // set the values
            title.value = article.title;
            tags.value = article.tags;
            quill.root.innerHTML = article.content;

    
            // listen for form submit
            // get data when submit button is clicked
            editArticleForm.addEventListener('click', (e) => {
                e.preventDefault();
                const title = document.querySelector('#title').value;
                let tempTags = document.querySelector('#tags').value;
                const newTags = tempTags.split(',');
                const content = quill.root.innerHTML;
                const id = article.id;
                window.api.send('database-operation', { operation: 'update', data: [title, content, id], tags: newTags});
            });

            // listen for cancel button
            cancel.addEventListener('click', () => {
                loadPage('home', null);
            });
            
        })
        .catch(error => console.error(error));
}

/**
 * Fetches all articles from the database.
 * @returns {Promise<Array<object>>} - A promise that resolves to an array of articles.
 */
const fetchAllArticles = async () => {
    try {
        const result = await window.api.invoke('invoke-operation', { operation: 'selectAll' });
        return result;
    } catch (error) {
        console.error(error);
        return [];
    }
}

/**
 * Displays all articles on the home page.
 * @param {Array<object>} articles - The articles to display.
 * @returns {void}
 */
const displayAllArticles = (articles) => {
    const articlesContainer = document.querySelector('.home-content');

    articles.forEach(article => {
        const articleDiv = document.createElement('div');
        articleDiv.classList.add('article');
        // article info
        const articleInfo = document.createElement('div');
        articleInfo.classList.add('article-info');
        // id
        const id = document.createElement('div');
        id.classList.add('id');
        id.textContent = article.id;
        articleInfo.appendChild(id);
        // title
        const title = document.createElement('div');
        title.classList.add('title');
        title.textContent = article.title;
        articleInfo.appendChild(title);
        // created date
        const createdDate = document.createElement('div');
        createdDate.classList.add('created-date');
        createdDate.textContent = article.created_at;
        articleInfo.appendChild(createdDate);
        articleDiv.appendChild(articleInfo);

        // button container
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('button-container');
        // view button
        const viewButton = document.createElement('div');
        viewButton.classList.add('view-button');
        viewButton.textContent = 'View';
        viewButton.addEventListener('click', async (e) => {
            const id = e.target.parentElement.parentElement.querySelector('.id').textContent;
            const article = await window.api.invoke('invoke-operation', { operation: 'select', id });
            loadPage('display-article', article);
        });
        buttonContainer.appendChild(viewButton);
        // edit button
        const editButton = document.createElement('div');
        editButton.classList.add('edit-button');
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', async (e) => {                                               // implement edit article
            const id = e.target.parentElement.parentElement.querySelector('.id').textContent;
            const article = await window.api.invoke('invoke-operation', { operation: 'select', id });
            loadPage('edit-article', article);
        });
        buttonContainer.appendChild(editButton);
        // delete button
        const deleteButton = document.createElement('div');
        deleteButton.classList.add('delete-button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', async (e) => {
            const id = e.target.parentElement.parentElement.querySelector('.id').textContent;
            const result = await window.api.invoke('invoke-operation', { operation: 'delete', id});
            if (result) {
                alert('Article deleted');
                loadPage('home', null);
            }
        });
        buttonContainer.appendChild(deleteButton);

        // append article info and button container to article div
        articleDiv.appendChild(articleInfo);
        articleDiv.appendChild(buttonContainer);
        
        // append article div to articles container
        articlesContainer.appendChild(articleDiv);
    });
}

// initialize app with home page
document.addEventListener('DOMContentLoaded', () => {
    loadPage('home', null);
});