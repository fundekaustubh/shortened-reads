import React, { useEffect, useRef, useState } from "react";
import Loader from '../Loader';
import axios from "axios";
import ArticleLink from "../ArticleLink";
import Article from "../Article";
import './styles.css';

const Articles = () => {
    const searchText = useRef(null);
    const searchStartingDate = useRef(null);
    const searchEndingDate = useRef(null);
    const searchType = useRef(null);
    const [expandMode, setExpandMode] = useState(false);
    const [selectedArticle, setSelectedArticle] = useState(undefined);
    const [searchBody, setSearchBody] = useState({});
    const [articles, setArticles] = useState(undefined);
    const [fetchArticlesIsPending, setFetchArticlesIsPending] = useState(true);
    const [fetchArticlesError, setFetchArticlesError] = useState(undefined);

    /**
     * @function
     * @async
     * @description Asynchronously fetch articles from the backend server. 
     * The function sets the fetch status and fetched articles data on success, and sets an error on failure. 
     */
    const fetchArticles = async () => {
        try {
            setFetchArticlesIsPending(true);
            const _articles = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/articles`, searchBody);
            setFetchArticlesIsPending(false);
            setArticles(_articles);
        }
        catch (err) {
            setFetchArticlesError(err);
            setFetchArticlesIsPending(false);
        }
    }

    useEffect(() => {
        setArticles([]);
        setSelectedArticle(undefined);
        setExpandMode(false);
        fetchArticles();
    }, [searchBody])

    /**
   * Handles the search functionality and returns a list of articles.
   * 
   * @param {Object} evt - The event object passed in by the form submission.
   */
    const handleSearch = async (evt) => {
        evt.preventDefault();
        // include sources as well
        setExpandMode(false);
        setSearchBody({
            q: searchText.current.value,
            from: searchStartingDate.current.value,
            to: searchEndingDate.current.value,
            sortBy: searchType.current.value
        });
    }
    return (
        <div className="Component">
            <form onSubmit={handleSearch}>
                <div className="InputGroup">
                    <button className="BackButton" onClick={(e) => {
                        e.preventDefault();
                        setExpandMode(false);
                        setSelectedArticle(undefined);
                    }}>
                        <span>BACK</span>
                    </button>
                    <input type="text" ref={searchText} id="SearchText" autoComplete="off" />
                    <label htmlFor="SearchText">Search for a topic...</label>
                    <input placeholder="From" type="date" ref={searchStartingDate} />
                    <input placeholder="To" type="date" ref={searchEndingDate} />
                    <select ref={searchType}>
                        <option value="popularity" defaultValue>Popularity</option>
                        <option value="relevancy">Relevancy</option>
                        <option value="publishedAt">Published At</option>
                    </select>
                    <button className="LearnMore" type="submit">
                        <span className="circle" aria-hidden="true">
                            <span className="icon arrow"></span>
                        </span>
                        <span className="ButtonText">Search</span>
                    </button>
                </div>
            </form>
            {
                fetchArticlesIsPending &&
                <Loader />
            }
            {
                articles && articles.data && articles.data.articles.length > 0 &&
                (
                    expandMode ?
                        <>
                            <Article article={selectedArticle} setExpandMode={setExpandMode} />
                        </> :
                        <>
                            {articles.data.topHeadlines ?
                                <div className="ArticlesStatus">Top headlines!</div> :
                                <div className="ArticlesStatus">Relevant articles!</div>}
                            <ul>
                                {articles.data.articles.map((article, idx) =>
                                    <ArticleLink article={article} key={idx} setSelectedArticle={setSelectedArticle} setExpandMode={setExpandMode} />)}
                            </ul>
                        </>
                )
            }
            {
                fetchArticlesError === true &&
                <div>Oh no, error!</div>
            }
        </div>
    );
}

export default Articles;