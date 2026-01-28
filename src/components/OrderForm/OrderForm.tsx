import { type ChangeEvent, useState } from "react";
import Preloader from "../Preloader";
import type { OrderData } from "../../utils/types";
import { useAppSelector } from "../../utils/hooks";

export default function OrderForm() {
  const [ownerData, setOwnerData] = useState<{ phone: string, address: string }>({ phone: "", address: "" });

  const itemsInCart = useAppSelector((state) => state.cart);

  const [status, setStatus] = useState<"waiting" | "loading" | "success" | "error">("waiting");
  const [error, setError] = useState<Error>();

  function change(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setOwnerData((prevForm) => ({ ...prevForm, [name]: value }));
  }

  async function sendOrder(data: OrderData) {
    await fetch("http://localhost:7070/api/order", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    })
      .then(() => setStatus("success"))
      .catch((err) => {
        setStatus("error");
        setError(err);
      });
  }

  function order() {
    const orderArray: { id: number; price: number; count: number }[] = [];
    for (let i = 0; i < itemsInCart.data.length; i++) {
      orderArray.push({ id: itemsInCart.data[i].id, price: itemsInCart.data[i].price, count: itemsInCart.data[i].amount });
    }

    const data = {
      owner: {
        phone: ownerData.phone,
        address: ownerData.address,
      },
      items: orderArray,
    };

    sendOrder(data);
  }

  function validateForm(): boolean {
    let isValid = true;

    if (!ownerData.phone.trim()) {
      alert("Необходимо ввести номер телефона.");
      isValid = false;
    }

    if (!ownerData.address.trim()) {
      alert("Необходимо ввести адрес доставки.");
      isValid = false;
    }

    return isValid;
  }

  switch (status) {
    case "waiting":
      return (
        <section className="order">
          <h2 className="text-center">Оформить заказ</h2>
          <div className="card">
            <form className="card-body">
              <div className="form-group">
                <label htmlFor="phone">Телефон</label>
                <input
                  className="form-control"
                  name="phone"
                  placeholder="Ваш телефон"
                  value={ownerData.phone}
                  onChange={change}
                />
              </div>
              <div className="form-group">
                <label htmlFor="address">Адрес доставки</label>
                <input
                  className="form-control"
                  name="address"
                  placeholder="Адрес доставки"
                  value={ownerData.address}
                  onChange={change}
                />
              </div>
              <div className="form-group form-check">
                <input type="checkbox" className="form-check-input" id="agreement" />
                <label className="form-check-label" htmlFor="agreement">
                  Согласен с правилами доставки
                </label>
              </div>
              <button
                type="submit"
                className="btn btn-outline-secondary"
                disabled={status === "loading"} // Отключаем кнопку во время загрузки
                onClick={(e) => {
                  e.preventDefault();
                  if (validateForm()) {
                    setStatus("loading");
                    order();
                  }
                }}
              >
                Оформить
              </button>
            </form>
          </div>
        </section>
      );

    case "loading":
      return (
        <>
          <Preloader />
          <p>Идет оформление заказа...</p>
        </>
      );

    case "success":
      return <p>Заказ успешно оформлен!</p>;

    case "error":
      return (
        <div>
          {error ? <p>Ошибка при оформлении заказа <br />Error: {error.message}</p> : null}
        </div>
      );
  }
}