import { useEffect, useState } from "react";
import BookModel from "../../../models/bookModel";
import { useAuth } from "@clerk/clerk-react";

export const ChangeQuantityOfBook: React.FC<{
  book: BookModel;
  deleteBook: any;
}> = (props) => {
  const { getToken } = useAuth();
  const [quantity, setQuantity] = useState<number>(0);
  const [remaining, setRemaining] = useState<number>(0);

  useEffect(() => {
    const fetchBookInState = () => {
      props.book.copies ? setQuantity(props.book.copies) : setQuantity(0);
      props.book.copiesAvailable
        ? setRemaining(props.book.copiesAvailable)
        : setRemaining(0);
    };
    fetchBookInState();
  }, []);

  async function increaseQuantity() {
    try {
      const token = await getToken({ template: "default" });

      const url = `${process.env.REACT_APP_API}/admin/secure/increase/book/quantity?bookId=${props.book?.id}`;
      const requestOptions = {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      const quantityUpdateResponse = await fetch(url, requestOptions);
      if (!quantityUpdateResponse.ok) {
        throw new Error("Something went wrong while increasing quantity!");
      }

      setQuantity(quantity + 1);
      setRemaining(remaining + 1);
    } catch (error: any) {
      console.error(error.message);
    }
  }

  async function decreaseQuantity() {
    try {
      const token = await getToken({ template: "default" });

      const url = `${process.env.REACT_APP_API}/admin/secure/decrease/book/quantity?bookId=${props.book?.id}`;
      const requestOptions = {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      const quantityUpdateResponse = await fetch(url, requestOptions);
      if (!quantityUpdateResponse.ok) {
        throw new Error("Something went wrong while decreasing quantity!");
      }

      setQuantity(quantity - 1);
      setRemaining(remaining - 1);
    } catch (error: any) {
      console.error(error.message);
    }
  }

  async function deleteBook() {
    try {
      const token = await getToken({ template: "default" });

      const url = `${process.env.REACT_APP_API}/admin/secure/delete/book?bookId=${props.book?.id}`;
      const requestOptions = {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      const deleteResponse = await fetch(url, requestOptions);
      if (!deleteResponse.ok) {
        throw new Error("Something went wrong while deleting the book!");
      }

      props.deleteBook();

      alert("Book deleted successfully.");
      // Optionally refresh the list or remove from UI here
    } catch (error: any) {
      console.error(error.message);
      alert(error.message);
    }
  }

  return (
    <div className="card mt-3 shadow p-3 mb-3 bg-body rounded">
      <div className="row g-0">
        <div className="col-md-2">
          <div className="d-none d-lg-block">
            {props.book.img ? (
              <img src={props.book.img} width="123" height="196" alt="Book" />
            ) : (
              <img
                src={require("./../../../Images/BooksImages/book-luv2code-1000.png")}
                width="123"
                height="196"
                alt="Book"
              />
            )}
          </div>
          <div className="d-lg-none d-flex justify-content-center align-items-center">
            {props.book.img ? (
              <img src={props.book.img} width="123" height="196" alt="Book" />
            ) : (
              <img
                src={require("./../../../Images/BooksImages/book-luv2code-1000.png")}
                width="123"
                height="196"
                alt="Book"
              />
            )}
          </div>
        </div>
        <div className="col-md-6">
          <div className="card-body">
            <h5 className="card-title">{props.book.author}</h5>
            <h4>{props.book.title}</h4>
            <p className="card-text"> {props.book.description} </p>
          </div>
        </div>
        <div className="mt-3 col-md-4">
          <div className="d-flex justify-content-center algin-items-center">
            <p>
              Total Quantity: <b>{quantity}</b>
            </p>
          </div>
          <div className="d-flex justify-content-center align-items-center">
            <p>
              Books Remaining: <b>{remaining}</b>
            </p>
          </div>
        </div>
        <div className="mt-3 col-md-1">
          <div className="d-flex justify-content-start">
            <button className="m-1 btn btn-md btn-danger" onClick={deleteBook}>
              Delete
            </button>
          </div>
        </div>
        <button
          className="m1 btn btn-md main-color text-white"
          onClick={increaseQuantity}
        >
          Add Quantity
        </button>
        <button
          className="m1 btn btn-md btn-warning"
          onClick={decreaseQuantity}
        >
          Decrease Quantity
        </button>
      </div>
    </div>
  );
};
