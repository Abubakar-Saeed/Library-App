import { useEffect, useState } from "react";
import BookModel from "../../models/bookModel";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { StarReview } from "../Utils/StarReview";
import { CheckoutAndReviewBox } from "./CheckoutAndReviewBox";
import ReviewModel from "../../models/ReviewModel";
import { LatestReviews } from "./LatestReviews";
import { useAuth } from "@clerk/clerk-react";
import ReviewRequestModel from "../../models/ReviewRequestModel";

export const BookCheckoutPage = () => {
  const { getToken, isSignedIn } = useAuth();

  const [book, setBook] = useState<BookModel>();
  const [isLoading, setIsLoading] = useState(false);
  const [httpError, setHttpError] = useState(null);
  const bookId = window.location.pathname.split("/")[2];

  // review states

  const [reviews, setReviews] = useState<ReviewModel[]>([]);
  const [totalStars, setTotalStars] = useState(0);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);

  const [isReviewLeft, setIsReviewLeft] = useState(false);
  const [isLoadingUserReview, setIsLoadingUserReview] = useState(false);

  // Loan Count state

  const [currentLoansCount, setCurrentLoansCount] = useState(0);
  const [isLoadingLoanCount, setIsLoadingCount] = useState(false);

  const [isbookCheckedout, setIsCheckedout] = useState(false);
  const [isLoadingCheckout, setIsLoadingCheckout] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      const url = `${process.env.REACT_APP_API}/books/${bookId}`;

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch books");
        }

        const responseJson = await response.json();
        const responseData = responseJson;

        if (!responseData) {
          throw new Error("No books found in response");
        }

        const loadedBooks: BookModel = {
          id: responseData.id,
          title: responseData.title,
          author: responseData.author,
          description: responseData.description,
          copies: responseData.copies,
          copiesAvailable: responseData.copiesAvailable,
          category: responseData.category,
          img: responseData.img,
        };

        setBook(loadedBooks);
      } catch (error: any) {
        console.error("Error fetching books:", error);
        setHttpError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBook();
    window.scrollTo(0, 0);
  }, [bookId]);

  useEffect(() => {
    const fetchReviews = async () => {
      const url = `${process.env.REACT_APP_API}/reviews/search/findByBookId?bookId=${bookId}`;

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch reviews");
        }

        const responseJson = await response.json();
        const responseData = responseJson._embedded?.reviews;
        let weightedRating = 0;

        if (!responseData) {
          throw new Error("No reviews found in response");
        }

        const loadedReviews: ReviewModel[] = responseData.map(
          (review: any) => ({
            id: review.id,
            userEmail: review.userEmail,
            date: review.date,
            rating: review.rating,
            book_id: review.bookId,
            reviewDescription: review.reviewDescription,
          })
        );

        loadedReviews.forEach((review) => {
          weightedRating += review.rating;
        });

        if (loadedReviews) {
          const round = (
            Math.round((weightedRating / loadedReviews.length) * 2) / 2
          ).toFixed(1);

          setTotalStars(Number(round));
        }

        setReviews(loadedReviews);
      } catch (error: any) {
        console.error("Error fetching reviws:", error);
        setHttpError(error.message);
      } finally {
        setIsLoadingReviews(false);
      }
    };

    fetchReviews();
  }, [bookId, isReviewLeft]);

  useEffect(() => {
    const userReview = async () => {
      if (isSignedIn) {
        try {
          const url = `${process.env.REACT_APP_API}/reviews/secure/user/book?bookId=${bookId}`;
          const token = await getToken({ template: "default" });
          const requestOptions = {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          };

          const response = await fetch(url, requestOptions);

          if (!response.ok) {
            throw new Error(
              "Something went wrong in is user given already review"
            );
          }
          const responseData = await response.json();

          console.log(responseData);
          setIsReviewLeft(responseData);
        } catch (error: any) {
          setHttpError(error.message);
          throw new Error(
            "Something went wrong in is user given already review"
          );
        } finally {
          setIsLoadingUserReview(false);
        }
      }
    };
    userReview();
  }, [isSignedIn, bookId, getToken]);
  useEffect(() => {
    const fetchCount = async () => {
      if (isSignedIn) {
        const url = `${process.env.REACT_APP_API}/books/secure/currentloans/count`;
        const token = await getToken({ template: "default" });

        const requestOptions = {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        };

        try {
          const response = await fetch(url, requestOptions);
          if (!response.ok) {
            throw new Error("Failed to fetch count");
          }

          const responseJson = await response.json();
          setCurrentLoansCount(responseJson);
        } catch (error: any) {
          console.error("Error fetching count:", error);
          setHttpError(error.message);
        } finally {
          setIsLoadingCount(false);
        }
      }
    };

    fetchCount(); // Call it once when effect runs
  }, [getToken, isSignedIn]); // Only re-run if signed-in status changes

  useEffect(() => {
    const fetchCheckout = async () => {
      if (isSignedIn) {
        const url = `${process.env.REACT_APP_API}/books/secure/ischeckedout/byuser?bookId=${bookId}`;
        const token = await getToken({ template: "default" });
        const requestOptions = {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        };

        try {
          const response = await fetch(url, requestOptions);
          if (!response.ok) {
            throw new Error("Failed to fetch checkout");
          }

          const responseJson = await response.json();
          setIsCheckedout(responseJson);
        } catch (error: any) {
          console.error("Error fetching checkout:", error);
          setHttpError(error.message);
        } finally {
          setIsLoadingCheckout(false);
        }
      }
    };

    fetchCheckout(); // Call it once when effect runs
  }, [getToken, isSignedIn, bookId, isbookCheckedout]); // Only re-run if signed-in status changes

  async function checkoutBook() {
    const token = await getToken({ template: "default" });

    if (isSignedIn) {
      const url = `${process.env.REACT_APP_API}/books/secure/checkout?bookId=${bookId}`;

      const requestOptions = {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      try {
        const response = await fetch(url, requestOptions);
        if (!response.ok) {
          throw new Error("something went wrong......");
        }

        setIsCheckedout(true);
        setCurrentLoansCount((count) => count + 1);
      } catch (error: any) {
        console.error("Error fetching checkout:", error);
        setHttpError(error.message);
      } finally {
        setIsLoadingCheckout(false);
      }
    }
  }

  async function submitReview(starInput: number, reviewDescription: string) {
    const reviewRequestModel = new ReviewRequestModel(
      starInput,
      Number(bookId),
      reviewDescription
    );

    try {
      const url = `${process.env.REACT_APP_API}/reviews/secure`;
      const token = await getToken({ template: "default" });
      const requestOptions = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reviewRequestModel),
      };
      const response = await fetch(url, requestOptions);
      if (!response.ok) {
        throw new Error("Something went wrong.....");
      }
      setIsReviewLeft(true);
    } catch (error: any) {
      throw new Error("Something went wrong.....");
    }
  }

  if (
    isLoading ||
    isLoadingReviews ||
    isLoadingLoanCount ||
    isLoadingCheckout ||
    isLoadingUserReview
  ) {
    return <SpinnerLoading />;
  }

  if (httpError) {
    return (
      <div className="container m-5">
        <p>Error: {httpError}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="container d-none d-lg-block">
        <div className="row mt-5">
          <div className="col-sm-2 col-md-2">
            {
              <img
                src={
                  book?.img
                    ? book.img
                    : require("./../../Images/BooksImages/book-luv2code-1000.png")
                }
                width="226"
                height="349"
                alt="book"
              />
            }
          </div>

          <div className="col-4 col-md-4 container">
            <div className="ml-2">
              <h2>{book?.title}</h2>
              <h5 className="text-primary">{book?.author}</h5>
              <p className="lead">{book?.description}</p>
              <StarReview Rating={totalStars} size={20} />
            </div>
          </div>
          <CheckoutAndReviewBox
            book={book}
            mobile={false}
            currentLoan={currentLoansCount}
            isCheckedout={isbookCheckedout}
            checkout={checkoutBook}
            isReviewGiven={isReviewLeft}
            leaveReview={submitReview}
          />
        </div>
        <hr />
        <LatestReviews
          reviews={reviews}
          bookId={Number(book?.id)}
          mobile={false}
        />
      </div>

      <div className="container d-lg-none mt-5">
        <div className="d-flex justify-content-center align-items-center">
          {
            <img
              src={
                book?.img
                  ? book.img
                  : require("./../../Images/BooksImages/book-luv2code-1000.png")
              }
              width="226"
              height="349"
              alt="book"
            />
          }
        </div>
        <div className="mt-4">
          <div className="ml-2">
            <h2>{book?.title}</h2>
            <h5 className="text-primary">{book?.author}</h5>
            <p className="lead">{book?.description}</p>

            <StarReview Rating={totalStars} size={20} />
          </div>
        </div>
        <CheckoutAndReviewBox
          book={book}
          mobile={true}
          currentLoan={currentLoansCount}
          isCheckedout={isbookCheckedout}
          checkout={checkoutBook}
          isReviewGiven={isReviewLeft}
          leaveReview={submitReview}
        />
        <hr />
        <LatestReviews
          reviews={reviews}
          bookId={Number(book?.id)}
          mobile={true}
        />
      </div>
    </div>
  );
};
