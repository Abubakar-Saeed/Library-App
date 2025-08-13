import { useEffect, useState } from "react";
import BookModel from "../../models/bookModel";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { SearchBook } from "./components/SearchBook";
import { Pagination } from "../Utils/Pagination";

export const SearchBookPage = () => {
  const [books, setBooks] = useState<BookModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(5); // Assuming you want to show 5 books per page
  const [totalAmountOfBooks, setTotalAmountOfBooks] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [findByTitle, setFindByTitle] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Book Category");

  function handleSearchFieldChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFindByTitle(e.target.value);
    if (e.target.value === "") {
      setSearch(`?page=0&size=${booksPerPage}`);
    }
  }
  function handleSearchChange() {
    setCurrentPage(1);
    if (findByTitle === "") {
      setSearch(`?page=0&size="${booksPerPage}`);
    } else {
      setSearch(
        `/search/findByTitleContaining?title=${findByTitle}&page=<pageNumber>&size=${booksPerPage}`
      );
    }
    setCategory("Book Category");
  }

  function handleCategoryChange(value: string) {
    setCurrentPage(1);
    setFindByTitle("");
    if (
      value.toLowerCase() === "fe" ||
      value.toLowerCase() === "be" ||
      value.toLowerCase() === "data" ||
      value.toLowerCase() === "devops"
    ) {
      setCategory(value);
      setSearch(
        `/search/findByCategory?category=${value}&page=<pageNumber>&size=${booksPerPage}`
      );
    } else {
      setCategory("All");
      setSearch(`?page=<pageNumber>&size=${booksPerPage}`);
    }
  }

  useEffect(() => {
    const fetchBooks = async () => {
      const baseUrl: string = `${process.env.REACT_APP_API}/books`;
      let url: string;
      if (search === "") {
        url = `${baseUrl}?&page=${currentPage - 1}&size=${booksPerPage}`;
      } else {
        url = `${baseUrl}${search.replace(
          "<pageNumber>",
          (currentPage - 1).toString()
        )}`;
      }

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch books");
        }

        const responseJson = await response.json();
        const responseData = responseJson._embedded?.books;

        if (!responseData) {
          throw new Error("No books found in response");
        }

        setTotalAmountOfBooks(responseJson.page.totalElements);
        setTotalPages(responseJson.page.totalPages);

        const loadedBooks: BookModel[] = responseData.map(
          (book: BookModel) => ({
            id: book.id,
            title: book.title,
            author: book.author,
            description: book.description,
            copies: book.copies,
            copiesAvailable: book.copiesAvailable,
            category: book.category,
            img: book.img,
          })
        );

        setBooks(loadedBooks);
      } catch (error: any) {
        console.error("Error fetching books:", error);
        setHttpError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, [currentPage, booksPerPage, search]);

  if (isLoading) {
    return <SpinnerLoading />;
  }

  if (httpError) {
    return (
      <div className="container m-5">
        <p>Error: {httpError}</p>
      </div>
    );
  }

  const indexOfLastBook: number = currentPage * booksPerPage;
  const indexOfFirstBook: number = indexOfLastBook - booksPerPage;
  let lastItem: number =
    booksPerPage * currentPage <= totalAmountOfBooks
      ? booksPerPage * currentPage
      : totalAmountOfBooks;

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <div className="container">
        {/* Search and Filter UI */}
        <div className="row mt-5">
          <div className="col-6">
            <div className="d-flex">
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search"
                aria-labelledby="Search"
                value={findByTitle}
                onChange={(e) => handleSearchFieldChange(e)}
              />
              <button
                className="btn btn-outline-success"
                onClick={() => handleSearchChange()}
              >
                Search
              </button>
            </div>
          </div>

          <div className="col-4">
            <div className="dropdown">
              <button
                className="btn btn-secondary dropdown-toggle"
                type="button"
                id="dropdownMenuButton1"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {category}
              </button>
              <ul
                className="dropdown-menu"
                aria-labelledby="dropdownMenuButton1"
              >
                <li>
                  <a
                    href="#"
                    className="dropdown-item"
                    onClick={() => handleCategoryChange("All")}
                  >
                    All
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="dropdown-item"
                    onClick={() => handleCategoryChange("FE")}
                  >
                    Front End
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="dropdown-item"
                    onClick={() => handleCategoryChange("BE")}
                  >
                    Back End
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="dropdown-item"
                    onClick={() => handleCategoryChange("Data")}
                  >
                    Data
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="dropdown-item"
                    onClick={() => handleCategoryChange("DevOps")}
                  >
                    DevOps
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Results Summary */}

        {totalAmountOfBooks > 0 ? (
          <>
            <div className="mt-3">
              <h5>Number of Results: {books.length}</h5>
              <p>
                {indexOfFirstBook + 1} to {lastItem} of {totalAmountOfBooks}{" "}
                items:
              </p>
            </div>

            {books.map((book) => (
              <SearchBook book={book} key={book.id} />
            ))}
          </>
        ) : (
          <div className="m-5">
            <h3>Can't find what you're looking for?</h3>
            <a
              type="button"
              className="btn main-color btn-md px-4 me-md-2 fw-bold text-white"
              href="#"
            >
              Request a Book
            </a>
          </div>
        )}

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            paginate={paginate}
          />
        )}
      </div>
    </div>
  );
};
