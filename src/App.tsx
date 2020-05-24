import React from "react";
import { useFirebase } from "./context/firebase.context";
import { FButton } from "./styled/button.styled";
import { Redirect } from "react-router-dom";

const App = () => {
  const { authenticated, loadingUser, connectWithGoogle } = useFirebase();

  if (loadingUser) return <div>Loading ....</div>;
  if (authenticated) return <Redirect to="/dashboard" />;
  return (
    <div className="App">
      <div>
        <FButton onClick={() => connectWithGoogle()}>
          Connexion avec Google
        </FButton>
      </div>
    </div>
  );
};
export default App;
