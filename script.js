const searchForm = document.getElementById('searchForm');
const searchButton = document.getElementById('searchButton');
const searchInput = document.getElementById('searchInput');
const addBookButton = document.getElementById("addBookButton");
const addBookModal = document.getElementById("addBookModal");
const closeModal = document.getElementById("closeModal");
const searchResultsDiv = document.getElementById('search-results');
const addToLibraryButton = document.getElementById('addToLibraryButton');
const booksDisplay = document.getElementById('books-display');
const controls = document.getElementById('controls');
const previousButton = document.getElementById('previous');
const nextButton = document.getElementById('next');
const currentResultText = document.getElementById('currentResultIndicator');

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
    allSearchResults: [],
    currentBookToAddCandidate: 0,

    getSearchResults: async function(book) {
        const requestedData = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${book}&key=${apiKey}`)
        const searchResultsData = await requestedData.json();
        library.allSearchResults = searchResultsData.items.map((item, index) => {
            return library.createBookCard(item, index);
        });
        return searchResultsData;
    },
    createBookCard: function(searchQueryData) {
        const bookCard = library.createElement('div', "");
        bookCard.setAttribute('class', "card");

        const imageDiv = library.createElement('div', "");
        imageDiv.setAttribute('class', 'image');

        if (searchQueryData.volumeInfo.imageLinks !== undefined) {
            const image = library.createElement('img', "");
            image.src = searchQueryData.volumeInfo.imageLinks.thumbnail
            imageDiv.append(image);
            bookCard.append(imageDiv);
        }


        const bookInfo = library.createElement('div', "");
        bookInfo.setAttribute('class', 'book-info');

        const bookTitle = library.createElement('h2', searchQueryData.volumeInfo.title);
        bookInfo.appendChild(bookTitle);

        const bookAuthors = library.createElement('p', searchQueryData.volumeInfo.authors[0]);
        bookInfo.appendChild(bookAuthors);

        const numberOfPages = library.createElement('p', searchQueryData.volumeInfo.pageCount);
        bookInfo.appendChild(numberOfPages);
        bookCard.appendChild(bookInfo);
        // library.currentBookToAddCandidate = bookCard;

        return bookCard;
    },
    createElement: function(type, content) {
        const el = document.createElement(type);
        el.innerText = content;
        return el;
    },
    clearCurrentBookDisplay: function() {
        cardToRemove = searchResultsDiv.children[0];
        if (cardToRemove) {
            cardToRemove.remove();
        }
    },
    nextSearchResult: function() {
        if (library.currentBookToAddCandidate != library.allSearchResults.length-1) {
            library.currentBookToAddCandidate+=1;
            library.clearCurrentBookDisplay();
            searchResultsDiv.appendChild(library.allSearchResults[`${library.currentBookToAddCandidate}`]);
            currentResultText.innerText = `${library.currentBookToAddCandidate + 1} of ${library.allSearchResults.length} Results`
        }
    },
    previousSearchResult: function() {
        if (library.currentBookToAddCandidate != 0) {
            library.currentBookToAddCandidate-=1;
            library.clearCurrentBookDisplay();
            searchResultsDiv.appendChild(library.allSearchResults[`${library.currentBookToAddCandidate}`]);
            currentResultText.innerText = `${library.currentBookToAddCandidate + 1} of ${library.allSearchResults.length} Results`
        }
    },
    closeModal: function() {
        addBookModal.style.display="none";
        library.clearCurrentBookDisplay();
        document.getElementById('addToLibraryButton').style.display="none";
        controls.style.display="none";
    }
}

searchForm.addEventListener("submit", async function(e) {
    e.preventDefault();
    if (searchResultsDiv.children.length > 0) {
        library.clearCurrentBookDisplay();
    }
    searchResultsData = await library.getSearchResults(searchInput.value);
    searchInput.value="";
    searchResultsDiv.appendChild(library.allSearchResults[0]);
    addToLibraryButton.style.display="block";
    controls.style.display="flex";
})

addBookButton.addEventListener('click', () => {
    addBookModal.style.display="grid";
})

previousButton.addEventListener('click', () => {
    library.previousSearchResult();
})

nextButton.addEventListener('click', () => {
    library.nextSearchResult();
})

addToLibraryButton.addEventListener('click', () => {
    library.booksInLibrary.push(library.allSearchResults[`${library.currentBookToAddCandidate}`]);
    booksDisplay.appendChild(library.allSearchResults[`${library.currentBookToAddCandidate}`]);
    library.closeModal();
    library.allSearchResults = [];
})

closeModal.addEventListener('click', library.closeModal);


