import Banner from "../../components/Banner/Banner";
import CatalogBlock from "../../components/CatalogBlock/CatalogBlock";
import TopSales from "../../components/TopSales/TopSales";

export default function MainPage() {
    return (
        <>
            <main className="container">
                <div className="row">
                    <div className="col">
                        <Banner />
                        <TopSales />
                        <CatalogBlock/>
                    </div>
                </div>
            </main>
            <script>
            </script>
        </>

    )
}