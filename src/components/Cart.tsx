import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShoppingCart, Plus, Minus, Trash2, X } from 'lucide-react'
import { useCart } from '../hooks/useCart'
import { formatPrice, createCheckoutSession } from '../lib/stripe'

interface CartProps {
  isOpen: boolean
  onClose: () => void
}

export const Cart: React.FC<CartProps> = ({ isOpen, onClose }) => {
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    getTotalItems,
    getTotalPrice
  } = useCart()
  
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGoToCart = () => {
    if (items.length === 0) return
    onClose() // Fecha o carrinho lateral
    navigate('/carrinho') // Navega para a página de carrinho
  }

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(productId)
    } else {
      updateQuantity(productId, newQuantity)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Cart Panel */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Carrinho ({getTotalItems()})
            </h2>
            <button
              onClick={onClose}
              className="rounded-md p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <ShoppingCart className="h-12 w-12 mb-4" />
                <p className="text-lg font-medium">Seu carrinho está vazio</p>
                <p className="text-sm">Adicione alguns produtos deliciosos!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.productId} className="flex items-center space-x-4 border-b border-gray-100 pb-4">
                    {/* Product Image */}
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-16 w-16 rounded-lg object-cover"
                      />
                    )}
                    
                    {/* Product Info */}
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-600">
                        {formatPrice(item.price)}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                        className="rounded-md p-1 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      
                      <span className="w-8 text-center font-medium">
                        {item.quantity}
                      </span>
                      
                      <button
                        onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                        className="rounded-md p-1 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="rounded-md p-1 text-red-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-gray-200 px-6 py-4">
              {/* Total */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-semibold text-gray-900">Total:</span>
                <span className="text-lg font-bold text-red-600">
                  {formatPrice(getTotalPrice())}
                </span>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 rounded-md bg-red-50 p-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  onClick={handleGoToCart}
                  className="w-full rounded-md bg-red-600 px-4 py-3 text-white font-medium hover:bg-red-700 transition-colors"
                >
                  Ver Carrinho
                </button>
                
                <button
                  onClick={clearCart}
                  className="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Limpar Carrinho
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Cart Icon Component
interface CartIconProps {
  onClick: () => void
  className?: string
}

export const CartIcon: React.FC<CartIconProps> = ({ onClick, className = '' }) => {
  const { getTotalItems } = useCart()
  const itemCount = getTotalItems()

  return (
    <button
      onClick={onClick}
      className={`relative p-2 text-gray-700 hover:text-red-600 transition-colors ${className}`}
    >
      <ShoppingCart className="h-6 w-6" />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-600 text-xs font-bold text-white flex items-center justify-center">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </button>
  )
}
