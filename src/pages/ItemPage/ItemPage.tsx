import { useNavigate, useParams } from "react-router-dom";
import Banner from "../../components/Banner/Banner";
import { useEffect, useState } from "react";
import type { FullData, ItemData } from "../../utils/types";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../reducers/cartReducer";
import Preloader from "../../components/Preloader";

export default function ItemPage() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const [itemData, setItemData] = useState<FullData | undefined>(undefined);
  const [selected, setSelected] = useState<{ size: string, amount: number }>({ size: "", amount: 0 });
  const [itemError, setItemError] = useState(null);
  const [hasSizes, setHasSizes] = useState(false);

  async function getData() {
    fetch(`http://localhost:7070/api/items/${id}`)
      .then(response => response.json())
      .then(data => {
        setItemData(data);
      })
      .catch(error => {
        setItemError(error);
      });
  }

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (itemData) {
      for (let i = 0; i < itemData.sizes.length; i++) {
        if (itemData.sizes[i].available) {
          setHasSizes(true);
        }
      }
    }
  }, [itemData]);

  const navigate = useNavigate();

  return (
    <>
      {itemError ? (
        <main className="container">
          <div className="row">
            <div className="col">
              <Banner />
              <p>Ошибка при загрузке элемента</p>
              <button
                className="btn btn-outline-primary"
                onClick={() => {
                  setItemError(null);
                  getData();
                }}
              >
                Попробовать снова
              </button>
            </div>
          </div>
        </main>
      ) : (
        <main className="container">
          <div className="row">
            <div className="col">
              <Banner />
              {itemData ? (
                <section className="catalog-item">
                  <h2 className="text-center">{itemData.title}</h2>
                  <div className="row">
                    <div className="col-5">
                      <img src={itemData.images[0]} className="img-fluid" alt="" />
                    </div>
                    <div className="col-7">
                      <table className="table table-bordered">
                        <tbody>
                          <tr>
                            <td>Артикул</td>
                            <td>{itemData.sku}</td>
                          </tr>
                          <tr>
                            <td>Производитель</td>
                            <td>{itemData.manufacturer}</td>
                          </tr>
                          <tr>
                            <td>Цвет</td>
                            <td>{itemData.color}</td>
                          </tr>
                          <tr>
                            <td>Материалы</td>
                            <td>{itemData.material}</td>
                          </tr>
                          <tr>
                            <td>Сезон</td>
                            <td>{itemData.season}</td>
                          </tr>
                          <tr>
                            <td>Повод</td>
                            <td>{itemData.reason}</td>
                          </tr>
                        </tbody>
                      </table>
                      {hasSizes ? (
                        <div className="text-center">
                          <p>
                            Размеры в наличии:
                            {itemData.sizes.map(item =>
                              item.available && (
                                <span
                                  key={item.size}  // ДОБАВИЛИ UNIQUE KEY
                                  className={item.size == selected?.size ? "catalog-item-size selected" : "catalog-item-size"}
                                  onClick={() => setSelected({ size: item.size, amount: selected.amount })}
                                >
                                  {item.size}
                                </span>
                              )
                            )}
                          </p>
                          <p>
                            Количество:{" "}
                            <span className="btn-group btn-group-sm pl-2">
                              <button
                                className="btn btn-secondary"
                                onClick={() => {
                                  if (selected.amount > 0)
                                    setSelected({ size: selected.size, amount: selected.amount - 1 });
                                }}
                              >
                                -
                              </button>
                              <span className="btn btn-outline-primary">{selected.amount}</span>
                              <button
                                className="btn btn-secondary"
                                onClick={() => setSelected({ size: selected.size, amount: selected.amount + 1 })}
                              >
                                +
                              </button>
                            </span>
                          </p>
                          <button
                            className="btn btn-danger btn-block btn-lg"
                            onClick={() => {
                              if (selected.amount > 0 && selected.size !== "") {
                                dispatch(addToCart({
                                  title: itemData.title,
                                  size: selected.size,
                                  amount: selected.amount,
                                  price: itemData.price,
                                  id: itemData.id
                                }));
                                navigate("/cart"); // Исправлено для современного формата маршрутов
                              }
                            }}
                          >
                            В корзину
                          </button>
                        </div>
                      ) : (
                        <p>Нет в наличии</p>
                      )}
                    </div>
                  </div>
                </section>
              ) : (
                <Preloader />
              )}
            </div>
          </div>
        </main>
      )}
    </>
  );
}