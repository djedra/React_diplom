import { type ChangeEvent, useState } from "react";
import Preloader from "../Preloader";
import type { OrderData } from "../../utils/types";
import { useAppSelector } from "../../utils/hooks";

export default function OrderForm() {
  const [ownerData, setOwnerData] = useState<{ phone: string, address: string }>({ phone: "", address: "" });

  
  const itemsInCart = useAppSelector((state: any) => state.cart);

  const [status, setStatus] = useState<"waiting" | "loading" | "success" | "error">("waiting");
  const [error, setError] = useState<Error>();

  function change(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setOwnerData((prevForm) => ({ ...prevForm, [name]: value }));
  }

  async function sendOrder(data: OrderData) {
    try {
      const response = await fetch("http://localhost:7070/api/order", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err : new Error("Unknown error"));
    }
  }

  function order() {
    // Проверяем на undefined
    const cartData = itemsInCart?.data || [];
    const orderArray: { id: number; price: number; count: number }[] = [];
    
    for (let i = 0; i < cartData.length; i++) {
      orderArray.push({ 
        id: cartData[i].id, 
        price: cartData[i].price, 
        count: cartData[i].amount 
      });
    }

    const data: OrderData = {
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
        <section className="order">
          <h2 className="text-center">Оформление заказа</h2>
          <Preloader />
          <p className="text-center">Идет оформление заказа...</p>
        </section>
      );

    case "success":
      return (
        <section className="order">
          <div className="alert alert-success text-center" role="alert">
            <h3>Заказ успешно оформлен!</h3>
            <p>Спасибо за ваш заказ. Мы свяжемся с вами в ближайшее время.</p>
          </div>
        </section>
      );

    case "error":
      return (
        <section className="order">
          <div className="alert alert-danger text-center" role="alert">
            <h3>Ошибка при оформлении заказа</h3>
            {error ? (
              <p>Error: {error.message}</p>
            ) : (
              <p>Произошла неизвестная ошибка. Пожалуйста, попробуйте снова.</p>
            )}
            <button 
              className="btn btn-outline-primary mt-3"
              onClick={() => setStatus("waiting")}
            >
              Попробовать снова
            </button>
          </div>
        </section>
      );

    default:
      return null;
  }
}