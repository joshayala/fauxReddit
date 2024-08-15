import './App.css';
import React from 'react';
import Header from './features/Header/Header';
import Main from './features/Main/Main';
import Subreddits from './features/Subreddits/Subreddits';


function App() {

  return (
    <>

    <Header />
    <main>
    <Main />
    </main>
    <aside>
      <Subreddits />
    </aside>
    
    </>
  );
}

export default App;
