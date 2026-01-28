import { useEffect, useState } from "react";
import CatalogItemCard from "../CatalogItemCard/CatalogItemCard";
import type { ItemData } from "../../utils/types";
import Preloader from "../Preloader";

export default function TopSales() {

    const [topSales, setTopSales] = useState<ItemData[]>();
    const [error, setError] = useState<Error>();

    async function getTopSales() {
        fetch('http://localhost:7070/api/top-sales').
            then(response => {
                return response.json();
            }).
            then(data => {
                setTopSales(data);
            }).catch(error => {
                setError(error);
            });
    };

    useEffect(() => {
        getTopSales();
    }, []);


    return (
        <section className="top-sales">
            <h2 className="text-center">Хиты продаж!</h2>
            {error ? <p> Ошибка при загрузке элементов <br/> Error: {error.message}</p> : <div className="row">
                {topSales ?
                    topSales.map(item => <div className="col-4" key={item.id}>
                        <CatalogItemCard catalogItem={item} />
                    </div>) : <Preloader />
                }
            </div>}
        </section>
    )
}