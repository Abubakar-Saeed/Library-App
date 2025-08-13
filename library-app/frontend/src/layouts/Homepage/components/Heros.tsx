import { useAuth } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

export const Heros = () => {
  const { isSignedIn } = useAuth();

  return (
    <div>
      {/* Desktop Hero Section */}
      <div className="d-none d-lg-block">
        {/* Section 1 */}
        <div className="row g-0 mt-5">
          <div className="col-md-6">
            <div className="col-image-left"></div>
          </div>
          <div className="col-md-6 d-flex align-items-center justify-content-center ml-4">
            <div className="ml-2">
              <h1>What have you been reading?</h1>
              <p className="lead">
                The Library team would love to know what you've been reading.
                Whether it's to gain skills or grow personally, we provide top
                content for you!
              </p>
              {isSignedIn ? (
                <Link className="btn main-color btn-lg text-white" to="/search">
                  Explore Top Books
                </Link>
              ) : (
                <Link className="btn main-color btn-lg text-white" to="/signup">
                  Sign up
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Section 2 */}
        <div className="row g-0">
          <div className="col-md-6 d-flex align-items-center justify-content-center">
            <div className="ml-2 ">
              <h1>Our collection is always changing!</h1>
              <p className="lead">
                Check back daily — our book selection is always updating! We
                work hard to provide the most accurate, student-loved reads. Our
                books are always a top priority.
              </p>
              {isSignedIn ? (
                <Link className="btn main-color btn-lg text-white" to="/search">
                  Explore Top Books
                </Link>
              ) : (
                <Link className="btn main-color btn-lg text-white" to="/signup">
                  Sign up
                </Link>
              )}
            </div>
          </div>
          <div className="col-md-6">
            <div className="col-image-right"></div>
          </div>
        </div>
      </div>

      {/* Mobile Hero Section */}
      <div className="d-lg-none">
        <div className="container my-4">
          {/* Section 1 */}
          <div className="mb-4">
            <div className="col-image-left mb-3"></div>
            <div>
              <h1>What have you been reading?</h1>
              <p className="lead">
                The Library team would love to know what you've been reading.
                Whether it's to gain skills or grow personally, we provide top
                content for you!
              </p>
              {isSignedIn ? (
                <Link className="btn main-color btn-lg text-white" to="/search">
                  Explore Top Books
                </Link>
              ) : (
                <Link className="btn main-color btn-lg text-white" to="/signup">
                  Sign up
                </Link>
              )}
            </div>
          </div>

          {/* Section 2 */}
          <div>
            <div className="col-image-right mb-3"></div>
            <div>
              <h1>Our collection is always changing!</h1>
              <p className="lead">
                Check back daily — our book selection is always updating! We
                work hard to provide the most accurate, student-loved reads. Our
                books are always a top priority.
              </p>
              {isSignedIn ? (
                <Link className="btn main-color btn-lg text-white" to="/search">
                  Explore Top Books
                </Link>
              ) : (
                <Link className="btn main-color btn-lg text-white" to="/signup">
                  Sign up
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
