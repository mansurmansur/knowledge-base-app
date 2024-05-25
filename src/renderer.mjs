
// all the elements needed
const addBtn = document.querySelector('#add-new-article');
const searchInput = document.querySelector('#search');
const mainContent = document.querySelector('.main');
const homeBtn = document.querySelector('.logo');

// Load Page
const loadPage = async (page) => {
    switch (page) {
        case 'add-article':
            await loadAddArticle();
            break;
        case 'dipaly-article':
            await loadDisplayArticle(article);
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
    await loadPage('add-article');
});


// home button
homeBtn.addEventListener('click', () => {
    loadPage('home');
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


// Load Add Article 
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

// Load Display Article
const loadDisplayArticle = (article) => {
    console.log('Display Article Page');
    // get display article page
    fetch('./displayarticle.html')
        .then(response => response.text())
        .then(data => {
            mainContent.innerHTML = data;

            // get the display-article-content
            const displayArticleContent = document.querySelector('.display-article-content');

            //display the article
            displayArticleContent.innerHTML = article;
        })
        .catch(error => console.error(error));
}


// Load Search Result
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

// Load Home Page
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
            // const articles = fetchAllArticles();
            // console.log(articles.PromiseResult);
            // displayAllArticles(articles);
        })
        .catch(error => console.error(error));
}

// function that removes breaks 
const fetchAllArticles = async () => {
    try {
        const result = await window.api.invoke('invoke-operation', { operation: 'select' });
        return result;
    } catch (error) {
        console.error(error);
        return [];
    }
}

// display all articles
const displayAllArticles = (articles) => {
    const articlesContainer = document.querySelector('.home-content');
    console.log(articles);
    articles.forEach(article => {
        const articleDiv = document.createElement('div');
        articleDiv.classList.add('article');
        articleDiv.innerHTML = `
            <div class="id">${article.id}</div>
            <div class="title">${article.title}</div>
            <div class="created-date">${article.created_at}</div>
            <div class="view-button">View</div>
        `;
        articlesContainer.appendChild(articleDiv);
    });
}

// initialize app with home page
document.addEventListener('DOMContentLoaded', () => {
    loadPage('home');
});