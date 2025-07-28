import React, { useState, useEffect } from 'react';
import { ShoppingCart, Plus } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { useCart } from '../hooks/useCart';
import { db, Product } from '../lib/supabase';
import { formatPrice } from '../lib/stripe';

const OrderSection: React.FC = () => {
  const { t } = useLanguage();
  const { addItem, isInCart, getItemQuantity } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Produtos reais do Stripe para demonstração
         const mockProducts = [
           {
             id: 'prod_SlJhFlcqk91ae8',
             name: '1 Erdbeere',
             description: 'Morango fresco e suculento, cultivado com carinho em nossos campos suíços.',
             price_cents: 1400,
             weight_grams: 250,
             category: 'Individual',
             image_url: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&h=300&fit=crop',
             currency: 'CHF',
             is_active: true,
             created_at: new Date().toISOString(),
             updated_at: new Date().toISOString()
           },
           {
             id: 'prod_SlJiCevrXOPhYV',
             name: '2 Erdbeere Gourmet',
             description: 'Dois morangos gourmet selecionados, perfeitos para compartilhar.',
             price_cents: 2600,
             weight_grams: 500,
             category: 'Dupla',
             image_url: 'https://images.unsplash.com/photo-1518635017498-87f514b751ba?w=400&h=300&fit=crop',
             currency: 'CHF',
             is_active: true,
             created_at: new Date().toISOString(),
             updated_at: new Date().toISOString()
           },
           {
             id: 'prod_SlJjaVyIKv8L1L',
             name: '4 Erdbeere Gourmet',
             description: 'Pacote popular com quatro morangos gourmet premium.',
             price_cents: 5000,
             weight_grams: 1000,
             category: 'Popular',
             image_url: 'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=400&h=300&fit=crop',
             currency: 'CHF',
             is_active: true,
             created_at: new Date().toISOString(),
             updated_at: new Date().toISOString()
           },
           {
             id: 'prod_SlJjt03xRlmLKl',
             name: '6 Erdbeere Gourmet',
             description: 'Seis morangos gourmet para toda a família desfrutar.',
             price_cents: 7000,
             weight_grams: 1500,
             category: 'Família',
             image_url: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=300&fit=crop',
             currency: 'CHF',
             is_active: true,
             created_at: new Date().toISOString(),
             updated_at: new Date().toISOString()
           },
           {
             id: 'prod_SlJkP5R9a0WXW6',
             name: '10 Erdbeere Gourmet',
             description: 'O melhor valor! Dez morangos gourmet premium para ocasiões especiais.',
             price_cents: 11500,
             weight_grams: 2500,
             category: 'Melhor Valor',
             image_url: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=300&fit=crop',
             currency: 'CHF',
             is_active: true,
             created_at: new Date().toISOString(),
             updated_at: new Date().toISOString()
           }
         ];
        
        // Simular delay de rede
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setProducts(mockProducts);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Erro ao carregar produtos');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price_cents,
      image: product.image_url
    });
  };

  if (loading) {
    return (
      <section id="pedido" className="order-section">
        <div className="container">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando produtos...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="pedido" className="order-section">
        <div className="container">
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <a 
              href="https://wa.me/41788936517" 
              className="btn btn-primary" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              {t('order.cta.button')}
            </a>
          </div>
        </div>
      </section>
    );
  }
  
  return (
    <section id="pedido" className="order-section">
      <div className="container">
        <div className="order-content">
          <h2 className="section-title">{t('order.cta.title')}</h2>
          <p className="order-description">
            {t('order.cta.description')}
          </p>
          
          {/* Products Grid */}
          <div className="products-grid">
            {products.map((product) => (
              <div key={product.id} className="product-card">
                {product.image_url && (
                  <div className="product-image">
                    <img 
                      src={product.image_url} 
                      alt={product.name}
                      onError={(e) => {
                        e.currentTarget.src = '/images/morango-placeholder.jpg';
                      }}
                    />
                  </div>
                )}
                
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  {product.description && (
                    <p className="product-description">{product.description}</p>
                  )}
                  
                  <div className="product-details">
                    {product.weight_grams && (
                      <span className="product-weight">{product.weight_grams}g</span>
                    )}
                    {product.category && (
                      <span className="product-category">{product.category}</span>
                    )}
                  </div>
                  
                  <div className="product-footer">
                    <span className="product-price">
                      {product.currency} {(product.price_cents / 100).toFixed(2)}
                    </span>
                    
                    <button
                      onClick={() => handleAddToCart(product)}
                      className={`btn-add-to-cart ${
                        isInCart(product.id) ? 'in-cart' : ''
                      }`}
                      title={isInCart(product.id) ? 'Adicionar mais' : 'Adicionar ao carrinho'}
                    >
                      <Plus className="h-4 w-4" />
                      {isInCart(product.id) && (
                        <span className="cart-quantity">
                          {getItemQuantity(product.id)}
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Fallback WhatsApp Button */}
          <div className="order-fallback">
            <p className="fallback-text">
              Prefere fazer o pedido diretamente?
            </p>
            <a 
              href="https://wa.me/41788936517" 
              className="btn btn-secondary" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              {t('order.cta.button')}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrderSection;