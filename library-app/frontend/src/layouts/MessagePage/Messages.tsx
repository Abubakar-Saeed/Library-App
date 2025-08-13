import { useState } from "react";
import { PostNewMessage } from "./componenets/PostNewMessage";
import { MessageComponent } from "./componenets/MessageComponent"; // ✅ Adjust path if needed

export const Messages = () => {
  const [messageClick, setMessageClick] = useState(false);

  return (
    <div className="container">
      <div className="mt-3 mb-2">
        <nav>
          <div className="nav nav-tabs" id="nav-tab" role="tablist">
            <button
              onClick={() => setMessageClick(false)}
              className={`nav-link ${!messageClick ? "active" : ""}`}
              id="nav-send-message-tab"
              data-bs-toggle="tab"
              data-bs-target="#nav-send-message"
              type="button"
              role="tab"
              aria-controls="nav-send-message"
              aria-selected={!messageClick}
            >
              Submit Question
            </button>
            <button
              onClick={() => setMessageClick(true)}
              className={`nav-link ${messageClick ? "active" : ""}`}
              id="nav-message-tab"
              data-bs-toggle="tab"
              data-bs-target="#nav-message"
              type="button"
              role="tab"
              aria-controls="nav-message"
              aria-selected={messageClick}
            >
              Q/A Response / Pending
            </button>
          </div>
        </nav>

        <div className="tab-content" id="nav-tabContent">
          <div
            className={`tab-pane fade ${!messageClick ? "show active" : ""}`}
            id="nav-send-message"
            role="tabpanel"
            aria-labelledby="nav-send-message-tab"
          >
            <PostNewMessage />
          </div>

          <div
            className={`tab-pane fade ${messageClick ? "show active" : ""}`}
            id="nav-message"
            role="tabpanel"
            aria-labelledby="nav-message-tab"
          >
            <MessageComponent />
          </div>
        </div>
      </div>
    </div>
  );
};
