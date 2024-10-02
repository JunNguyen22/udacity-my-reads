import { useState, useMemo, useEffect } from "react";
import * as booksService from "../BooksAPI";
import { Link } from "react-router-dom";
import { BookShelf } from "./BookShelf";

export function MainPage() {
  const [showSearchPage, setShowSearchpage] = useState(false);
  const [books, setBooks] = useState([]);
  const [updateBooks, setUpdateBooks] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const getBooksFromShelf = (shelf) => {
    return books.filter((book) => book.shelf === shelf);
  };
  const currentlyReadings = useMemo(
    () => getBooksFromShelf("currentlyReading"),
    [books]
  );
  const wantToReads = useMemo(() => getBooksFromShelf("wantToRead"), [books]);
  const reads = useMemo(() => getBooksFromShelf("read"), [books]);

  useEffect(() => {
    setIsLoading(true);
    booksService
      .getAll()
      .then((books) => {
        setBooks(books);
        setErrorMessage("");
        // persist values from mainpage to searchpage
        const persister = {};
        books.forEach((book) => (persister[book.id] = book.shelf));
        sessionStorage.setItem("persister", JSON.stringify(persister));
      })
      .catch(() => {
        setErrorMessage("Failed to call GET getAll");
      })
      .finally(() => setIsLoading(false));
  }, [updateBooks]);

  const onShelfChanged = (book, shelf) => {
    booksService
      .update(book, shelf)
      .then(() => {
        setUpdateBooks(updateBooks + 1);
        setErrorMessage("");
      })
      .catch(() => {
        setErrorMessage("Failed to call PUT update");
      });
  };

  return (
    <div className="app">
      {
        <div className="list-books">
          <div className="list-books-title">
            <h1>MyReads</h1>
          </div>
          <div className="list-books-content">
            <div>
              {errorMessage ? (
                <div>{errorMessage}</div>
              ) : (
                <>
                  <BookShelf
                    name={"Currently Reading"}
                    books={currentlyReadings}
                    onShelfChanged={onShelfChanged}
                    isLoading={isLoading}
                  />
                  <BookShelf
                    name={"Want to Read"}
                    books={wantToReads}
                    onShelfChanged={onShelfChanged}
                    isLoading={isLoading}
                  />
                  <BookShelf
                    name={"Read"}
                    books={reads}
                    onShelfChanged={onShelfChanged}
                    isLoading={isLoading}
                  />
                </>
              )}
            </div>
          </div>
          <Link to={"/search"}>
            <div className="open-search">
              <div onClick={() => setShowSearchpage(!showSearchPage)}>
                Add a book
              </div>
            </div>
          </Link>
        </div>
      }
    </div>
  );
}
