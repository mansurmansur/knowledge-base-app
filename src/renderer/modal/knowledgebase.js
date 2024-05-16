import Article from "./article";

// Knowledge base Class
const knowledgeBase = (() => {
    let instance;

    function createInstance() {
        const object = new Object("I am the instance");
        const articles = [];
        return object;
    }

    return {
        //returns the instance of the knowledge base
        getInstance: () => {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        },
        // adds an article to the knowledge base
        addArticle: (title, content) => {
            const article = Object.create(Article);
            article.setTitle(title);
            article.setContent(content);
            instance.articles.push(article);
        },
        // returns all the articles in the knowledge base
        getArticles: () => {
            return instance.articles;
        },
        // edits an article in the knowledge base
        editArticle: (index, title, content) => {
            const article = instance.articles[index];
            article.setTitle(title);
            article.setContent(content);
        },
        // deletes an article from the knowledge base
        deleteArticle: (index) => {
            instance.articles.splice(index, 1);
        },
        // searches for an article in the knowledge base
        searchArticle: (searchTerm) => {
            return instance.articles.filter(article => article.getTitle().includes(searchTerm));
        },
        // returns a specific article from the knowledge base
        getArticle: (index) => {
            return instance.articles[index];
        }
    }

})

export default knowledgeBase;