import React, { useState, useEffect } from "react";
import firebase from "firebase";
import app from "firebase/app";
import { Observable } from "rxjs";
import moment from "moment";

import { User } from "../model/user.model";
import { Statement, Payment } from "../model/statement.model";

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
  statementOfMonthCreated: boolean;
  user: User | null;
  loadingUser: boolean;
  setAuthenticated: (authenticated: boolean) => void;
  initCurrentUser: () => void;
  connectWithGoogle: () => void;
  signOut: () => void;
  listenStatements: () => Observable<any | null>;
  listenStatement: (id: string) => Observable<Statement>;
  createStatement: (statement: Statement) => Promise<Statement>;
  deleteStatement: (id: string) => Promise<any>;
  appendPayment: (statement: Statement, payment: Payment) => Promise<Payment>;
  editPayment: (statement: Statement, payment: Payment) => Promise<Payment>;
  setPaymentActive: (
    statement: Statement,
    payment: Payment,
    active: boolean
  ) => Promise<Payment>;
  deletePayment: (statement: Statement, payment: Payment) => Promise<Payment>;
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
  const [statementOfMonthCreated, setStatementOfMonthCreated] = useState<
    boolean
  >(false);
  const [loadingUser, setLoadingUser] = useState<boolean>(true);

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
        setLoadingUser(false);
        checkStatementOfMonth();
      } else {
        setLoadingUser(false);
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

  const checkStatementOfMonth = () => {
    const now = moment();
    const table = FirebaseApp.database.ref(
      `${FirebaseApp.user?.uid}/statements/${now.format("MMYYYY")}`
    );
    table.once("value", (snapshot) => {
      const value = snapshot.val();
      if (value !== null) {
        setStatementOfMonthCreated(true);
      } else {
        setStatementOfMonthCreated(false);
      }
    });
  };

  const listenStatements = (): Observable<any | null> => {
    const table = FirebaseApp.database.ref(
      `${FirebaseApp.user?.uid}/statements`
    );
    return Observable.create((observer: any) => {
      table.on("value", (snapshot) => {
        observer.next(snapshot.val());
      });
    });
  };

  const listenStatement = (id: string): Observable<Statement> => {
    const table = FirebaseApp.database.ref(
      `${FirebaseApp.user?.uid}/statements/${id}`
    );
    return Observable.create((observer: any) => {
      table.on("value", (snapshot) => {
        const val = snapshot.val();
        observer.next(val);
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
        .then((val) => {
          resolve(val);
          setStatementOfMonthCreated(true);
        })
        .catch(() => reject());
    });
  };

  const deleteStatement = (id: string): Promise<any> => {
    const table = FirebaseApp.database.ref(
      `${FirebaseApp.user?.uid}/statements/${id}`
    );
    return table.remove().then(() => checkStatementOfMonth());
  };

  const appendPayment = (
    statement: Statement,
    payment: Payment
  ): Promise<any> => {
    let table = FirebaseApp.database.ref(
      `${FirebaseApp.user?.uid}/statements/${statement.id}/payments/`
    );
    const newPostKey = table.push().key;
    payment.id = newPostKey ?? "ERROR";
    table = FirebaseApp.database.ref(
      `${FirebaseApp.user?.uid}/statements/${statement.id}/payments/${newPostKey}`
    );
    return table.set(payment);
  };

  const editPayment = (
    statement: Statement,
    payment: Payment
  ): Promise<any> => {
    const table = FirebaseApp.database.ref(
      `${FirebaseApp.user?.uid}/statements/${statement.id}/payments/${payment.id}`
    );
    return table.set(payment);
  };

  const setPaymentActive = (
    statement: Statement,
    payment: Payment,
    active: boolean
  ): Promise<any> => {
    let table = FirebaseApp.database.ref(
      `${FirebaseApp.user?.uid}/statements/${statement.id}/payments/${payment.id}/active`
    );
    return table.set(active);
  };

  const deletePayment = (
    statement: Statement,
    payment: Payment
  ): Promise<any> => {
    const table = FirebaseApp.database.ref(
      `${FirebaseApp.user?.uid}/statements/${statement.id}/payments/${payment.id}`
    );
    return table.remove();
  };

  useEffect(() => {
    initCurrentUser();
  }, []);

  return (
    <CtxProvider
      value={{
        authenticated,
        loadingUser,
        statementOfMonthCreated,
        user: FirebaseApp.user,
        setAuthenticated,
        initCurrentUser,
        connectWithGoogle,
        signOut,
        listenStatements,
        listenStatement,
        createStatement,
        deleteStatement,
        appendPayment,
        editPayment,
        setPaymentActive,
        deletePayment,
      }}
    >
      {children}
    </CtxProvider>
  );
};

export { useFirebase };
export default FirebaseProvider;
