import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Switch, Route } from 'react-router-dom';

import * as sessionActions from './store/session';
import Navigation from './components/Navigation';
import SpotTiles from './components/SpotTile';
import SpotDetails from './components/SpotDetails';
import AddSpotForm from './components/AddSpotForm';
import UserSpots from './components/UserSpots';
import UpdateUserSpotForm from './components/UpdateUserSpotForm';


function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser())
      .then(() => setIsLoaded(true))
  }, [dispatch])

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route exact path="/">
            <SpotTiles />
          </Route>
          <Route path="/myspots/:spotId/edit">
            <UpdateUserSpotForm />
          </Route>
          <Route path="/myspots">
            <UserSpots />
          </Route>
          <Route path="/spots/add">
            <AddSpotForm />
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
