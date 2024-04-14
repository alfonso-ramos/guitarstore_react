import { useState, useEffect, useMemo } from "react"
import { db } from "../data/db"
import type {Guitar, CartItem} from '../types/index.ts' 


export const useCart = () => {
    const initialCart = () : CartItem[] => {
        const localStorageCart = localStorage.getItem('cart')
        return localStorageCart ? JSON.parse(localStorageCart) : []
    }

    const [data] = useState(db)
    const [cart, setCart] = useState(initialCart)

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart))
    }, [cart])

    const addToCart = (item: Guitar) => {
        // verifica si ya existe un elemento duplicado en el carrito
        const itemExist = cart.findIndex(guitar => guitar.id === item.id)
        if (itemExist >= 0) {
            // copia de carrito para no mutar el state
            const updatedCart = [...cart]
            updatedCart[itemExist].quantity++
            setCart(updatedCart)
        } else {
            const newItem : CartItem = {...item, quantity : 1}
            setCart([...cart, newItem])
        }
    }

    const removeFromCart = (id : Guitar['id']) => {
        setCart(prevCart => prevCart.filter(guitar => guitar.id !== id))
    }

    const increaseQuantity = (id : Guitar['id']) => {
        const updatedCart = cart.map(item => {
            if (item.id === id) {
                return {
                    ...item,
                    quantity: item.quantity + 1
                }
            }
            return item
        })
        setCart(updatedCart)
    }

    const decreaseQuantity = (id : Guitar['id']) => {
        const updatedCart = cart.map(item => {
            if (item.id === id && item.quantity > 1) {
                return {
                    ...item,
                    quantity: item.quantity - 1
                }
            }
            return item
        })
        setCart(updatedCart)
    }
    const clearCart = () => {
        setCart([])
    }

    // State derivado
    // Codigo que se ejecuta cada que el cart cambie
    const isEmpty = useMemo( () => cart.length === 0, [cart] )
    const cartTotal = useMemo(() => cart.reduce((total, item)  => total + (item.quantity * item.price), 0), [cart])

    return {
        data, 
        cart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        isEmpty,
        cartTotal
    }
}
