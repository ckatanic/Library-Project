const searchForm = document.getElementById('searchForm');
const searchButton = document.getElementById('searchButton');
const searchInput = document.getElementById('searchInput');
const addBookButton = document.getElementById("addBookButton");
const addBookModal = document.getElementById("addBookModal");
const closeModal = document.getElementById("closeModal");
const modalContent = document.getElementById('modal-content');

searchForm.addEventListener("submit", async function(e) {
    e.preventDefault();
    bookData = await getBookData(searchInput.value);
    searchInput.value="";
    console.log(bookData);
    const bookCard = createBookCard(bookData);
    modalContent.appendChild(bookCard);
})

addBookButton.addEventListener("click", () => {
    addBookModal.style.display="grid";
})

closeModal.addEventListener("click", () => {
    addBookModal.style.display="none";
})

function Book(title, author, numPages, haveRead) {
    this.title = title;
    this.author= author;
    this.numPages = numPages;
    this.haveRead = haveRead;
}

Book.prototype.info = function() {
    return `${this.title} by ${this.author}, ${this.numPages} pages, ${this.haveRead}`;
}

const booksInLibrary = [];
const apiKey = "AIzaSyDigPDuzzDm-W4SQl-9xv5i2IBEBmVeOLs";

async function getBookData(book) {
    const requestedData = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${book}&key=${apiKey}`)
    const bookData = await requestedData.json();
    return bookData;
}

function createBookCard(bookData) {
    const bookCard = createElement('div', "");
    bookCard.setAttribute('class', "card");
    const imageDiv = createElement('div', "");
    imageDiv.setAttribute('class', 'image');
    const image = createElement('img', "");
    // console.log(bookData);
    image.src=`${bookData.items[0].volumeInfo.imageLinks.thumbnail}`
    imageDiv.append(image);
    bookCard.append(imageDiv);
    const bookInfo = createElement('div', "");
    bookInfo.setAttribute('class', 'book-info');
    const bookTitle = createElement('h2',`${bookData.items[0].volumeInfo.title}`);
    bookInfo.appendChild(bookTitle);
    const bookAuthors = createElement('p', `${bookData.items[0].volumeInfo.authors[0]}`);
    bookInfo.appendChild(bookAuthors);
    const numberOfPages = createElement('p', `${bookData.items[0].volumeInfo.pageCount}`);
    bookInfo.appendChild(numberOfPages);
    bookCard.appendChild(bookInfo);
    return bookCard;
}

function createElement(type, content) {
    const el = document.createElement(type);
    el.innerText = content;
    return el;
}


