import type { ItemData } from "../../utils/types";

export default function CatalogItemCard(props: { catalogItem: ItemData}) {
    return (
        <div className="card catalog-item-card">
            <img src={props.catalogItem.images[0]}
                className="card-img-top img-fluid" alt={props.catalogItem.title} />
            <div className="card-body">
                <p className="card-text">{props.catalogItem.title}</p>
                <p className="card-text">{props.catalogItem.price} руб.</p>
                <a href={`/catalog/${props.catalogItem.id}.html`} className="btn btn-outline-primary">Заказать</a>
            </div>
        </div>
    )
}