import { Book } from "./Book";

export function BookShelf({ name, books, onShelfChanged, isLoading }) {
  return (
    <div className="bookshelf">
      <h2 className="bookshelf-title">{name}</h2>
      <div className="bookshelf-books">
        <ol className="books-grid">
          {isLoading ? (
            <div>Loading shelf...</div>
          ) : (
            books.map((book) => (
              <Book
                key={book.id}
                book={book}
                onShelfChanged={(book, shelf) => onShelfChanged(book, shelf)}
              />
            ))
          )}
        </ol>
      </div>
    </div>
  );
}
