import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, Plus, Minus, Trash2, ArrowLeft, CreditCard, Home } from 'lucide-react'
import { useCart } from '../hooks/useCart'
import { formatPrice, createCheckoutSession } from '../lib/stripe'
import { useLanguage } from '../hooks/useLanguage'
import Navigation from './Navigation'
import Footer from './Footer'

export const CartPage: React.FC = () => {
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    getTotalItems,
    getTotalPrice
  } = useCart()
  
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCheckout = async () => {
    if (items.length === 0) return

    setIsLoading(true)
    setError(null)

    try {
      const checkoutItems = items.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      }))

      await createCheckoutSession(checkoutItems)
    } catch (err: any) {
      setError(err.message || 'Erro ao processar checkout')
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(productId)
    } else {
      updateQuantity(productId, newQuantity)
    }
  }

  const subtotal = getTotalPrice()
  const shipping = subtotal > 5000 ? 0 : 500 // Frete grátis acima de CHF 50
  const total = subtotal + shipping

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <Navigation />
      
      {/* Page Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Voltar à loja</span>
            </button>
            <h1 className="text-xl font-semibold text-gray-900">
              Carrinho de Compras ({getTotalItems()})
            </h1>
            <div className="w-24"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {items.length === 0 ? (
          /* Empty Cart */
          <div className="text-center py-16">
            <div className="bg-white rounded-lg shadow-sm p-12">
              <ShoppingCart className="h-24 w-24 text-gray-300 mx-auto mb-6" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Seu carrinho está vazio
              </h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Parece que você ainda não adicionou nenhum produto ao seu carrinho. Explore nossos deliciosos morangos gourmet!
              </p>
              <button
                onClick={() => navigate('/')}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
              >
                <Home className="h-5 w-5" />
                <span>Continuar Comprando</span>
              </button>
            </div>
          </div>
        ) : (
          /* Cart with Items */
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-8">
              <div className="bg-white rounded-lg shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Itens do Carrinho
                  </h2>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {items.map((item) => (
                    <div key={item.productId} className="p-6">
                      <div className="flex items-start space-x-4">
                        {/* Product Image */}
                        {item.image && (
                          <div className="flex-shrink-0">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-24 w-24 rounded-lg object-cover border border-gray-200"
                            />
                          </div>
                        )}
                        
                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-4">
                            🍓 Morangos premium frescos e selecionados com brigadeiro branco artesanal
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              {/* Quantity Controls */}
                              <div className="flex items-center border border-gray-300 rounded-lg">
                                <button
                                  onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors hover:bg-gray-50"
                                >
                                  <Minus className="h-4 w-4" />
                                </button>
                                
                                <span className="px-4 py-2 font-medium text-gray-900 min-w-[3rem] text-center">
                                  {item.quantity}
                                </span>
                                
                                <button
                                  onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors hover:bg-gray-50"
                                >
                                  <Plus className="h-4 w-4" />
                                </button>
                              </div>
                              
                              {/* Remove Button */}
                              <button
                                onClick={() => removeItem(item.productId)}
                                className="flex items-center space-x-1 text-red-600 hover:text-red-700 transition-colors px-2 py-1 rounded hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="text-sm">Remover</span>
                              </button>
                            </div>
                            
                            {/* Price */}
                            <div className="text-right">
                              <p className="text-sm text-gray-600">
                                {formatPrice(item.price)} cada
                              </p>
                              <p className="text-lg font-semibold text-gray-900">
                                {formatPrice(item.price * item.quantity)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Cart Actions */}
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={clearCart}
                      className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors hover:underline"
                    >
                      Limpar Carrinho
                    </button>
                    <button
                      onClick={() => navigate('/')}
                      className="text-gray-600 hover:text-gray-700 text-sm font-medium transition-colors hover:underline"
                    >
                      Continuar Comprando
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-4 mt-8 lg:mt-0">
              <div className="bg-white rounded-lg shadow-sm sticky top-8">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Resumo do Pedido
                  </h2>
                </div>
                
                <div className="p-6 space-y-4">
                  {/* Items Count */}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Itens ({getTotalItems()})</span>
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                  </div>
                  
                  {/* Shipping */}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Frete</span>
                    <span className="font-medium">
                      {shipping === 0 ? (
                        <span className="text-green-600 font-semibold">Grátis</span>
                      ) : (
                        formatPrice(shipping)
                      )}
                    </span>
                  </div>
                  
                  {/* Free shipping notice */}
                  {shipping > 0 && (
                    <div className="text-sm text-blue-700 bg-blue-50 p-3 rounded-lg border border-blue-200">
                      <div className="flex items-center space-x-1">
                        <span>🚚</span>
                        <span>Adicione {formatPrice(5000 - subtotal)} para frete grátis!</span>
                      </div>
                    </div>
                  )}
                  
                  {shipping === 0 && subtotal > 0 && (
                    <div className="text-sm text-green-700 bg-green-50 p-3 rounded-lg border border-green-200">
                      <div className="flex items-center space-x-1">
                        <span>✅</span>
                        <span>Parabéns! Você ganhou frete grátis!</span>
                      </div>
                    </div>
                  )}
                  
                  <hr className="border-gray-200" />
                  
                  {/* Total */}
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span className="text-red-600">{formatPrice(total)}</span>
                  </div>
                  
                  {/* Error Message */}
                  {error && (
                    <div className="rounded-md bg-red-50 p-3 border border-red-200">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  )}
                  
                  {/* Checkout Button */}
                  <button
                    onClick={handleCheckout}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center space-x-2 bg-red-600 text-white font-medium py-3 px-4 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                  >
                    <CreditCard className="h-5 w-5" />
                    <span>
                      {isLoading ? 'Processando...' : 'Finalizar Compra'}
                    </span>
                  </button>
                  
                  {/* Continue Shopping */}
                  <button
                    onClick={() => navigate('/')}
                    className="w-full text-center border border-gray-300 text-gray-700 font-medium py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Continuar Comprando
                  </button>
                  
                  {/* Security Notice */}
                  <div className="text-xs text-gray-500 text-center pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-center space-x-1">
                      <span>🔒</span>
                      <span>Pagamento seguro com criptografia SSL</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Additional Info */}
              <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Informações de Entrega</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <span>📦</span>
                    <span>Entrega em 2-3 dias úteis</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>❄️</span>
                    <span>Produtos mantidos refrigerados</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>🍓</span>
                    <span>Frescor garantido</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  )
}

export default CartPage