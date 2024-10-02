export function getPersister() {
  const persisterString = sessionStorage.getItem("persister");
  return JSON.parse(persisterString) ?? {};
}

export function updatePersister(persister = {}) {
  sessionStorage.setItem("persister", JSON.stringify(persister));
}

export function persistBook(book = {}, shelf = "") {
  const persister = getPersister();
  persister[book.id] = shelf;
  updatePersister(persister);
}

export function persistBooks(books = []) {
  const persister = {};
  books.forEach((book) => (persister[book.id] = book.shelf ?? "none"));
  updatePersister(persister);
}
