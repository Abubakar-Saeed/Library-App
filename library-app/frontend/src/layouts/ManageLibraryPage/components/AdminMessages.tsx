import { useEffect, useState } from "react";
import MessageModel from "../../../models/MessageModel";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { Pagination } from "../../Utils/Pagination";
import { AdminMessage } from "./AdminMessage";
import AdminRequestModel from "../../../models/AdminRequestModel";
import { useAuth } from "@clerk/clerk-react";

export const AdminMessages = () => {
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const [httpError, setHttpError] = useState("");

  const [messages, setMessage] = useState<MessageModel[]>([]);
  const [messagePerPage] = useState(5);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const [btnSubmit, setBtnSubmit] = useState(false);
  const { getToken, isSignedIn } = useAuth();

  useEffect(() => {
    const fetchUserMessages = async () => {
      const url = `http://localhost:8080/api/messages/search/findByClosed?closed=false&page=${
        currentPage - 1
      }&size=${messagePerPage}`;

      try {
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("There is something wrong.....");
        }

        const responseData = await response.json();

        setMessage(responseData._embedded.messages);
        setTotalPages(responseData.page.totalPages);
      } catch (Error: any) {
        setHttpError(Error.message);
        console.error(Error.message);
      } finally {
        setIsLoadingMessages(false);
      }
    };
    fetchUserMessages();
  }, [currentPage, totalPages, messagePerPage, btnSubmit]);

  if (isLoadingMessages) {
    return <SpinnerLoading />;
  }
  if (httpError) {
    <div>
      <p>{httpError}</p>
    </div>;
  }

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  async function submitResponseToQuestion(id: number, message: string) {
    const token = await getToken({ template: "default" });
    const url = `${process.env.REACT_APP_API}/messages/secure/admin/message`;

    try {
      const requestParameter = {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(new AdminRequestModel(id, message)),
      };

      const response = await fetch(url, requestParameter);

      if (!response.ok) {
        throw new Error("Something is wrong....");
      }

      setBtnSubmit(!btnSubmit);
    } catch (error: any) {
      console.error(error.message);
    }
  }

  return (
    <div className="mt-3">
      {messages.length > 0 ? (
        <>
          <h5>Pending Q/A: </h5>
          {messages.map((message) => (
            <AdminMessage
              message={message}
              submitResponse={submitResponseToQuestion}
            />
          ))}
        </>
      ) : (
        <p>No Pending Q/A</p>
      )}
      <br />
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
