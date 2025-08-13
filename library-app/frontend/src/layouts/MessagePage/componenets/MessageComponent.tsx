import { useAuth, useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import MessageModel from "../../../models/MessageModel";
import { Pagination } from "../../Utils/Pagination";
import { P } from "@clerk/clerk-react/dist/useAuth-QDObRHrL";

export const MessageComponent = () => {
  const { getToken, isSignedIn } = useAuth();
  const [httpError, setHttpError] = useState<string | null>(null);
  const [message, setMessage] = useState<MessageModel[]>([]);
  const [isLoadingMessage, setIsLoadingMessage] = useState(true);
  const { user } = useUser();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [messagePerPage] = useState(5);

  useEffect(() => {
    const fetchMessages = async () => {
      const token = await getToken({ template: "default" });

      try {
        const url = `${
          process.env.REACT_APP_API
        }/messages/search/findByUserEmail?userEmail=${
          user?.primaryEmailAddress?.emailAddress
        }&page=${currentPage - 1}&size=${messagePerPage}`;

        const requestOptions = {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        };

        const response = await fetch(url, requestOptions);

        if (!response.ok) {
          throw new Error("Something went wrong while fetching messages.");
        }

        const messageData = await response.json();

        setMessage(messageData._embedded.messages);
        setTotalPages(messageData.page.totalPages);
      } catch (error: any) {
        console.error(error.message);
        setHttpError(error.message);
      } finally {
        setIsLoadingMessage(false);
      }
    };

    fetchMessages();
  }, [
    getToken,
    currentPage,
    user?.primaryEmailAddress?.emailAddress,
    messagePerPage,
  ]);

  if (isLoadingMessage) {
    return <SpinnerLoading />;
  }

  if (httpError) {
    return <div className="alert alert-danger">{httpError}</div>;
  }

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="mt-2">
      {message.length > 0 ? (
        <>
          <h5>Current Q/A</h5>
          {message.map((message) => (
            <div key={message.id}>
              <div className="card mt-2 shadow p-3 bg-body rounded">
                <h5>
                  Case# {message.id}: {message.title}
                </h5>
                <h6>{message.userEmail}</h6>
                <p>{message.question}</p>
                <hr />
                <div>
                  {message.response && message.adminEmail ? (
                    <>
                      <h6>{message.adminEmail} (admin)</h6>
                      <p>
                        <strong>Response:</strong> {message.response}
                      </p>
                    </>
                  ) : (
                    <p>
                      <i>
                        Pending response from adminstration. please be patient
                      </i>
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}

          <hr />
          <br />
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              paginate={paginate}
            />
          )}
        </>
      ) : (
        <h6>No messages found.</h6>
      )}
    </div>
  );
};
