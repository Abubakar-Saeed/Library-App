import { useEffect, useState } from "react";
import HistoryModel from "../../../models/HistoryModel";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { useAuth, useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { Pagination } from "../../Utils/Pagination";

export const HistoryPage = () => {
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  console.log(user);

  const [isLoadingHistroy, setIsLoadingHistory] = useState(true);
  const [httpError, setHttpError] = useState(null);

  const [histories, setHistories] = useState<HistoryModel[]>([]);

  const [currentPage, setCurrentPage] = useState(1);

  const [refresh, setRefresh] = useState(true);

  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchUserHistory = async () => {
      if (isSignedIn) {
        const url = `${
          process.env.REACT_APP_API
        }/histories/search/findBooksByUserEmail?userEmail=${
          user?.primaryEmailAddress?.emailAddress
        }&page=${currentPage - 1}&size=5`;
        try {
          const response = await fetch(url);

          if (!response.ok) {
            console.error("Something wrong : ", response.status);
          }
          const responseDate = await response.json();

          setHistories(responseDate._embedded.histories);

          setTotalPages(responseDate._embedded.page.totalPages);
          setRefresh(!refresh);
        } catch (Error: any) {
          console.error(Error.message);
          setHttpError(Error.message);
        } finally {
          setIsLoadingHistory(false);
        }
      }
    };
    fetchUserHistory();
  }, [isSignedIn, currentPage, user, refresh]);

  if (isLoadingHistroy) {
    return <SpinnerLoading />;
  }
  if (httpError) {
    <div className="container m-5">{httpError}</div>;
  }

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  return (
    <div className="mt-2">
      {histories.length > 0 ? (
        <>
          <h5>Recent History</h5>
          {histories.map((history) => (
            <div key={history.id}>
              <div className="card mt-3 shadow p-3 mb-3 bg-body rounded">
                <div className="row g-0">
                  <div className="col-md-2">
                    <div className="d-none d-lg-block">
                      <img
                        src={
                          history.img
                            ? history.img
                            : require("./../../../Images/BooksImages/book-luv2code-1000.png")
                        }
                        width="123"
                        height="196"
                        alt={history.title || "Book image"}
                      />
                    </div>
                    <div className="d-lg-none justify-content-center align-item-center">
                      <img
                        src={
                          history.img
                            ? history.img
                            : require("./../../../Images/BooksImages/book-luv2code-1000.png")
                        }
                        width="123"
                        height="196"
                        alt={history.title || "Book image"}
                      />
                    </div>
                  </div>
                  <div className="col">
                    <div className="card-body">
                      <h5 className="card-title">{history.author}</h5>
                      <h4>{history.author}</h4>
                      <p className="card-text">{history.description}</p>
                      <hr />
                      <p className="card-text">
                        Checkout on: {history.checkoutDate}
                      </p>
                      <p className="card-text">
                        Returned Date: {history.returnedDate}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </>
      ) : (
        <>
          <h3 className="mt-3"> Currently no history:</h3>
          <Link className="btn btn-primary" to={`/search`}>
            Search for a new Book
          </Link>
        </>
      )}
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
