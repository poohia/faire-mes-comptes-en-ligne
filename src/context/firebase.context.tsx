import React, { useState, useEffect } from "react";
import * as firebase from "firebase/app";

import app from "firebase/app";
import { Observable } from "rxjs";
import moment from "moment";

import { User } from "../model/user.model";
import { Statement, Payment } from "../model/statement.model";

import "firebase/app";
import "firebase/auth";
import "firebase/database";

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
  connectWithEmailAndPassword: (
    email: string,
    password: string
  ) => Promise<firebase.auth.UserCredential>;
  createUserWithEmailAndPassword: (
    email: string,
    password: string
  ) => Promise<firebase.auth.UserCredential>;
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
  }

  get user(): User | null {
    return this._user;
  }

  checkUserIntoBdd(): Promise<User> {
    return new Promise((resolve, reject) => {
      if (this._user === null) {
        reject(new Error("unconnect"));
        return;
      }
      const table = this.database.ref(this._user.uid);
      table.once("value").then((snapshot) => {
        const val = snapshot.val();
        if (val === null) {
          table
            .set(this._user)
            .then(() => {
              if (this._user) {
                resolve(this._user);
              } else {
                reject();
              }
            })
            .catch(() => reject());
        } else {
          this._user = val;
          resolve(val);
        }
      });
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
          offer: "free",
        };
        if (user.emailVerified) {
          FirebaseApp.checkUserIntoBdd().then(() => {
            setAuthenticated(true);
            checkStatementOfMonth();
            setLoadingUser(false);
          });
        } else {
          signOut();
        }
      } else {
        setLoadingUser(false);
        setAuthenticated(false);
      }
    });
  };

  const createUserWithEmailAndPassword = (
    email: string,
    password: string
  ): Promise<firebase.auth.UserCredential> => {
    return new Promise((resolve, reject) => {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then((res) => {
          firebase.auth().currentUser?.sendEmailVerification();
          resolve(res);
        })
        .catch(() => reject());
    });
  };

  const connectWithGoogle = () => {
    firebase.auth().signInWithRedirect(FirebaseApp.google_provider);
  };

  const connectWithEmailAndPassword = (
    email: string,
    password: string
  ): Promise<firebase.auth.UserCredential> => {
    return new Promise((resolve, reject) => {
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then((res) => {
          if (!res.user?.emailVerified) {
            firebase.auth().currentUser?.sendEmailVerification();
            reject(
              new Error(
                "Veuillez à confirmer votre adresse email avant de vous connecter"
              )
            );
          }
          resolve();
        })
        .catch((error) => {
          // if (
          //   error.code === "auth/wrong-password" ||
          //   error.code === "auth/user-not-found" ||
          //   error.code === "auth/too-many-requests"
          // ) {
          reject(
            new Error(
              "Le mot de passe n'est pas valide ou l'adresse email n'est lié à aucun utilisateur"
            )
          );
          // }
        });
    });
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
  });

  return (
    <CtxProvider
      value={{
        authenticated,
        loadingUser,
        statementOfMonthCreated,
        user: FirebaseApp.user,
        setAuthenticated,
        initCurrentUser,
        createUserWithEmailAndPassword,
        connectWithGoogle,
        connectWithEmailAndPassword,
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
