const searchForm = document.getElementById('searchForm');
const searchButton = document.getElementById('searchButton');
const book = document.getElementById('book');

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    addBookToLibrary(book.value);
    book.value="";
})

function Book(title, author, numPages, haveRead) {
    this.title = title
    this.author= author
    this.numPages = numPages
    this.haveRead = haveRead
}

Book.prototype.info = function() {
    return `${this.title} by ${this.author}, ${this.numPages} pages, ${this.haveRead}`;
}

const booksInLibrary = [];
const apiKey = "AIzaSyDigPDuzzDm-W4SQl-9xv5i2IBEBmVeOLs";

async function addBookToLibrary(book) {
    const requestedData = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${book}&key=${apiKey}`)
    const jsonData = await requestedData.json();
    console.log(jsonData);
    console.log(jsonData.items[0].volumeInfo.imageLinks.thumbnail);
    console.log(jsonData.items[0].volumeInfo.imageLinks.smallThumbnail);
    const author = jsonData.items[0].volumeInfo.authors[0];
    const title = jsonData.items[0].volumeInfo.title;
    const numberOfPages = jsonData.items[0].volumeInfo.pageCount;
    const haveRead = true;

    const bookToAdd = new Book(title, author, numberOfPages, haveRead);
    booksInLibrary.push(bookToAdd);
}

addBookToLibrary('Chaos');

