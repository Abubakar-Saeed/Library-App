import { useEffect, useState } from "react";
import ReviewModel from "../../../models/ReviewModel";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { Review } from "../../Utils/Review";
import { Pagination } from "../../Utils/Pagination";

export const ReviewListPage = () => {
  const bookId = window.location.pathname.split("/")[2];

  const [reviews, setReviews] = useState<ReviewModel[]>([]);
  const [totalStars, setTotalStars] = useState(0);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const [httpError, setHttpError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [reviewsPerPage] = useState(5); // Assuming you want to show 5 books per page
  const [totalAmountOfReviews, setTotalAmountOfReviews] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchReviews = async () => {
      const url = `${
        process.env.REACT_APP_API
      }/reviews/search/findByBookId?bookId=${bookId}&page=${
        currentPage - 1
      }&size=${reviewsPerPage}`;

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch reviews");
        }

        const responseJson = await response.json();
        const responseData = responseJson._embedded?.reviews;

        setTotalAmountOfReviews(responseData.length);

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

        setReviews(loadedReviews);
      } catch (error: any) {
        console.error("Error fetching reviws:", error);
        setHttpError(error.message);
      } finally {
        setIsLoadingReviews(false);
      }
    };

    fetchReviews();
  }, [bookId, currentPage, reviewsPerPage]);
  if (isLoadingReviews) {
    return <SpinnerLoading />;
  }

  if (httpError) {
    return (
      <div className="container m-5">
        <p>Error: {httpError}</p>
      </div>
    );
  }

  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const lastItem =
    reviewsPerPage * currentPage <= totalAmountOfReviews
      ? reviewsPerPage * currentPage
      : totalAmountOfReviews;

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  return (
    <div className="container m-5">
      <div>
        <h3>Comments: ({reviews.length}) </h3>
      </div>
      <p>
        {indexOfFirstReview + 1} to {lastItem} of {totalAmountOfReviews} items
      </p>
      <div className="row">
        {reviews.map((review) => {
          return <Review review={review} key={review.id} />;
        })}
      </div>
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          paginate={paginate}
        />
      )}
    </div>
  );
};
