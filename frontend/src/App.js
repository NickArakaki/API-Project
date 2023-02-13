import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Switch, Route } from 'react-router-dom';

import Navigation from './components/Navigation';
import SpotTiles from './components/SpotTile';
import SpotDetails from './components/SpotDetails';
import * as sessionActions from './store/session';


function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch])

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route exact path="/">
            <SpotTiles />
          </Route>
          <Route path="/spots/:spotId">
            <SpotDetails />
          </Route>
          <Route>
            <h2>Page not found</h2>
          </Route>
        </Switch>
      )}
    </>
  );
}

export default App;
