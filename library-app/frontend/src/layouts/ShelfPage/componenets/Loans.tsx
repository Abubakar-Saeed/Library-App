import { useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import ShelfCurrentLoans from "../../../models/ShelfCurrentLoans";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { Link } from "react-router-dom";
import { LoansModel } from "./LoansModel";
import Modal from "bootstrap/js/dist/modal";

export const Loans = () => {
  const { getToken, isSignedIn } = useAuth();
  const [httpError, setHttpError] = useState(null);

  const [checkout, setCheckout] = useState(false);

  // current loans

  const [shelfCurrentLoans, setShelfCurrentLoans] = useState<
    ShelfCurrentLoans[]
  >([]);
  const [isLoadingUserLoan, setIsUserLoadingLoan] = useState(true);

  useEffect(() => {
    const fetchUserCurrentLoan = async () => {
      const token = await getToken({ template: "default" });

      if (isSignedIn) {
        try {
          const url = `${process.env.REACT_APP_API}/books/secure/currentloans`;

          const requestParameter = {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-type": "application/json",
            },
          };

          const response = await fetch(url, requestParameter);

          if (!response.ok) {
            throw new Error("Somethin wrong in shelf user count");
          }

          const responseData = await response.json();

          const shelfCurrentLoans: ShelfCurrentLoans[] = responseData.map(
            (item: ShelfCurrentLoans) =>
              new ShelfCurrentLoans(item.book, item.dayLeft)
          );

          setShelfCurrentLoans(shelfCurrentLoans);
        } catch (Error: any) {
          console.error(Error);
          setHttpError(Error);
        } finally {
          setIsUserLoadingLoan(false);
        }
      }
    };
    fetchUserCurrentLoan();
  }, [getToken, isSignedIn, checkout]);

  function onModalClick(bookId: number) {
    const isMobile = window.innerWidth < 992;
    const modalId = isMobile ? `mobilemodal${bookId}` : `modal${bookId}`;
    const modalEl = document.getElementById(modalId);

    if (modalEl) {
      const modal = Modal.getInstance(modalEl) || new Modal(modalEl);
      modal.hide();
    }
  }

  async function returnBook(bookId: number) {
    if (isSignedIn) {
      const token = await getToken({ template: "default" });

      const url = `${process.env.REACT_APP_API}/books/secure/return?bookId=${bookId}`;

      try {
        const requestParameter = {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-type": "application/json",
          },
        };

        const response = await fetch(url, requestParameter);

        if (!response.ok) {
          throw new Error("Something wrong in returning book");
        }
        setCheckout(!checkout);
      } catch (error: any) {
        console.error("From  here: ", error.message);
        setHttpError(error.message);
      }
    }
  }

  async function renewLoan(bookId: number) {
    if (isSignedIn) {
      const token = await getToken({ template: "default" });

      const url = `${process.env.REACT_APP_API}/books/secure/renew/loan?bookId=${bookId}`;

      try {
        const requestParameter = {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-type": "application/json",
          },
        };

        const response = await fetch(url, requestParameter);

        if (!response.ok) {
          throw new Error("Something wrong in returning book");
        }
        setCheckout(!checkout);
      } catch (error: any) {
        console.error("From  here: ", error.message);
        setHttpError(error.message);
      }
    }
  }

  if (isLoadingUserLoan) {
    return <SpinnerLoading />;
  }
  if (httpError) {
    return (
      <div>
        <p>{httpError}</p>
      </div>
    );
  }
  return (
    <div>
      {/* Desktop */}

      <div className="d-none d-lg-block mt-2">
        {shelfCurrentLoans.length > 0 ? (
          <>
            <h5>Current Loans: </h5>

            {shelfCurrentLoans.map((item) => {
              return (
                <div key={item.book.id}>
                  <div className="row mt-3 mb-3">
                    <div className="container-fluid w-100 mt-3 mb-3">
                      <div className="row">
                        {/* Book Image */}
                        <div className="col-md-4 d-flex justify-content-center align-items-center">
                          <img
                            src={
                              item.book.img
                                ? item.book.img
                                : require("./../../../Images/BooksImages/book-luv2code-1000.png")
                            }
                            width="226"
                            height="349"
                            alt={item.book.title || "Book image"}
                          />
                        </div>

                        {/* Loan Options */}
                        <div className="col-md-8">
                          <div className="card h-100">
                            <div className="card-body">
                              <h4>Loan Options</h4>
                              {item.dayLeft > 0 && (
                                <p className="text-secondary">
                                  Due in {item.dayLeft} days
                                </p>
                              )}
                              {item.dayLeft === 0 && (
                                <p className="text-success">Due Today.</p>
                              )}
                              {item.dayLeft < 0 && (
                                <p className="text-danger">
                                  Past Due By {Math.abs(item.dayLeft)} days.
                                </p>
                              )}

                              <div className="list-group mt-3">
                                <button
                                  className="list-group-item list-group-item-action"
                                  data-bs-toggle="modal"
                                  data-bs-target={`#modal${item.book.id}`}
                                >
                                  Manage Loan
                                </button>
                                <Link
                                  to="/search"
                                  className="list-group-item list-group-item-action"
                                >
                                  Search More Books
                                </Link>
                              </div>

                              <hr />

                              <p className="mt-3">
                                Help others find adventure by reviewing your
                                loan.
                              </p>
                              <Link
                                to={`/checkout/${item.book.id}`}
                                className="btn btn-primary"
                              >
                                Leave a Review
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <hr />
                    <LoansModel
                      shelfCurrentLoan={item}
                      mobile={false}
                      returnBook={returnBook}
                      renewLoan={renewLoan}
                    />
                  </div>
                </div>
              );
            })}
          </>
        ) : (
          <>
            <h3 className="mt-3">Currently no loans.</h3>
            <Link className="btn btn-primary" to={`/search`}>
              Search for a new Book
            </Link>
          </>
        )}
      </div>
      {/* Mobile */}

      <div className="container d-lg-none mt-2">
        {shelfCurrentLoans.length > 0 ? (
          <>
            <h5 className="mb-3">Current Loans: </h5>

            {shelfCurrentLoans.map((item) => {
              return (
                <div key={item.book.id}>
                  <div className="d-flex justify-content-center align-items-center">
                    <div className="row">
                      {/* Book Image */}
                      <div className="col-md-4 d-flex justify-content-center align-items-center">
                        <img
                          src={
                            item.book.img
                              ? item.book.img
                              : require("./../../../Images/BooksImages/book-luv2code-1000.png")
                          }
                          width="226"
                          height="349"
                          alt={item.book.title || "Book image"}
                        />
                      </div>

                      {/* Loan Options */}
                      <div className="card d-flex mt-5 mb-3">
                        <div className="card-body">
                          <h4>Loan Options</h4>
                          {item.dayLeft > 0 && (
                            <p className="text-secondary">
                              Due in {item.dayLeft} days
                            </p>
                          )}
                          {item.dayLeft === 0 && (
                            <p className="text-success">Due Today.</p>
                          )}
                          {item.dayLeft < 0 && (
                            <p className="text-danger">
                              Past Due By {Math.abs(item.dayLeft)} days.
                            </p>
                          )}

                          <div className="list-group mt-3">
                            <button
                              className="list-group-item list-group-item-action"
                              data-bs-toggle="modal"
                              //data-bs-target={`#mobilemodal${item.book.id}`}
                              onClick={() => onModalClick(item.book.id)}
                            >
                              Manage Loan
                            </button>
                            <Link
                              to="/search"
                              className="list-group-item list-group-item-action"
                            >
                              Search More Books
                            </Link>
                          </div>

                          <p className="mt-3">
                            Help others find adventure by reviewing your loan.
                          </p>
                          <Link
                            to={`/checkout/${item.book.id}`}
                            className="btn btn-primary"
                          >
                            Leave a Review
                          </Link>
                        </div>
                      </div>
                    </div>
                    <hr />
                    <LoansModel
                      shelfCurrentLoan={item}
                      mobile={true}
                      returnBook={returnBook}
                      renewLoan={renewLoan}
                    />
                  </div>
                </div>
              );
            })}
          </>
        ) : (
          <>
            <h3 className="mt-3">Currently no loans.</h3>
            <Link className="btn btn-primary" to={`/search`}>
              Search for a new Book
            </Link>
          </>
        )}
      </div>
    </div>
  );
};
