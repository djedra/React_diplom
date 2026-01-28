import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../utils/hooks';
import { changeSearchQuery } from '../../reducers/searchBarReducer';
import { useNavigate } from 'react-router-dom';

export default function Header() {
    
    const itemsInCart = useAppSelector((state: any) => state.cart);
    const [searchForm, setSearchForm] = useState<"" | "invisible">("invisible");

    const [searchBarState, setSearchBarState] = useState<"minimized" | "expanded" | "redirect">(
        searchForm === "invisible" ? "minimized" : "expanded"
    );

    const [query, setQuery] = useState("");
    const dispatch = useAppDispatch(); 
    const navigate = useNavigate();

    function changeState() {
        switch (searchBarState) {
            case "expanded": {
                setSearchBarState("redirect");
                return;
            }
            case "minimized": {
                setSearchBarState("expanded");
                return;
            }
            case "redirect": {
                
                return;
            }
        }
    }

    const handleChange = (query: string) => {
        setQuery(query);
    };

    
    const totalAmount = itemsInCart?.totalAmount || 0;

    return (
        <header className="container">
            <div className="row">
                <div className="col">
                    <nav className="navbar navbar-expand-sm navbar-light bg-light">
                        <a className="navbar-brand" href="/">
                            <img src="../../../img/header-logo.png" alt="Bosa Noga" />
                        </a>

                        <div className="collapase navbar-collapse" id="navbarMain">
                            <ul className="navbar-nav mr-auto">
                                <li className="nav-item">
                                    <a className="nav-link" href="/">Главная</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="/catalog.html">Каталог</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="/about.html">О магазине</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="/contacts.html">Контакты</a>
                                </li>
                            </ul>
                            <div>
                                <div className="header-controls-pics">
                                    {searchBarState === "minimized" ?
                                        <div
                                            data-id="search-expander"
                                            className="header-controls-pic header-controls-search"
                                            onClick={() => {
                                                setSearchForm("");
                                                changeState();
                                            }}
                                        ></div> :
                                        <a href="/catalog.html"
                                            className="header-controls-pic header-controls-search"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                dispatch(changeSearchQuery(query));
                                                navigate("/catalog.html");
                                            }}
                                        ></a>
                                    }

                                    <div className="header-controls-pic header-controls-cart">
                                        {totalAmount > 0 && <div className="header-controls-cart-full">{totalAmount}</div>}
                                        <div className="header-controls-cart-menu">
                                            <a href="/cart.html" className="button">Go to cart</a>
                                        </div>
                                    </div>
                                </div>
                                <form
                                    data-id="search-form"
                                    className={`header-controls-search-form form-inline ${searchForm}`}
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        dispatch(changeSearchQuery(query));
                                        navigate("/catalog.html");
                                    }}
                                >
                                    <input 
                                        className="form-control" 
                                        placeholder="Поиск" 
                                        value={query} 
                                        onChange={(e) => handleChange(e.target.value)} 
                                    />
                                </form>
                            </div>
                        </div>
                    </nav>
                </div>
            </div>
        </header>
    );
}