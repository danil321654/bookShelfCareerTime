import React, {useState} from 'react';
import {BrowserRouter, Route} from 'react-router-dom';

import Auth from './components/Auth';
import BookShelf from './components/BookShelf';
import AddEditBook from './components/AddEditBook';
import Logout from './components/Logout';


let savedUser;

try {
  savedUser = sessionStorage.getItem('user');
} catch {
  savedUser = undefined;
}


const App = () => {
  const [isLoggedIn, toggleLogin] = useState(!!savedUser);
  const [user, setUser] = useState(savedUser);

  return isLoggedIn ? <div>
    <BrowserRouter>
      <Route exact path="/" component={BookShelf} />
      <Route exact path="/addedit" component={AddEditBook} />
    </BrowserRouter> <Logout logout={() => {
      toggleLogin(false); setUser(undefined);
      sessionStorage.removeItem('user', user);
    }} />
  </div> :
    <Auth login={(user) => {
      toggleLogin(true); setUser(user);
      sessionStorage.removeItem('user', user);
      sessionStorage.setItem('user', user);
    }} />;
};

export default App;
