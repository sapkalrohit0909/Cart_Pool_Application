import React from 'react';
import MainRoutes from './components/MainRoutes';
import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <div className="App">
     <BrowserRouter>
      <div>
          <MainRoutes/>
      </div>
     </BrowserRouter>
    </div>
  );
}

export default App;
