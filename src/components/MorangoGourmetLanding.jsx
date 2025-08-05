import React, { useState, useEffect } from 'react';
import { Check, Clock, Users, Star, ChefHat, Download, Shield, Gift } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function MorangoGourmetLanding() {
  const { t, getCurrencySymbol } = useLanguage();
  
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 5,
    seconds: 0
  });

  // DEBUG MODE ATIVADO
  useEffect(() => {
    console.log('🔥 EBOOK DEBUG ATIVADO');
    console.log('ENV:', import.meta.env.MODE);
    console.log('URL:', window.location.href);
    console.log('STRIPE_KEY:', import.meta.env.VITE_STRIPE_PUBLIC_KEY ? 'FOUND' : 'NOT_FOUND');
    console.log('STRIPE_KEY_PREFIX:', import.meta.env.VITE_STRIPE_PUBLIC_KEY?.substring(0, 7));
    console.log('STRIPE:', !!window.Stripe);
    
    // Forçar reload de Stripe se não existir
    if (!window.Stripe) {
      const script = document.createElement('script');
      script.src = 'https://js.stripe.com/v3/';
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

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
      // Rolar para a seção de email
      setTimeout(() => {
        const emailSection = document.querySelector('.email-form-section');
        if (emailSection) {
          emailSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
      return;
    }

    if (!customerEmail || !customerName) {
      alert(t('ebook.alert_fill'));
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
      // Para desenvolvimento local, sempre usar localhost:8888 onde as funções Netlify estão rodando
      const baseUrl = (window.location.hostname === 'localhost' && window.location.port !== '4173') ? 'http://localhost:8888' : window.location.origin;
      const response = await fetch(`${baseUrl}/.netlify/functions/create-ebook-checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          customerEmail: customerEmail.trim(),
          customerName: customerName.trim()
        })
      });


      let data;
      const responseText = await response.text();
      
      try {
        data = JSON.parse(responseText);
      } catch (jsonError) {
        console.error('Erro ao fazer parse do JSON:', jsonError);
        console.error('Response status:', response.status);
        console.error('Response text:', responseText);
        throw new Error('Resposta inválida do servidor');
      }

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
    t('ebook.benefit1'),
    t('ebook.benefit2'),
    t('ebook.benefit3'),
    t('ebook.benefit4'),
    t('ebook.benefit5'),
    t('ebook.benefit6'),
    t('ebook.benefit7'),
    t('ebook.benefit8')
  ];

  const testimonials = [
    {
      name: t('ebook.testimonial1.name'),
      text: t('ebook.testimonial1.text'),
      rating: 5
    },
    {
      name: t('ebook.testimonial2.name'),
      text: t('ebook.testimonial2.text'),
      rating: 5
    },
    {
      name: t('ebook.testimonial3.name'),
      text: t('ebook.testimonial3.text'),
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-red-100">
      {/* Header com Urgência */}
      <div className="bg-red-600 text-white py-3 text-center">
        <div className="flex items-center justify-center gap-2 text-sm font-semibold">
          <Clock className="w-4 h-4" />
          {t('ebook.timer')} {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <ChefHat className="w-4 h-4" />
            {t('ebook.professional')}
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            <span className="text-red-600">PARE</span> {t('ebook.title')}
          </h1>
          
            <p className="text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed">
            <strong>{t('ebook.subtitle')}</strong><br />
            {t('ebook.subtitle2')} <span className="text-red-600 font-bold">{t('ebook.subtitle3')}</span>
          </p>

          <div className="bg-white rounded-2xl p-8 shadow-2xl mb-8 border-4 border-red-200">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-4xl">🍓</span>
              </div>
              <div className="text-left">
                <h3 className="text-2xl font-bold text-gray-900">{t('ebook.course')}</h3>
                <p className="text-red-600 font-semibold">{t('ebook.course_name')}</p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <div className="flex items-center gap-2">
                <Download className="w-5 h-5 text-green-600" />
                <span className="text-sm font-semibold">{t('ebook.pdf')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-semibold">{t('ebook.students')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-semibold">{t('ebook.guarantee')}</span>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="ml-2 text-gray-600 font-semibold">4.9/5 {t('ebook.reviews')}</span>
              </div>
            </div>

            <div className="text-center">
              <div className="mb-4">
                <span className="text-gray-500 line-through text-xl">{t('ebook.from')}</span>
                <span className="text-4xl font-bold text-red-600 ml-4">{t('ebook.price')}</span>
              </div>
              <p className="text-sm text-red-600 font-semibold mb-6">
                {t('ebook.discount')}
              </p>
              
              {showEmailForm && (
                <div className="mb-6 space-y-4 email-form-section">
                  <input
                    type="text"
                    placeholder={t('ebook.name_placeholder')}
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                  <input
                    type="email"
                    placeholder={t('ebook.email_placeholder')}
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
                    {t('ebook.processing')}
                  </span>
                ) : showEmailForm ? (
                  t('ebook.buy_secure')
                ) : (
                  t('ebook.buy_now')
                )}
              </button>
              
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                <Shield className="w-4 h-4" />
                {t('ebook.secure_payment')}
              </div>
            </div>
          </div>
        </div>

        {/* Problema/Agitação */}
        <div className="bg-red-50 border-l-4 border-red-600 p-8 mb-12 rounded-r-lg">
          <h2 className="text-3xl font-bold text-red-800 mb-6">
            {t('ebook.problem_title')}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-red-600 text-xl">❌</span>
                <p className="text-gray-700"><strong>{t('ebook.problem1')}</strong></p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-red-600 text-xl">❌</span>
                <p className="text-gray-700"><strong>{t('ebook.problem2')}</strong></p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-red-600 text-xl">❌</span>
                <p className="text-gray-700"><strong>{t('ebook.problem3')}</strong></p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-red-600 text-xl">❌</span>
                <p className="text-gray-700"><strong>{t('ebook.problem4')}</strong></p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-red-600 text-xl">❌</span>
                <p className="text-gray-700"><strong>{t('ebook.problem5')}</strong></p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-red-600 text-xl">❌</span>
                <p className="text-gray-700"><strong>{t('ebook.problem6')}</strong></p>
              </div>
            </div>
          </div>
        </div>

        {/* Solução */}
        <div className="bg-green-50 border-l-4 border-green-600 p-8 mb-12 rounded-r-lg">
          <h2 className="text-3xl font-bold text-green-800 mb-6">
            {t('ebook.solution_title')}
          </h2>
          <p className="text-lg text-gray-700 mb-6">
            {t('ebook.solution_text')}
          </p>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-gray-900 mb-4">{t('ebook.learn_title')}</h3>
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
                {t('ebook.technique_title')}
              </h4>
              <p className="text-orange-700 font-semibold">
                {t('ebook.technique_text')}
              </p>
            </div>
          </div>
        </div>

        {/* Depoimentos */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            {t('ebook.testimonials_title')}
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
          <h2 className="text-3xl font-bold mb-4">{t('ebook.urgency_title')}</h2>
          <p className="text-xl mb-6">
            {t('ebook.urgency_text')}<br />
            <strong>{t('ebook.urgency_text2')}</strong>
          </p>
          
          <div className="bg-white bg-opacity-20 rounded-lg p-6 mb-6">
            <div className="text-2xl font-bold mb-2">
              {timeLeft.hours}:{timeLeft.minutes.toString().padStart(2, '0')}:{timeLeft.seconds.toString().padStart(2, '0')}
            </div>
            <p className="text-sm">{t('ebook.time_remaining')}</p>
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
              t('ebook.final_cta')
            )}
          </button>
        </div>

        {/* Garantia */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-8 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-blue-800 mb-4">
            {t('ebook.guarantee_title')}
          </h3>
          <p className="text-gray-700">
            {t('ebook.guarantee_text')}
          </p>
        </div>
      </div>
    </div>
  );
}