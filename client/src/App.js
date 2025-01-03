import React, { Suspense } from 'react';
import {Route, BrowserRouter as Router, Routes} from 'react-router-dom';
import './App.css';
const Home = React.lazy(() => import("./Components/Home/Home"));
const Room = React.lazy(() => import("./Components/Room/Room"));
const Meet = React.lazy(() => import("./Components/Meet/Meet"));
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Router>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path='/' element={<Home/>}/>
              <Route path='/meet' element={<Meet/>}/>
              <Route path='/room/:roomId' element={<Room/>}/>
            </Routes>
          </Suspense>
        </Router>
      </header>
    </div>
  );
}

export default App;
