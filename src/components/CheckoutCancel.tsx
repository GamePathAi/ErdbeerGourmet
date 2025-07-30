import React from 'react'
import { XCircle, ArrowLeft, ShoppingCart, HelpCircle } from 'lucide-react'

export const CheckoutCancel: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* Cancel Header */}
          <div className="mb-8">
            <div className="bg-red-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Checkout Cancelado
            </h1>
            <p className="text-gray-600 text-lg">
              Seu pedido foi cancelado. Não se preocupe, nada foi cobrado.
            </p>
          </div>

          {/* Information Card */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              O que aconteceu?
            </h2>
            <div className="text-left space-y-3">
              <p className="text-gray-600">
                • Você cancelou o processo de pagamento
              </p>
              <p className="text-gray-600">
                • Seus itens ainda estão salvos no carrinho
              </p>
              <p className="text-gray-600">
                • Nenhuma cobrança foi realizada
              </p>
              <p className="text-gray-600">
                • Você pode tentar novamente a qualquer momento
              </p>
            </div>
          </div>

          {/* Help Section */}
          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-center mb-3">
              <HelpCircle className="h-6 w-6 text-blue-600 mr-2" />
              <h3 className="text-lg font-semibold text-blue-900">
                Precisa de Ajuda?
              </h3>
            </div>
            <p className="text-blue-800 mb-4">
              Se você encontrou algum problema durante o checkout, estamos aqui para ajudar!
            </p>
            <div className="space-y-2 text-sm text-blue-700">
              <p>• Verifique se seus dados de pagamento estão corretos</p>
              <p>• Certifique-se de que seu cartão tem limite disponível</p>
              <p>• Tente usar um método de pagamento diferente</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.history.back()}
                className="inline-flex items-center px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Voltar ao Carrinho
              </button>
              
              <a
                href="/"
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Continuar Comprando
              </a>
            </div>
            
            <div className="pt-4">
              <a
                href="/contato"
                className="text-red-600 hover:text-red-700 font-medium transition-colors"
              >
                Entre em contato conosco se precisar de ajuda
              </a>
            </div>
          </div>

          {/* Reassurance */}
          <div className="mt-12 p-4 bg-green-50 rounded-lg">
            <p className="text-green-800 font-medium">
              🔒 Seus dados estão seguros conosco
            </p>
            <p className="text-green-700 text-sm mt-1">
              Utilizamos criptografia de ponta e não armazenamos informações de cartão de crédito
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}