import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSearchTerm } from "../../store/redditslice";
import { FaReddit } from 'react-icons/fa';
import { FaSun, FaMoon } from "react-icons/fa";
import { HiOutlineSearch } from 'react-icons/hi';
import './Header.css'
import { TfiMenu } from "react-icons/tfi";

const Header = ({ toggleSubreddits }) => {
    //Notes for myself
    //This is a React hook to 'grab' our current search bar string
    const [searchTermLocal, setSearchTermLocal] = useState('');
    //This is a Redux Selector for easy access to our stored state.
    //Particularly our stored searchTerm
    const searchTerm = useSelector((state) => state.reddit.searchTerm);
    //This is just a Redux Dispatcher
    const dispatch = useDispatch();

    //When Search is Submitted on UI
    //This will dispatch an action to a reducer to change the state.
    const onSearchTermSubmit = (e) => {
      e.preventDefault();
      dispatch(setSearchTerm(searchTermLocal));
    };
    //Part of our React Hook. 
    //This will allow to capture an event of our search bar string changing and storing it in searchTermLocal.
    const onSearchTermChange = (e) => {
      setSearchTermLocal(e.target.value);
    };
  
    //Then this will constantly fire each time searchTerm inside our Store changes.
    // This changes our React State searchTermLocal to whatever is stored in our Redux Store.
    useEffect(() => {
      setSearchTermLocal(searchTerm);
    }, [searchTerm]);


    //Dark Mode Functions
      const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    
      useEffect(() => {
        document.documentElement.setAttribute('data-theme',  
     theme);
        localStorage.setItem('theme', theme);
      }, [theme]);
    
      const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
      };
  

    return (
      <header>
        <div className="logo">
          <FaReddit className="logo-icon" />
          <p>
            faux<span>Reddit</span>
          </p>
        </div>
        <form className="search" onSubmit={onSearchTermSubmit}>
          <input
            type="text"
            placeholder="Search fauxReddit"
            value={searchTermLocal}
            onChange={onSearchTermChange}
            aria-label="Search fauxReddit"
          />
          <button type="submit" onClick={onSearchTermSubmit} aria-label="Search">
            <HiOutlineSearch />
          </button>
        </form>

        <div className="toggle"> 
        <button onClick={toggleSubreddits}>
          <TfiMenu />
        </button>
          <button onClick={toggleTheme}>
            {theme === 'light' ? <FaMoon /> : <FaSun />}
          </button>
          </div>

      </header>
    );
  };
  
  export default Header;