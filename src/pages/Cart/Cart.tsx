import { useAppDispatch, useAppSelector } from "../../utils/hooks";
import Banner from "../../components/Banner/Banner";
import { removeFromCart } from "../../reducers/cartReducer";
import OrderForm from "../../components/OrderForm/OrderForm";

export default function Cart() {
    // Используем any для обхода ошибки типов
    const itemsInCart = useAppSelector((state: any) => state.cart);

    const dispatch = useAppDispatch();

    // Проверяем на undefined и типизируем
    const cartData = itemsInCart?.data || [];
    const totalPrice = itemsInCart?.totalPrice || 0;

    // Тип для элемента корзины
    interface CartItem {
        id: number;
        title: string;
        size: string;
        amount: number;
        price: number;
        totalPrice: number;
    }

    return (
        <>
            <main className="container">
                <div className="row">
                    <div className="col">
                        <Banner />
                        <section className="cart">
                            <h2 className="text-center">Корзина</h2>
                            
                            {cartData.length === 0 ? (
                                <div className="text-center py-4">
                                    <p>Корзина пуста</p>
                                    <a href="/catalog.html" className="btn btn-primary">
                                        Перейти в каталог
                                    </a>
                                </div>
                            ) : (
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">Название</th>
                                            <th scope="col">Размер</th>
                                            <th scope="col">Кол-во</th>
                                            <th scope="col">Стоимость</th>
                                            <th scope="col">Итого</th>
                                            <th scope="col">Действия</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cartData.map((item: CartItem, index: number) => (
                                            <tr key={`${item.id}-${item.size}`}>
                                                <td scope="row">{index + 1}</td>
                                                <td>
                                                    <a href={`/catalog/${item.id}.html`}>
                                                        {item.title}
                                                    </a>
                                                </td>
                                                <td>{item.size}</td>
                                                <td>{item.amount}</td>
                                                <td>{item.price} руб.</td>
                                                <td>{item.totalPrice} руб.</td>
                                                <td>
                                                    <button 
                                                        className="btn btn-outline-danger btn-sm" 
                                                        onClick={() => { 
                                                            dispatch(removeFromCart({
                                                                title: item.title,
                                                                size: item.size,
                                                                amount: item.amount,
                                                                price: item.price,
                                                                id: item.id
                                                            })) 
                                                        }}
                                                    >
                                                        Удалить
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        
                                        <tr>
                                            <td colSpan={5} className="text-right">
                                                Общая стоимость
                                            </td>
                                            <td>{totalPrice} руб.</td>
                                        </tr>
                                    </tbody>
                                </table>
                            )}
                        </section>
                        <OrderForm />
                    </div>
                </div>
            </main>
        </>
    );
}