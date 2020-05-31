import React from "react";
import { useFirebase } from "./context/firebase.context";
import { Redirect } from "react-router-dom";
import { LoadingComponent } from "./component";

const App = () => {
  const { authenticated, loadingUser } = useFirebase();

  if (loadingUser) return <LoadingComponent />;
  if (authenticated) return <Redirect to="/statements" />;
  return <Redirect to="/Connection" />;
};
export default App;
