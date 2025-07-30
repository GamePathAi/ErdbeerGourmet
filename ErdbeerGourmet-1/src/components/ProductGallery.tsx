import React, { useState } from 'react';
import { useLanguage } from '../hooks/useLanguage';

// Importar as imagens diretamente
import produto1 from '../assets/images/produto-1.jpeg';
import produto2 from '../assets/images/produto-2.jpeg';
import produto3 from '../assets/images/produto-3.jpeg';
import produto4 from '../assets/images/produto-4.jpeg';
import produto5 from '../assets/images/produto-5.jpeg';
import produto6 from '../assets/images/produto-6.jpeg';

interface ProductImage {
  id: number;
  src: string;
  alt: string;
  title: string;
}

const ProductGallery: React.FC = () => {
  const { t } = useLanguage();
  const [selectedImage, setSelectedImage] = useState<ProductImage | null>(null);

  // Suas imagens de produto
  const productImages: ProductImage[] = [
    {
      id: 1,
      src: produto1,
      alt: 'ErdbeerGourmet - Vista frontal',
      title: t('gallery.card1')
    },
    {
      id: 2,
      src: produto2,
      alt: 'ErdbeerGourmet - Corte transversal',
      title: t('gallery.card2')
    },
    {
      id: 3,
      src: produto3,
      alt: 'ErdbeerGourmet - Embalagem',
      title: t('gallery.card3')
    },
    {
      id: 4,
      src: produto4,
      alt: 'ErdbeerGourmet - Processo artesanal',
      title: t('gallery.card4')
    },
    {
      id: 5,
      src: produto5,
      alt: 'ErdbeerGourmet - Ingredientes',
      title: t('gallery.card5')
    },
    {
      id: 6,
      src: produto6,
      alt: 'ErdbeerGourmet - Apresentação final',
      title: t('gallery.card6')
    }
  ];

  const openModal = (image: ProductImage) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <section id="galeria" className="product-gallery-section">
      <div className="container">
        <h2 className="section-title">{t('gallery.title')}</h2>
        <p className="gallery-description">
          {t('gallery.description')}
        </p>
        
        <div className="gallery-grid">
          {productImages.map((image) => (
            <div 
              key={image.id} 
              className="gallery-item"
              onClick={() => openModal(image)}
            >
              <img 
                src={image.src} 
                alt={image.alt}
                className="gallery-image"
                loading="lazy"
              />
              <div className="gallery-overlay">
                <span className="gallery-zoom-icon">🔍</span>
                <p className="gallery-title">{image.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal para visualização ampliada */}
      {selectedImage && (
        <div className="gallery-modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              ✕
            </button>
            <img 
              src={selectedImage.src} 
              alt={selectedImage.alt}
              className="modal-image"
            />
            <h3 className="modal-title">{selectedImage.title}</h3>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProductGallery;