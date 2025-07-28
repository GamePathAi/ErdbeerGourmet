import React from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { useCart } from '../hooks/useCart';
import { Plus, Check } from 'lucide-react';

const PricingSection: React.FC = () => {
  const { t } = useLanguage();

  const { addItem, isInCart, getItemQuantity } = useCart();

  const handleAddToCart = (product: any) => {
    addItem({
      productId: product.stripeProductId,
      name: product.name,
      price: parseFloat(product.price),
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&h=300&fit=crop'
    });
  };
  
  const pricingData = [
    {
      titleKey: 'pricing.individual',
      name: '1 Erdbeere',
      quantity: '1',
      price: '14',
      featured: false,
      stripeProductId: 'prod_SlJhFlcqk91ae8'
    },
    {
      titleKey: 'pricing.pack2',
      name: '2 Erdbeere Gourmet',
      quantity: '2',
      price: '26',
      featured: false,
      stripeProductId: 'prod_SlJiCevrXOPhYV'
    },
    {
      titleKey: 'pricing.pack4',
      name: '4 Erdbeere Gourmet',
      quantity: '4',
      price: '50',
      featured: true,
      popular: true,
      originalPrice: '56',
      savings: '6',
      stripeProductId: 'prod_SlJjaVyIKv8L1L'
    },
    {
      titleKey: 'pricing.pack6',
      name: '6 Erdbeere Gourmet',
      quantity: '6',
      price: '70',
      featured: false,
      originalPrice: '84',
      savings: '14',
      stripeProductId: 'prod_SlJjt03xRlmLKl'
    },
    {
      titleKey: 'pricing.pack10',
      name: '10 Erdbeere Gourmet',
      quantity: '10',
      price: '115',
      featured: false,
      bestValue: true,
      originalPrice: '140',
      savings: '25',
      stripeProductId: 'prod_SlJkP5R9a0WXW6'
    }
  ];

  return (
    <section id="precos" className="pricing-section">
      <div className="container">
        <h2 className="section-title">{t('pricing.title')}</h2>
        <div className="pricing-grid">
          {pricingData.map((item, index) => (
            <div key={index} className={`pricing-card ${item.featured ? 'featured' : ''}`}>
              <h3>{t(item.titleKey)}</h3>
              <p className="quantity">{item.quantity} {t('pricing.piece')}</p>
              <div className="price-section">
                <p className="price">{t('pricing.currency')} {item.price}</p>
                {item.originalPrice && (
                  <p className="original-price">{t('pricing.currency')} {item.originalPrice}</p>
                )}
                {item.savings && (
                  <p className="savings">{t('pricing.save')} {t('pricing.currency')} {item.savings}</p>
                )}
              </div>
              {item.popular && (
                <p className="badge popular">{t('pricing.popular')}</p>
              )}
              {item.bestValue && (
                <p className="badge best-value">{t('pricing.best')}</p>
              )}
              <button 
                className={`buy-button ${isInCart(item.stripeProductId) ? 'in-cart' : ''}`}
                onClick={() => handleAddToCart(item)}
              >
                {isInCart(item.stripeProductId) ? (
                  <>
                    <Check size={16} />
                    {getItemQuantity(item.stripeProductId) > 0 && (
                      <span className="cart-quantity">{getItemQuantity(item.stripeProductId)}</span>
                    )}
                  </>
                ) : (
                  <>
                    <Plus size={16} />
                    {t('pricing.buy')}
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;