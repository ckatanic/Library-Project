const searchForm = document.getElementById('searchForm');
const searchButton = document.getElementById('searchButton');
const searchInput = document.getElementById('searchInput');
const addBookButton = document.getElementById("addBookButton");
const addBookModal = document.getElementById("addBookModal");
const closeModal = document.getElementById("closeModal");

searchForm.addEventListener("submit", async function(e) {
    e.preventDefault();
    bookData = await getBookData(searchInput.value);
    searchInput.value="";
    console.log(bookData);
    // addBookCard(bookData);
})

addBookButton.addEventListener("click", () => {
    addBookModal.style.display="grid";
})

closeModal.addEventListener("click", () => {
    addBookModal.style.display="none";
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

async function getBookData(book) {
    const requestedData = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${book}&key=${apiKey}`)
    const bookData = await requestedData.json();
    // console.log(bookData);
    console.log(bookData.items[0].volumeInfo.imageLinks.thumbnail);
    console.log(bookData.items[0].volumeInfo.imageLinks.smallThumbnail);
    // const author = jsonData.items[0].volumeInfo.authors[0];
    // const title = jsonData.items[0].volumeInfo.title;
    // const numberOfPages = jsonData.items[0].volumeInfo.pageCount;
    // const haveRead = true;

    // const bookToAdd = new Book(title, author, numberOfPages, haveRead);
    // booksInLibrary.push(bookToAdd);
    return bookData;
}

function createBookCard() {
    const bookCard = createElement('div', "");
    const imageDiv = createElement('div', "");
    const image = createElement('img', "");
    image.src="https://books.google.com/books/content?id=zG92DwAAQBAJ&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api";
    imageDiv.append(image);
    bookCard.append(imageDiv);
    return bookCard;
}

function createElement(type, content) {
    const el = document.createElement(type);
    el.innerText = content;
    return el;
}


