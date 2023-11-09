const searchForm = document.getElementById('searchForm');
const searchButton = document.getElementById('searchButton');
const searchInput = document.getElementById('searchInput');
const addBookButton = document.getElementById("addBookButton");
const addBookModal = document.getElementById("addBookModal");
const closeModal = document.getElementById("closeModal");
const searchResults = document.getElementById('search-results');
const addToLibraryButton = document.getElementById('addToLibraryButton');
const booksDisplay = document.getElementById('books-display');
const controls = document.getElementsByClassName('controls')[0];

const apiKey = "AIzaSyDigPDuzzDm-W4SQl-9xv5i2IBEBmVeOLs";

function Book(title, author, numPages, haveRead) {
    this.title = title;
    this.author= author;
    this.numPages = numPages;
    this.haveRead = haveRead;
}

Book.prototype.info = function() {
    return `${this.title} by ${this.author}, ${this.numPages} pages, ${this.haveRead}`;
}

const library = {
    booksInLibrary: [],
    allSearchResults: {},
    currentBookToAddCandidate: {},

    getBookData: async function(book) {
        const requestedData = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${book}&key=${apiKey}`)
        const bookData = await requestedData.json();
        library.allSearchResults = bookData;
        return bookData;
    },
    createBookCard: function(bookData) {
        const bookCard = library.createElement('div', "");
        bookCard.setAttribute('class', "card");

        const imageDiv = library.createElement('div', "");
        imageDiv.setAttribute('class', 'image');

        const image = library.createElement('img', "");
        image.src=`${bookData.items[0].volumeInfo.imageLinks.thumbnail}`
        imageDiv.append(image);
        bookCard.append(imageDiv);

        const bookInfo = library.createElement('div', "");
        bookInfo.setAttribute('class', 'book-info');

        const bookTitle = library.createElement('h2',`${bookData.items[0].volumeInfo.title}`);
        bookInfo.appendChild(bookTitle);

        const bookAuthors = library.createElement('p', `${bookData.items[0].volumeInfo.authors[0]}`);
        bookInfo.appendChild(bookAuthors);

        const numberOfPages = library.createElement('p', `${bookData.items[0].volumeInfo.pageCount}`);
        bookInfo.appendChild(numberOfPages);
        bookCard.appendChild(bookInfo);
        library.currentBookToAddCandidate = bookCard;

        return bookCard;
    },
    createElement: function(type, content) {
        const el = document.createElement(type);
        el.innerText = content;
        return el;
    },
    removeSearchCandidate: function() {
        cardToRemove = searchResults.children[0];
        if (cardToRemove) {
            cardToRemove.remove();
        }
    },
    closeModal: function() {
        addBookModal.style.display="none";
        library.removeSearchCandidate();
        document.getElementById('addToLibraryButton').style.display="none";
        controls.style.display="none";
    }
}

searchForm.addEventListener("submit", async function(e) {
    e.preventDefault();
    if (searchResults.children.length > 0) {
        library.removeSearchCandidate();
    }
    bookData = await library.getBookData(searchInput.value);
    searchInput.value="";
    console.log(bookData);
    const bookCard = library.createBookCard(bookData);
    searchResults.appendChild(bookCard);
    addToLibraryButton.style.display="block";
    controls.style.display="flex";
})

addBookButton.addEventListener("click", () => {
    addBookModal.style.display="grid";
})

addToLibraryButton.addEventListener('click', () => {
    library.booksInLibrary.push(library.allSearchResults.items[0]);
    booksDisplay.appendChild(library.currentBookToAddCandidate);
    library.closeModal();
})

closeModal.addEventListener("click", library.closeModal);


