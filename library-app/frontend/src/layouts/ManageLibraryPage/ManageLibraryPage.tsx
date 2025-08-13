import { useAuth } from "@clerk/clerk-react";
import { useState } from "react";
import { AdminMessages } from "./components/AdminMessages";
import { AddNewBook } from "./components/AddNewBook";
import { ChangeQuantityOfBooks } from "./components/ChangeQuantityOfBooks";

export const ManageLibraryPage = () => {
  const { getToken, isSignedIn } = useAuth();
  const [changeQuantityOfBooks, setChangeQuantityOfBooksClick] =
    useState(false);
  const [messageClick, setMessageClick] = useState(false);

  function addBookClick() {
    setChangeQuantityOfBooksClick(false);
    setMessageClick(false);
  }

  function changeQuantityBookClick() {
    setChangeQuantityOfBooksClick(true);
    setMessageClick(false);
  }

  function messageClickFunc() {
    setChangeQuantityOfBooksClick(false);
    setMessageClick(true);
  }
  return (
    <div className="container">
      <div className="mt-5">
        <h3>Manage Library</h3>
      </div>
      <nav>
        <div className="nav nav-tabs" id="nav-tab" role="tab-list">
          <button
            className="nav-link active"
            id="nav-add-book-tab"
            data-bs-toggle="tab"
            data-bs-target="#nav-add-book"
            type="button"
            role="tab"
            aria-controls="nav-add-book"
            aria-selected="false"
            onClick={() => addBookClick()}
          >
            Add New Book
          </button>
          <button
            className="nav-link"
            id="nav-quantity-tab"
            data-bs-toggle="tab"
            data-bs-target="#nav-quantity"
            type="button"
            role="tab"
            aria-controls="nav-quantity"
            aria-selected="false"
            onClick={() => changeQuantityBookClick()}
          >
            Change Quantity
          </button>
          <button
            className="nav-link"
            id="nav-message-tab"
            data-bs-toggle="tab"
            data-bs-target="#nav-message"
            type="button"
            role="tab"
            aria-controls="nav-message"
            aria-selected="false"
            onClick={() => messageClickFunc()}
          >
            Messages
          </button>
        </div>
      </nav>

      <div className="tab-content" id="nav-tabContent">
        <div
          className="tab-pane fade show active"
          id="nav-add-book"
          role="tabpanel"
          aria-labelledby="nav-add-book-tab"
        >
          <AddNewBook />
        </div>
      </div>
      <div
        className="tab-pane fade"
        id="nav-quantity"
        role="tabpanel"
        aria-labelledby="nav-quantity-tab"
      >
        {changeQuantityOfBooks ? (
          <>
            <ChangeQuantityOfBooks />
          </>
        ) : (
          <></>
        )}
      </div>
      <div
        className="tab pane fade "
        id="nav-message"
        role="tabpanel"
        aria-labelledby="nav-messages-tab"
      >
        {messageClick ? (
          <>
            <AdminMessages />
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};
