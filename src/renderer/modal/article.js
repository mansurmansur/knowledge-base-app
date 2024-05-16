const Article = {
    title: '',
    content: '',
    getTitle() {
        return this.title;
    },
    getContent() {
        return this.content;
    },
    setTitle(title) {
        this.title = title;
    },
    setContent(content) {
        this.content = content;
    }
};

module.exports = Article;
