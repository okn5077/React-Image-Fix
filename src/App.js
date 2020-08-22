import React, { useState, Suspense } from 'react';
import './App.css';
import { Route, Switch, withRouter, Router } from 'react-router-dom';
import UserContext from './context/UserContext';
import history from './history/history';


const Difficulty = React.lazy(() => {
  return import('./containers/Difficulty/Difficulty');
});

const Game = React.lazy(() => {
  return import('./containers/Game/Game');
});

const Start = React.lazy(() => {
  return import('./containers/Start/Start');
});

const App = props => {
  const [userContext, setUserContext] = useState({ userName: '' });

  return (
    <div className="App">

      <Router history={history}>
        <Switch>
          <UserContext.Provider value={[userContext, setUserContext]}>
            <Suspense fallback={<p>Loading</p>}>

              <Route path='/select-difficulty' render={() => <Difficulty {...props} />}></Route>
              <Route path='/game' render={() => <Game {...props} />}></Route>
              <Route path='/' exact render={() => <Start {...props} />}></Route>
            </Suspense>
          </UserContext.Provider>

        </Switch>
      </Router>
    </div>
  );
}

export default withRouter(App);
