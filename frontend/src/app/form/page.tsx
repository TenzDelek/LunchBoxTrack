"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { z } from "zod";
import { orderSchema } from "@/utils/Validation";
import { SignedIn, UserButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import { GoArrowUpRight } from "react-icons/go";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000/",
});

type Order = {
  dishName: string;
  quantity: number;
};
type OrderErrors = {
  [K in keyof Order]?: string;
};
type CartItem = {
  dishName: string;
  quantity: number;
};

export default function Forms() {
  const { user } = useUser();
  const [order, setOrder] = useState<Order>({
    dishName: "",
    quantity: 1,
  });
  const [cart, setCart] = useState<CartItem[]>([]);
  const [errors, setErrors] = useState<OrderErrors>({});
  const [pastOrders, setPastOrders] = useState<any[]>([]);
  useEffect(() => {
    if (user) {
      fetchCart();
      fetchPastOrders();
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      const response = await api.get(`/get-cart?userId=${user?.id}`);
      setCart(response.data.items);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };
  const fetchPastOrders = async () => {
    try {
      const response = await api.get(`/get-past-orders?userId=${user?.id}`);
      setPastOrders(response.data);
    } catch (error) {
      console.error("Error fetching past orders:", error);
    }
  };
  const validateForm = (): boolean => {
    try {
      orderSchema.parse(order);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: OrderErrors = {};
        error.errors.forEach((err) => {
          if (err.path[0] in order) {
            newErrors[err.path[0] as keyof Order] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleAddToCart = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await api.post("/add-to-cart", { ...order, userId: user?.id });
        alert("Cart updated successfully!");
        setOrder({ dishName: "", quantity: 1 });
        fetchCart();
      } catch (error) {
        console.error("Error updating cart:", error);
        alert("Error updating cart");
      }
    }
  };

  const handleRemoveFromCart = async (index: number) => {
    try {
      await api.post("/remove-from-cart", {
        userId: user?.id,
        itemIndex: index,
      });
      fetchCart();
    } catch (error) {
      console.error("Error removing item from cart:", error);
      alert("Error removing item from cart");
    }
  };

  const handleCheckout = async () => {
    try {
      await api.post("/checkout", { userId: user?.id });
      alert("Order placed successfully!");
      setCart([]);
      fetchPastOrders(); // Refresh past orders after checkout
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Error placing order");
    }
  };
  return (
    <div className="items-center justify-center h-screen bg-[#EBEBEB] rounded-lg text-black w-full my-6 flex">
      <div className="flex-1 p-2 border-r border-black h-full items-center w-full justify-center">
    
        
        <div className="h-1/2  overflow-scroll rounded-md">
        <h2 className=" text-sm font-bold">Your LunchBox
        </h2>
          {cart.length > 0 ? (
            <>
              <ul className=" space-y-2">
                {cart.map((item, index) => (
                  <li
                    key={index}
                    className=" flex items-center justify-between bg-white rounded-sm p-2"
                  >
                    <div className=" gap-4 flex">
                      <p>{item.quantity}x </p>

                      <p className=" font-semibold">{item.dishName}</p>
                    </div>
                    <button
                      className="group flex items-center gap-x-2 bg-red-500 text-white rounded-md  text-xs  p-2"
                      onClick={() => handleRemoveFromCart(index)}
                    >
                      Remove
                      <span className=" relative overflow-hidden h-fit w-fit">
                        <GoArrowUpRight className="group-hover:-translate-y-5 group-hover:translate-x-5 duration-500 transition-transform ease-in-out-circ fill-light-gray stroke-[0.2]" />
                        <GoArrowUpRight className="absolute top-0 group-hover:translate-x-0 duration-500 group-hover:translate-y-0 transition-all ease-in-out-circ translate-y-5 -translate-x-5 fill-light-gray stroke-[0.2]" />
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
              <button
          className=" mt-2 border group flex items-center gap-x-2 border-black p-2 rounded-md hover:bg-black hover:text-white transition text-sm"
          onClick={handleCheckout}
        >
          Checkout
          <span className=" relative overflow-hidden h-fit w-fit">
            <GoArrowUpRight className="group-hover:-translate-y-5 group-hover:translate-x-5 duration-500 transition-transform ease-in-out-circ fill-light-gray stroke-[0.2]" />
            <GoArrowUpRight className="absolute top-0 group-hover:translate-x-0 duration-500 group-hover:translate-y-0 transition-all ease-in-out-circ translate-y-5 -translate-x-5 fill-light-gray stroke-[0.2]" />
          </span>
        </button>
            </>
          ) : (
            <p>Your cart is empty.</p>
          )}
        </div>
        <div className=" h-56 overflow-scroll rounded-md">
  <h2 className="text-sm font-bold mb-2 ">Past Orders</h2>
  {pastOrders.map((order, index) => (
    <div key={order._id} className="bg-white rounded-md p-4 mb-2 shadow-sm">
      <p className="font-semibold text-sm mb-2">Order #{index + 1}</p>
      <ul className="space-y-1">
        {order.items.map((item: CartItem, itemIndex: number) => (
          <li key={itemIndex} className="text-sm flex justify-between">
            <span>{item.dishName}</span>
            <span>x{item.quantity}</span>
          </li>
        ))}
      </ul>
      <p className="text-xs text-gray-500 mt-2">Status: {order.status}</p>
    </div>
  ))}
</div>
      </div>
      <div className="flex-1 h-full p-2">
        <h1 className="pl-4 flex text-sm items-center gap-2 mb-10">
          <SignedIn>
            <Image
              draggable="false"
              className="rounded-lg"
              src="https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ2l0aHViL2ltZ18ya20yTzVyaVNIZWl4M2ZxSXptWUc1UksxOUwifQ?width=160"
              alt="lunchbox"
              height={50}
              width={50}
            />
          </SignedIn>
          <p className="pl-4 text-sm">
            <span className="font-bold">Order for LunchBox</span> <br />
            Enterprise Order Management at Scale
          </p>
        </h1>
        <form
          className="border border-black p-4 rounded-md text-sm flex flex-col max-w-80 mx-auto space-y-4"
          onSubmit={handleAddToCart}
        >
          <div className="flex items-center justify-between w-full">
            <p className="font-bold">Add to Cart</p>
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
            </span>
          </div>
          <div className="flex items-center gap-x-2">
            <input
              className="text-black outline-none p-2 rounded-lg"
              type="text"
              value={order.dishName}
              onChange={(e) => setOrder({ ...order, dishName: e.target.value })}
              placeholder="Dish Name"
            />
            {errors.dishName && (
              <p className="text-xs text-red-500">{errors.dishName}</p>
            )}
          </div>
          <div className="flex items-center gap-x-2">
            <input
              className="text-black outline-none p-2 rounded-lg"
              type="number"
              value={order.quantity}
              onChange={(e) =>
                setOrder({ ...order, quantity: parseInt(e.target.value) || 1 })
              }
              min="1"
            />
            {errors.quantity && (
              <p className="text-xs text-red-500">{errors.quantity}</p>
            )}
          </div>
          <button className="bg-black p-2 rounded-lg text-white" type="submit">
            Add to Cart
          </button>
        </form>
      </div>
    </div>
  );
}
