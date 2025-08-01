import React, { useState, useEffect } from 'react';
import { Check, Clock, Users, Star, ChefHat, Download, Shield, Gift } from 'lucide-react';

export default function MorangoGourmetLanding() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 45,
    seconds: 30
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const [isLoading, setIsLoading] = useState(false);
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [showEmailForm, setShowEmailForm] = useState(false);

  const handlePurchase = async () => {
    if (!showEmailForm) {
      setShowEmailForm(true);
      return;
    }

    if (!customerEmail || !customerName) {
      alert('Por favor, preencha seu nome e email para continuar.');
      return;
    }

    setIsLoading(true);

    try {
      // Track purchase attempt
      if (typeof gtag !== 'undefined') {
        gtag('event', 'begin_checkout', {
          currency: 'BRL',
          value: 47,
          event_category: 'ecommerce',
          event_label: 'morango_gourmet_ebook',
        });
      }

      // Create Stripe checkout session
      const response = await fetch('/.netlify/functions/create-ebook-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          customerEmail: customerEmail.trim(),
          customerName: customerName.trim()
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao processar pagamento');
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;
      
    } catch (error) {
      console.error('Erro ao processar:', error);
      alert('Erro ao processar. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const benefits = [
    "Técnica secreta da calda de vidro perfeita que nunca talha",
    "Receita exclusiva do brigadeiro de cobertura cremoso", 
    "Método para escolher o morango ideal (95% erram isso)",
    "3 texturas diferentes: cremosa, crocante e aveludada",
    "Temperatura exata para cada camada (crucial!)",
    "Truques de apresentação que impressionam",
    "Técnica das 3 camadas: morango + brigadeiro + calda cristal",
    "Variações gourmet: chocolate branco, meio amargo e ruby"
  ];

  const testimonials = [
    {
      name: "Maria Silva",
      text: "Finalmente consegui fazer a calda perfeita! Meus convidados pensaram que comprei em uma confeitaria premium.",
      rating: 5
    },
    {
      name: "Carlos Mendes", 
      text: "Tentei por anos e sempre dava errado. Com essas técnicas, acertei na primeira tentativa!",
      rating: 5
    },
    {
      name: "Ana Costa",
      text: "O segredo da temperatura mudou tudo. Agora faço para vender e está sendo um sucesso!",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-red-100">
      {/* Header com Urgência */}
      <div className="bg-red-600 text-white py-3 text-center">
        <div className="flex items-center justify-center gap-2 text-sm font-semibold">
          <Clock className="w-4 h-4" />
          OFERTA ESPECIAL EXPIRA EM: {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <ChefHat className="w-4 h-4" />
            SEGREDOS DE CONFEITEIRO PROFISSIONAL
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            <span className="text-red-600">PARE</span> de Desperdiçar<br />
            Morangos e Ingredientes!
          </h1>
          
            <p className="text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed">
            <strong>Você que tenta e não consegue fazer aquela camada de brigadeiro cremosa...</strong><br />
            Vou ensinar TODAS as técnicas para o <span className="text-red-600 font-bold">Morango com Brigadeiro e Calda de Vidro PERFEITO</span>
          </p>

          <div className="bg-white rounded-2xl p-8 shadow-2xl mb-8 border-4 border-red-200">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-4xl">🍓</span>
              </div>
              <div className="text-left">
                <h3 className="text-2xl font-bold text-gray-900">CURSO COMPLETO</h3>
                <p className="text-red-600 font-semibold">Morango Gourmet Profissional</p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <div className="flex items-center gap-2">
                <Download className="w-5 h-5 text-green-600" />
                <span className="text-sm font-semibold">PDF Completo</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-semibold">+2.847 Alunos</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-semibold">Garantia 7 dias</span>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="ml-2 text-gray-600 font-semibold">4.9/5 (328 avaliações)</span>
              </div>
            </div>

            <div className="text-center">
              <div className="mb-4">
                <span className="text-gray-500 line-through text-xl">De R$ 197,00</span>
                <span className="text-4xl font-bold text-red-600 ml-4">R$ 47,00</span>
              </div>
              <p className="text-sm text-red-600 font-semibold mb-6">
                🔥 76% DE DESCONTO - APENAS HOJE!
              </p>
              
              {showEmailForm && (
                <div className="mb-6 space-y-4">
                  <input
                    type="text"
                    placeholder="Seu nome completo"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                  <input
                    type="email"
                    placeholder="Seu melhor email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              )}
              
              <button 
                onClick={handlePurchase}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white text-xl font-bold py-4 px-8 rounded-lg hover:from-red-700 hover:to-red-800 transform hover:scale-105 transition-all duration-200 shadow-lg mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processando...
                  </span>
                ) : showEmailForm ? (
                  '🍓 FINALIZAR COMPRA SEGURA'
                ) : (
                  '🍓 QUERO DOMINAR O MORANGO GOURMET AGORA!'
                )}
              </button>
              
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                <Shield className="w-4 h-4" />
                Pagamento 100% seguro • Acesso imediato • Garantia de 7 dias
              </div>
            </div>
          </div>
        </div>

        {/* Problema/Agitação */}
        <div className="bg-red-50 border-l-4 border-red-600 p-8 mb-12 rounded-r-lg">
          <h2 className="text-3xl font-bold text-red-800 mb-6">
            😤 Você Já Passou Por Isso?
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-red-600 text-xl">❌</span>
                <p className="text-gray-700"><strong>Brigadeiro escorre</strong> do morango?</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-red-600 text-xl">❌</span>
                <p className="text-gray-700"><strong>Calda de vidro talha</strong> na hora errada?</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-red-600 text-xl">❌</span>
                <p className="text-gray-700"><strong>Camadas não grudam</strong> direito?</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-red-600 text-xl">❌</span>
                <p className="text-gray-700"><strong>Textura nunca fica igual</strong> das confeitarias?</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-red-600 text-xl">❌</span>
                <p className="text-gray-700"><strong>Desperdiça ingredientes caros</strong> tentando acertar?</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-red-600 text-xl">❌</span>
                <p className="text-gray-700"><strong>Não sabe a ordem certa</strong> das camadas?</p>
              </div>
            </div>
          </div>
        </div>

        {/* Solução */}
        <div className="bg-green-50 border-l-4 border-green-600 p-8 mb-12 rounded-r-lg">
          <h2 className="text-3xl font-bold text-green-800 mb-6">
            ✨ A Solução Está Aqui!
          </h2>
          <p className="text-lg text-gray-700 mb-6">
            Depois de <strong>15 anos trabalhando em confeitarias premium</strong> e ensinando centenas de pessoas, 
            criei o método definitivo que <strong>NUNCA falha</strong>.
          </p>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-gray-900 mb-4">🎯 O que você vai aprender:</h3>
            <div className="grid md:grid-cols-2 gap-3">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-lg">
              <h4 className="text-lg font-bold text-orange-800 mb-2 flex items-center gap-2">
                🍫 TÉCNICA EXCLUSIVA REVELADA:
              </h4>
              <p className="text-orange-700 font-semibold">
                O segredo do <strong>"Brigadeiro de Cobertura"</strong> - a camada cremosa que vai entre o morango e a calda de vidro, 
                criando aquela textura inesquecível que todos perguntam como fazer!
              </p>
            </div>
          </div>
        </div>

        {/* Depoimentos */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            💬 Veja o que nossos alunos estão dizendo:
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                <p className="font-semibold text-gray-900">- {testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Urgência Final */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-8 rounded-2xl text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">⏰ ÚLTIMAS HORAS!</h2>
          <p className="text-xl mb-6">
            Esta oferta especial expira à meia-noite.<br />
            <strong>Não perca a chance de finalmente dominar o morango gourmet!</strong>
          </p>
          
          <div className="bg-white bg-opacity-20 rounded-lg p-6 mb-6">
            <div className="text-2xl font-bold mb-2">
              {timeLeft.hours}:{timeLeft.minutes.toString().padStart(2, '0')}:{timeLeft.seconds.toString().padStart(2, '0')}
            </div>
            <p className="text-sm">restantes para garantir seu desconto</p>
          </div>

          <button 
            onClick={handlePurchase}
            disabled={isLoading}
            className="bg-yellow-500 hover:bg-yellow-600 text-black text-xl font-bold py-4 px-8 rounded-lg transform hover:scale-105 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                Processando...
              </span>
            ) : (
              '🍓 SIM! QUERO GARANTIR MINHA VAGA AGORA'
            )}
          </button>
        </div>

        {/* Garantia */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-8 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-blue-800 mb-4">
            Garantia Incondicional de 7 Dias
          </h3>
          <p className="text-gray-700">
            Se por qualquer motivo você não ficar 100% satisfeito com o curso, 
            devolvemos todo seu dinheiro em até 7 dias. <strong>Sem perguntas, sem complicações.</strong>
          </p>
        </div>
      </div>
    </div>
  );
}