import ShelfCurrentLoans from "../../../models/ShelfCurrentLoans";

export const LoansModel: React.FC<{
  shelfCurrentLoan: ShelfCurrentLoans;
  mobile: boolean;
  returnBook: Function;
  renewLoan: Function;
}> = (props) => {
  return (
    <div
      className="modal fade"
      id={
        props.mobile
          ? `mobilemodal${props.shelfCurrentLoan.book.id}`
          : `modal${props.shelfCurrentLoan.book.id}`
      }
      data-bs-keyboard="false"
      data-bs-backdrop="static"
      aria-labelledby="staticBackdropLabel"
      aria-hidden="true"
      key={props.shelfCurrentLoan.book.id}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="staticBackdropLabel">
              Loan Options
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <div className="container">
              <div className="mt-3">
                <div className="row">
                  <div className="col-2">
                    <img
                      src={
                        props.shelfCurrentLoan.book.img
                          ? props.shelfCurrentLoan.book.img
                          : require("./../../../Images/BooksImages/book-luv2code-1000.png")
                      }
                      width="56"
                      height="87"
                      alt={props.shelfCurrentLoan.book.title || "Book image"}
                    />
                  </div>
                  <div className="col-10">
                    <h6>{props.shelfCurrentLoan.book.author}</h6>
                    <h4>{props.shelfCurrentLoan.book.title}</h4>
                  </div>
                </div>
                <hr />
                {props.shelfCurrentLoan.dayLeft > 0 && (
                  <p className="text-secondary">
                    Due in {props.shelfCurrentLoan.dayLeft} days
                  </p>
                )}
                {props.shelfCurrentLoan.dayLeft === 0 && (
                  <p className="text-success">Due Today.</p>
                )}
                {props.shelfCurrentLoan.dayLeft < 0 && (
                  <p className="text-danger">
                    Past Due By {Math.abs(props.shelfCurrentLoan.dayLeft)} days.
                  </p>
                )}
                <div className="list-group mt-3">
                  <button
                    data-bs-dismiss="modal"
                    className="list-group-item list-group-item-action"
                    aria-current="true"
                    onClick={() =>
                      props.returnBook(props.shelfCurrentLoan.book.id)
                    }
                  >
                    Return Book
                  </button>

                  <button
                    data-bs-dismiss="modal"
                    className={
                      props.shelfCurrentLoan.dayLeft < 0
                        ? "list-group-item list-group-item-action inactiveLink"
                        : "list-group-item list-group-item-action"
                    }
                    onClick={
                      props.shelfCurrentLoan.dayLeft < 0
                        ? (event) => event.preventDefault()
                        : () => props.renewLoan(props.shelfCurrentLoan.book.id)
                    }
                  >
                    {props.shelfCurrentLoan.dayLeft < 0
                      ? "Late dues cannot be renewed"
                      : "Renew loan for 7 days"}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
