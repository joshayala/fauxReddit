import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSearchTerm } from "../../store/redditSlice";
import { FaReddit } from 'react-icons/fa';
import { FaSun, FaMoon } from "react-icons/fa";
import { HiOutlineSearch } from 'react-icons/hi';
import './Header.css'
// import for search term and incooperate search reducer too

const Header = () => {
    const [searchTermLocal, setSearchTermLocal] = useState('');
    const searchTerm = useSelector((state) => state.reddit.searchTerm);
    const dispatch = useDispatch();
  
    const onSearchTermChange = (e) => {
      setSearchTermLocal(e.target.value);
    };
  
    useEffect(() => {
      setSearchTermLocal(searchTerm);
    }, [searchTerm]);
  
    const onSearchTermSubmit = (e) => {
      e.preventDefault();
      dispatch(setSearchTerm(searchTermLocal));
    };


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
            Faux<span>Reddit</span>
          </p>
        </div>
        <form className="search" onSubmit={onSearchTermSubmit}>
          <input
            type="text"
            placeholder="Search Subreddits"
            value={searchTermLocal}
            onChange={onSearchTermChange}
            aria-label="Search Subreddits"
          />
          <button type="submit" onClick={onSearchTermSubmit} aria-label="Search">
            <HiOutlineSearch />
          </button>
        </form>

        <div className="toggle"> 
          <button onClick={toggleTheme}>
            {theme === 'light' ? <FaMoon /> : <FaSun />}
          </button>
          </div>

      </header>
    );
  };
  
  export default Header;