import { useEffect, useState } from "react";
import CatalogItemCard from "../CatalogItemCard/CatalogItemCard";
import type { ItemData } from "../../utils/types";
import { useAppDispatch, useAppSelector } from "../../utils/hooks";
import { clearSearchQuery } from "../../reducers/searchBarReducer";
import LoadMoreButton from "./LoadMoreButton";
import Preloader from "../Preloader";

export default function CatalogBlock() {
  const [categoriesList, setCategoriesList] = useState([{ id: 0, title: "Все" }]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(0);
  const [currentItems, setCurrentItems] = useState<ItemData[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();

  const [catalogError, setCatalogError] = useState<string | null>(null);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  
  const searchString = useAppSelector((state: any) => state.search?.query || "");
  const [currentSearchQuery, setCurrentSearchQuery] = useState(searchString);

  async function getCategories() {
    try {
      const response = await fetch("http://localhost:7070/api/categories");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCategoriesList([...categoriesList, ...data]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Ошибка загрузки категорий";
      console.error("Ошибка загрузки категорий:", errorMessage);
      setCategoriesError(errorMessage);
    }
  }

  async function getCurrentItems(resetOffset = false, customOffset?: number) {
    setLoading(true);
    const currentOffset = customOffset !== undefined ? customOffset : resetOffset ? 0 : offset;

    try {
      const response = await fetch(
        `http://localhost:7070/api/items?categoryId=${selectedCategoryId}&offset=${currentOffset}&q=${searchQuery}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      if (resetOffset) {
        setCurrentItems(data);
      } else {
        const updatedItems = [...currentItems, ...data];
        setCurrentItems(updatedItems);
      }

      if (resetOffset) setOffset(0);
      setHasMore(data.length === 6);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Ошибка загрузки товаров";
      console.error("Ошибка загрузки товаров:", errorMessage);
      setCatalogError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  function getMore() {
    const newOffset = offset + 6;
    setOffset(newOffset);
    getCurrentItems(false, newOffset);
  }

  useEffect(() => {
    getCategories();
    if (currentSearchQuery && currentSearchQuery !== "") {
      setSearchQuery(currentSearchQuery);
      dispatch(clearSearchQuery());
    }
  }, []);

  useEffect(() => {
    getCurrentItems(true);
  }, [selectedCategoryId, searchQuery]);

  useEffect(() => {
    setLoading(currentItems.length === 0 && !catalogError);
  }, [currentItems, catalogError]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentSearchQuery.trim()) {
      setSearchQuery(currentSearchQuery);
      dispatch(clearSearchQuery());
    }
  };

  const handleSearch = (query: string) => {
    setCurrentSearchQuery(query);
  };

  const handleCategoryClick = (categoryId: number) => {
    setSelectedCategoryId(categoryId);
    setCurrentSearchQuery("");
    setSearchQuery("");
  };

  return (
    <section className="catalog">
      <h2 className="text-center">Каталог</h2>
      <form className="catalog-search-form form-inline" onSubmit={handleSubmit}>
        <input
          className="form-control"
          placeholder="Поиск"
          name="searchKey"
          value={currentSearchQuery}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </form>
      
      {categoriesError ? (
        <div className="alert alert-danger text-center">
          <p>Ошибка при загрузке категорий: {categoriesError}</p>
          <button 
            className="btn btn-outline-primary" 
            onClick={() => { 
              setCategoriesError(null); 
              getCategories(); 
            }}
          >
            Попробовать снова
          </button>
        </div>
      ) : (
        <ul className="catalog-categories nav justify-content-center">
          {categoriesList.map((item) => (
            <li className="nav-item" key={item.id}>
              <a
                className={item.id === selectedCategoryId ? "nav-link active" : "nav-link"}
                onClick={() => handleCategoryClick(item.id)}
                style={{ cursor: 'pointer' }}
              >
                {item.title}
              </a>
            </li>
          ))}
        </ul>
      )}
      
      {catalogError ? (
        <div className="alert alert-danger text-center">
          <p>Ошибка при загрузке каталога: {catalogError}</p>
          <button 
            className="btn btn-outline-primary" 
            onClick={() => { 
              setCatalogError(null); 
              getCurrentItems(true); 
            }}
          >
            Попробовать снова
          </button>
        </div>
      ) : (
        <>
          <div className="row">
            {loading && currentItems.length === 0 ? (
              <Preloader />
            ) : currentItems.length === 0 && !loading ? (
              <div className="col-12 text-center">
                <p className="py-4">Товары не найдены</p>
              </div>
            ) : (
              currentItems.map((item) => (
                <div className="col-4" key={item.id}>
                  <CatalogItemCard catalogItem={item} />
                </div>
              ))
            )}
          </div>
          
          {!catalogError && !loading && currentItems.length > 0 && (
            <div className="text-center mt-4">
              {hasMore && <LoadMoreButton status="show" onClick={() => getMore()} />}
              {!hasMore && currentItems.length > 0 && (
                <p className="text-muted">Все товары загружены</p>
              )}
            </div>
          )}
        </>
      )}
    </section>
  );
}