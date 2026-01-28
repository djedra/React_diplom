import Banner from "../../components/Banner/Banner";
import CatalogBlock from "../../components/CatalogBlock/CatalogBlock";

export default function Catalog() {
    return (
        <>
            <main className="container">
                <div className="row">
                    <div className="col">
                        <Banner/>
                        <CatalogBlock/>
                    </div>
                </div>
            </main>
            <script>
            </script>
        </>
    )
}