import { Link } from "react-router-dom";
import BookModel from "../../models/bookModel";
import { useUser } from "@clerk/clerk-react";
import { LeaveAReview } from "../Utils/LeaveAReview";

export const CheckoutAndReviewBox: React.FC<{
  book: BookModel | undefined;
  mobile: boolean;
  currentLoan: number;
  isCheckedout: boolean;
  checkout: Function;
  isReviewGiven: boolean;
  leaveReview: Function;
}> = (props) => {
  const { isSignedIn } = useUser();

  function buttonRender() {
    if (isSignedIn) {
      if (!props.isCheckedout && props.currentLoan < 5) {
        return (
          <button
            className="btn btn-success btn-lg"
            onClick={() => props.checkout()}
          >
            Checkout
          </button>
        );
      } else if (props.isCheckedout) {
        return (
          <p>
            <b>You already checkout this book enjoy...</b>
          </p>
        );
      } else if (!props.isCheckedout) {
        return (
          <p className="text-danger">
            <b>Too many books checked out</b>
          </p>
        );
      }
    } else {
      return (
        <Link to="/login" className="btn btn-success btn-lg">
          Sign in
        </Link>
      );
    }
  }
  return (
    <div
      className={
        props.mobile ? "card d-flex mt-5" : "card col-3 container d-flex mb-5"
      }
    >
      <div className="card-body container">
        <div className="mt-3">
          <p>
            <b>{props.currentLoan}/5 </b>
            books checked out
          </p>
          <hr />
          {props.book &&
          props.book.copiesAvailable &&
          props.book.copiesAvailable > 0 ? (
            <h4 className="text-success">Available</h4>
          ) : (
            <h4 className="text-danger">Wait List</h4>
          )}

          <div className="row">
            <p className="col-6 lead">
              <b>{props.book?.copies} </b>
              copies
            </p>
            <p className="col-6 lead">
              <b>{props.book?.copiesAvailable} </b>
              available
            </p>
          </div>
        </div>
        {buttonRender()}
        <hr />
        <p className="mt-3">This number can change until placing order</p>
        {isSignedIn ? (
          props.isReviewGiven ? (
            <p>Thank you for your review</p>
          ) : (
            <LeaveAReview onSubmit={props.leaveReview} />
          )
        ) : (
          <p>Sign in to give a review</p>
        )}
      </div>
    </div>
  );
};
