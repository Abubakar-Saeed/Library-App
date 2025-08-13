import { Redirect, Route, Switch } from "react-router-dom";
import "./App.css";
import { BookCheckoutPage } from "./layouts/BookCheckoutPage/BookCheckoutPage";
import { Footer } from "./layouts/NavbarAndFooter/Footer";
import { Navbar } from "./layouts/NavbarAndFooter/Navbar";
import { HomePage } from "./layouts/Homepage/HomePage";
import { SearchBookPage } from "./layouts/SearchBookPage/SearchBookPage";
import { Login } from "./Auth/Login";
import { Register } from "./Auth/Register";
import { ReviewListPage } from "./layouts/BookCheckoutPage/ReviewListPage/ReviewListPage";
import { ShelfPage } from "./layouts/ShelfPage/ShelfPage";
import { ProtectedRoute } from "./layouts/Utils/ProtectedRoute";
import { useAuth } from "@clerk/clerk-react";
import { useEffect } from "react";
import { Messages } from "./layouts/MessagePage/Messages";
import { ManageLibraryPage } from "./layouts/ManageLibraryPage/ManageLibraryPage";
import { useCheckRole } from "./layouts/Utils/useCheckRole";

export const App: React.FC<{}> = () => {
  const { getToken } = useAuth();
  const isAdmin = useCheckRole("admin"); // replace "admin" with your Roles type value

  useEffect(() => {
    const tokenDisplay = async () => {
      const token = await getToken({ template: "default" });

      console.log(token);
    };
    tokenDisplay();
  }, [getToken]);

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <div className="flex-grow-1 ">
        <Switch>
          <Route path="/" exact>
            <Redirect to="/home" />
          </Route>
          <Route path="/home" component={HomePage} />
          <Route path="/search" component={SearchBookPage} />
          <Route path="/checkout/:bookId" component={BookCheckoutPage} />
          <Route path="/reviewlist/:bookId" component={ReviewListPage} />

          <Route path="/login" component={Login} />
          <Route path="/signup" component={Register} />
          <ProtectedRoute exact path="/shelf" component={ShelfPage} />
          <ProtectedRoute exact path="/messages" component={Messages} />
          {isAdmin && (
            <ProtectedRoute exact path="/admin" component={ManageLibraryPage} />
          )}
        </Switch>
      </div>
      <Footer />
    </div>
  );
};
