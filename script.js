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
        console.log(searchResultsData);
        return searchResultsData;
    },
    createBookCard: function(searchQueryData) {
        // console.log(searchQueryData);
        const bookCard = library.createElement('div', "");
        bookCard.setAttribute('class', "card");
        const id = searchQueryData.id;
        bookCard.setAttribute('id', `${id}`);

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

        const bookAuthors = library.createElement('p', `Written by ${searchQueryData.volumeInfo.authors[0]}`);
        bookInfo.appendChild(bookAuthors);

        const numberOfPages = library.createElement('p', `${searchQueryData.volumeInfo.pageCount} Pages`);
        bookInfo.appendChild(numberOfPages);

        let form = this.createElement('form', "");
        let label = this.createElement('label', '');
        label.setAttribute('for', 'haveRead');
        label.innerText='Have Read:';
        form.appendChild(label);
        let input = this.createElement('input', "");
        input.setAttribute('type', 'checkbox');
        input.setAttribute('id', 'haveRead');
        form.appendChild(input);
        bookInfo.appendChild(form);
        bookCard.appendChild(bookInfo);

        const deleteButton = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        deleteButton.style.display="none";
        deleteButton.setAttribute('class', 'delete-card-button');
        deleteButton.setAttribute('viewBox', '0 0 24 24');
        deleteButton.setAttribute('xmlns', "http://www.w3.org/2000/svg");
        var path1 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
        path1.setAttribute('d', 'M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M7,6H17V19H7V6M9,8V17H11V8H9M13,8V17H15V8H13Z');
        


        deleteButton.appendChild(path1);
        bookCard.appendChild(deleteButton);
        deleteButton.addEventListener('click', () => {
            document.getElementById(`${id}`).remove();
        })

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
    const id = library.allSearchResults[`${library.currentBookToAddCandidate}`].id;
    document.querySelector(`#${id} > svg:first-of-type`).style.display="block";
    library.closeModal();
    library.allSearchResults = [];
})

closeModal.addEventListener('click', library.closeModal);


