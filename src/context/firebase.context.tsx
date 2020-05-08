import React, { useState, useEffect } from "react";
import firebase from "firebase";
import app from "firebase/app";
import { Observable } from "rxjs";
import { User } from "../model/user.model";
import { Statement } from "../model/statement.model";

const firebaseConfig = {
  apiKey: "AIzaSyCiiVoKLuwQ4HE0nEPEoH-o56EnvqQAjik",
  authDomain: "faire-mes-comptes-en-ligne.firebaseapp.com",
  databaseURL: "https://faire-mes-comptes-en-ligne.firebaseio.com",
  projectId: "faire-mes-comptes-en-ligne",
  storageBucket: "faire-mes-comptes-en-ligne.appspot.com",
  messagingSenderId: "47373576382",
  appId: "1:47373576382:web:5979142fae32e97f3f56ef",
};

export type FirebaseContextProps = {
  app?: firebase.app.App | null;
  authenticated: boolean;
  user: User | null;
  setAuthenticated: (authenticated: boolean) => void;
  initCurrentUser: () => void;
  connectWithGoogle: () => void;
  signOut: () => void;
  listenStatement: () => Observable<any | null>;
  createStatement: (statement: Statement) => Promise<Statement>;
  deleteStatement: (id: string) => Promise<any>;
};

export function createCtx<ContextType>() {
  const ctx = React.createContext<ContextType | undefined>(undefined);
  function useCtx() {
    const c = React.useContext(ctx);
    if (!c) throw new Error("useCtx must be inside a Provider with a value");
    return c;
  }
  return [useCtx, ctx.Provider] as const;
}

const [useFirebase, CtxProvider] = createCtx<FirebaseContextProps>();

class Firebase {
  private _app: firebase.app.App = app.initializeApp(firebaseConfig);
  private _database: firebase.database.Database = firebase.database();
  private _google_provider = new firebase.auth.GoogleAuthProvider();
  private _user: User | null = null;

  get app(): firebase.app.App {
    return this._app;
  }

  get database(): firebase.database.Database {
    return this._database;
  }

  get google_provider() {
    return this._google_provider;
  }

  set user(user: User | null) {
    this._user = user;
    this.checkUserIntoBdd();
  }

  get user(): User | null {
    return this._user;
  }

  checkUserIntoBdd() {
    if (this._user === null) return;
    const table = this.database.ref(this._user.uid);
    table.once("value").then((snapshot) => {
      const val = snapshot.val();
      if (val === null) {
        table.set(this._user);
      }
    });
  }
}

const FirebaseApp = new Firebase();

export const FirebaseProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [authenticated, setAuthenticated] = useState<boolean>(false);

  const initCurrentUser = () => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        FirebaseApp.user = {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          emailVerified: user.emailVerified,
        };
        setAuthenticated(true);
      } else {
        setAuthenticated(false);
      }
    });
  };

  const connectWithGoogle = () => {
    firebase.auth().signInWithRedirect(FirebaseApp.google_provider);
  };

  const signOut = () => {
    FirebaseApp.user = null;
    firebase.auth().signOut();
  };

  const listenStatement = (): Observable<any | null> => {
    const table = FirebaseApp.database.ref(
      `${FirebaseApp.user?.uid}/statements`
    );
    return Observable.create((observer: any) => {
      table.on("value", (snapshot) => {
        observer.next(snapshot.val());
      });
    });
  };

  const createStatement = (statement: Statement): Promise<Statement> => {
    return new Promise((resolve, reject) => {
      const table = FirebaseApp.database.ref(
        `${FirebaseApp.user?.uid}/statements/${statement.id}`
      );
      table
        .set(statement)
        .then((val) => resolve(val))
        .catch(() => reject());
    });
  };

  const deleteStatement = (id: string): Promise<any> => {
    const table = FirebaseApp.database.ref(
      `${FirebaseApp.user?.uid}/statements/${id}`
    );
    return table.remove();
  };

  useEffect(() => {
    console.log("enter use effect firebaseContext");
    initCurrentUser();
  }, []);

  return (
    <CtxProvider
      value={{
        authenticated,
        setAuthenticated,
        initCurrentUser,
        connectWithGoogle,
        signOut,
        user: FirebaseApp.user,
        listenStatement,
        createStatement,
        deleteStatement,
      }}
    >
      {children}
    </CtxProvider>
  );
};

export { useFirebase };
export default FirebaseProvider;
