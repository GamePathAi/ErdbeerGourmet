import React, { useEffect, useState } from 'react'
import { CheckCircle, Package, Mail, ArrowRight } from 'lucide-react'
import { useCart } from '../hooks/useCart'
import { db } from '../lib/supabase'

interface CheckoutSuccessProps {
  sessionId?: string
}

interface OrderDetails {
  orderNumber: string
  totalAmount: number
  currency: string
  customerEmail: string
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
}

export const CheckoutSuccess: React.FC<CheckoutSuccessProps> = ({ sessionId }) => {
  const { clearCart } = useCart()
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!sessionId) {
        setError('ID da sessão não encontrado')
        setLoading(false)
        return
      }

      try {
        const order = await db.orders.findByStripeSessionId(sessionId)
        
        if (order) {
          setOrderDetails({
            orderNumber: order.order_number,
            totalAmount: order.total_amount_cents,
            currency: order.currency,
            customerEmail: order.customer?.email || '',
            items: order.order_items?.map((item: any) => ({
              name: item.product?.name || 'Produto',
              quantity: item.quantity,
              price: item.unit_price_cents
            })) || []
          })
          
          // Clear cart after successful order
          clearCart()
        } else {
          setError('Pedido não encontrado')
        }
      } catch (err) {
        console.error('Error fetching order details:', err)
        setError('Erro ao carregar detalhes do pedido')
      } finally {
        setLoading(false)
      }
    }

    fetchOrderDetails()
  }, [sessionId, clearCart])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando detalhes do pedido...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-red-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <X className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Erro</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <a
            href="/"
            className="inline-flex items-center px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
          >
            Voltar ao Início
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-red-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="bg-green-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Pedido Confirmado!
            </h1>
            <p className="text-gray-600">
              Obrigado pela sua compra. Seu pedido foi processado com sucesso.
            </p>
          </div>

          {/* Order Details Card */}
          {orderDetails && (
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <div className="border-b border-gray-200 pb-4 mb-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Detalhes do Pedido
                </h2>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Número do Pedido:</span>
                  <span className="font-mono font-medium text-gray-900">
                    {orderDetails.orderNumber}
                  </span>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-3 mb-4">
                {orderDetails.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div>
                      <span className="font-medium text-gray-900">{item.name}</span>
                      <span className="text-gray-600 ml-2">x{item.quantity}</span>
                    </div>
                    <span className="font-medium text-gray-900">
                      {new Intl.NumberFormat('de-CH', {
                        style: 'currency',
                        currency: orderDetails.currency,
                      }).format((item.price * item.quantity) / 100)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">Total:</span>
                  <span className="text-lg font-bold text-red-600">
                    {new Intl.NumberFormat('de-CH', {
                      style: 'currency',
                      currency: orderDetails.currency,
                    }).format(orderDetails.totalAmount / 100)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Next Steps */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Próximos Passos
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="bg-blue-100 rounded-full p-2 flex-shrink-0">
                  <Mail className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Confirmação por Email</h4>
                  <p className="text-gray-600 text-sm">
                    Enviamos uma confirmação para {orderDetails?.customerEmail}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-orange-100 rounded-full p-2 flex-shrink-0">
                  <Package className="h-4 w-4 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Preparação do Pedido</h4>
                  <p className="text-gray-600 text-sm">
                    Seus morangos frescos serão preparados com cuidado
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-green-100 rounded-full p-2 flex-shrink-0">
                  <ArrowRight className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Entrega</h4>
                  <p className="text-gray-600 text-sm">
                    Entrega estimada em 2-3 dias úteis
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="text-center space-y-4">
            <a
              href="/"
              className="inline-flex items-center px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
            >
              Continuar Comprando
            </a>
            
            <div>
              <a
                href="/contato"
                className="text-red-600 hover:text-red-700 font-medium transition-colors"
              >
                Precisa de ajuda? Entre em contato
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
