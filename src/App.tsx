import React from "react";
import { useFirebase } from "./context/firebase.context";
import { FButton } from "./styled/button.styled";
import { Redirect } from "react-router-dom";

export const arrayEquals = (arr1: any[], arr2: any[]): boolean => {
  return JSON.stringify(arr1) === JSON.stringify(arr2);
};

const App = () => {
  const { authenticated, connectWithGoogle, user } = useFirebase();
  console.log(user);

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
