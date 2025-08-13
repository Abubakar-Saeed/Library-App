import { useAuth } from "@clerk/clerk-react";
import { useState } from "react";
import MessageModel from "../../../models/MessageModel";

export const PostNewMessage = () => {
  const [title, setTitle] = useState("");
  const { getToken, isSignedIn } = useAuth();

  const [question, setQuestion] = useState("");

  const [displayWarning, setDisplayWarning] = useState(false);

  const [displaySuccess, setDisplaySuccess] = useState(false);

  async function submitNewQuestion() {
    if (title === "" || question === "") {
      setDisplayWarning(true);
      setDisplaySuccess(false);
      return;
    }
    const token = await getToken({ template: "default" });
    const url = `${process.env.REACT_APP_API}/messages/secure/add/message`;
    const messageRequestModel: MessageModel = new MessageModel(title, question);
    const requestParameter = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-type": "application/json",
      },
      body: JSON.stringify(messageRequestModel),
    };

    const response = await fetch(url, requestParameter);

    if (!response.ok) {
      throw new Error("Something is Wrong! ");
    }

    setQuestion("");
    setTitle("");
    setDisplaySuccess(true);
    setDisplayWarning(false);
  }

  return (
    <div className="card mt-3">
      {displaySuccess && (
        <div className="alert alert-sucess" role="alert">
          {" "}
          Question added Successfully
        </div>
      )}
      <div className="card-header">Ask Question again</div>
      <div className="card-body">
        <form action="POST">
          {displayWarning && (
            <div className="alert alert-danger" role="alert">
              All fields must be filled out.
            </div>
          )}
          <div className="mb-3">
            <label htmlFor="text" className="form-label">
              Title
            </label>
            <input
              type="text"
              className="form-control"
              id="exampleFormControlInput1"
              placeholder="Title"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="exampleFormControlTextarea1" className="form-label">
              Question
            </label>
            <textarea
              className="form-control"
              id="exampleFormControlTextarea1"
              rows={3}
              onChange={(e) => setQuestion(e.target.value)}
              value={question}
              placeholder="Enter your Question"
            ></textarea>
          </div>

          <div>
            <button
              type="button"
              className="btn btn-primary mt-3"
              onClick={() => submitNewQuestion()}
            >
              Submit Question
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
