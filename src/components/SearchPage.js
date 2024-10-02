import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as booksService from "../BooksAPI";
import { Book } from "./Book";
import { getPersister, persistBook } from "../helpers/persister";

export function SearchPage() {
  const [searchText, setSearchText] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const searchDebounce = useDebounce(searchText, 500);
  const [errorMessage, setErrorMessage] = useState("No search result");
  const [isLoading, setIsLoading] = useState(false);
  const [updateResult, setUpdateResult] = useState(0);

  const onSearch = (searchText) => {
    setSearchText(searchText);
    if (searchResult.length) {
      // prevent re-drawing a lot of elements
      setSearchResult([]);
    }
  };

  useEffect(() => {
    if (searchDebounce) {
      setIsLoading(true);
      booksService
        .search(searchDebounce)
        .then((searchResult) => {
          if (Array.isArray(searchResult)) {
            // apply statuses from persister
            const persister = getPersister();
            const statusesAppliedSearchResult = searchResult.map((book) => ({
              ...book,
              shelf: persister[book.id] ? persister[book.id] : "none",
            }));
            // render searchResult
            setSearchResult(statusesAppliedSearchResult);
            setErrorMessage("");
          } else {
            setErrorMessage("No search result");
          }
        })
        .catch(() => setErrorMessage("Failed to call POST search"))
        .finally(() => setIsLoading(false));
    } else {
      setSearchResult([]);
      setErrorMessage("No search result");
    }
  }, [searchDebounce, updateResult]);

  const onShelfChanged = (book, shelf) => {
    // persist new shelf value
    persistBook(book, shelf);
    // update book
    booksService
      .update(book, shelf)
      .then(() => setUpdateResult(updateResult + 1))
      .catch(() => {
        setErrorMessage("Failed to call PUT update");
      });
  };

  const ApiResponse = () => {
    return errorMessage ? (
      <div>{errorMessage}</div>
    ) : (
      searchResult.map((book) => (
        <Book key={book.id} book={book} onShelfChanged={onShelfChanged} />
      ))
    );
  };

  return (
    <div className="search-books">
      <div className="search-books-bar">
        <Link to={"/"}>
          <div className="close-search">Close</div>
        </Link>
        <div className="search-books-input-wrapper">
          <input
            type="text"
            placeholder="Search by title, author, or ISBN"
            onChange={(event) => onSearch(event.target.value)}
          />
        </div>
      </div>
      <div className="search-books-results">
        <ol className="books-grid">
          {isLoading ? <div>Searching...</div> : <ApiResponse />}
        </ol>
      </div>
    </div>
  );
}

// code from chatGPT
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
