import React, { createContext, useState, ReactNode } from 'react';

export type Language = 'pt' | 'en' | 'de';

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  pt: {
    // Navigation
    'nav.home': 'Início',
    'nav.product': 'Produto',
    'nav.pricing': 'Preços',
    'nav.care': 'Cuidados',
    'nav.about': 'Sobre',
    'nav.contact': 'Contato',
    'nav.order': 'Encomendar',
    
    // Hero Section
    'hero.tagline': 'O doce artesanal que conquistou a Suíça',
    'hero.highlight': '🍓 Morango fresco, brigadeiro branco e uma casquinha crocante de caramelo.',
    'hero.quality': '💎 Um produto de alta qualidade, feito peça por peça, com sabor e emoção.',
    'hero.order': 'Encomendar Agora',
    'hero.learn': 'Conheça o Produto',
    
    // About Section
    'about.title': 'Sabor, tradição e inovação.',
    'about.description': 'O ErdbeerGourmet é a releitura gourmet do Morango do Amor brasileiro, criado especialmente para o mercado suíço. Combinamos a doçura nostálgica do brigadeiro branco com morangos frescos e uma casquinha crocante de caramelo artesanal.',
    'about.strawberry': 'Morangos Frescos',
    'about.brigadeiro': 'Brigadeiro Branco',
    'about.caramel': 'Caramelo Artesanal',
    'about.guarantee': 'Garantia de frescor e qualidade em cada mordida',
    
    // Pricing Section
    'pricing.title': 'Preços',
    'pricing.individual': 'Individual',
    'pricing.pack2': 'Pacote 2 unidades',
    'pricing.pack5': 'Pacote 5 unidades',
    'pricing.pack10': 'Pacote 10 unidades',
    'pricing.currency': 'CHF',
    'pricing.piece': 'por unidade',
    'pricing.popular': 'Mais Popular',
    'pricing.best': 'Melhor Valor',
    'pricing.save': 'Economize',
    'pricing.buy': 'Comprar Agora',
    
    // Order Section
    'order.title': 'Como Encomendar',
    'order.whatsapp': 'WhatsApp',
    'order.whatsapp.desc': 'Envie uma mensagem para +41 78 893 6517',
    'order.pickup': 'Retirada',
    'order.pickup.desc': 'Retire em nosso ponto de produção',
    'order.delivery': 'Entrega',
    'order.delivery.desc': 'Entregamos em toda região de Zurique',
    'order.cta.title': 'Pronto para provar o doce mais desejado da Suíça?',
    'order.cta.description': 'Clique abaixo e faça seu pedido direto conosco:',
    'order.cta.button': 'FAZER PEDIDO AGORA – WhatsApp',
    
    // Care Section
    'care.title': 'Cuidados com seu ErdbeerGourmet',
    'care.refrigerate': 'Mantenha refrigerado',
    'care.refrigerate.desc': 'Conserve entre 2°C e 8°C para manter a qualidade',
    'care.consume': 'Consuma em até 3 dias',
    'care.consume.desc': 'Para melhor experiência de sabor e textura',
    'care.transport': 'Transporte com cuidado',
    'care.transport.desc': 'Evite movimentos bruscos para preservar a apresentação',
    
    // Contact Section
    'contact.title': 'Entre em Contato',
    'contact.description': 'Estamos aqui para tornar seus momentos ainda mais especiais.',
    'contact.whatsapp': 'WhatsApp',
    'contact.instagram': 'Instagram',
    'contact.email': 'E-mail',
    'contact.conclusion': 'Cada ErdbeerGourmet é feito com integridade, cuidado e alma brasileira.',
    
    // Product Gallery Section
    'gallery.title': 'Galeria do Produto',
    'gallery.description': 'Veja nosso ErdbeerGourmet em detalhes - cada foto conta a história de um doce feito com amor e dedicação.',
    'gallery.card1': 'Doce como o amor, intenso como a paixão. Descubra o sabor que derrete corações.',
    'gallery.card2': 'Brilho que encanta, crocância que surpreende. Uma explosão de sabor em cada mordida.',
    'gallery.card3': 'Mais que um doce — é uma experiência. O prazer de morder um momento perfeito.',
    'gallery.card4': 'O luxo mora nos detalhes. E esse morango é pura sofisticação açucarada.',
    'gallery.card5': 'Quando o açúcar abraça o morango, nasce uma obra-prima feita para encantar.',
    'gallery.card6': 'Pequeno no tamanho, gigante no sabor. O gourmet que conquista no primeiro toque.',
    
    // Footer
    'footer.copyright': 'Erdbeergourmet. Todos os direitos reservados.'
  },
  
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.product': 'Product',
    'nav.pricing': 'Pricing',
    'nav.care': 'Care',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.order': 'Order',
    
    // Hero Section
    'hero.tagline': 'The artisanal sweet that conquered Switzerland',
    'hero.highlight': '🍓 Fresh strawberry, white brigadeiro and a crunchy caramel shell.',
    'hero.quality': '💎 A high-quality product, made piece by piece, with flavor and emotion.',
    'hero.order': 'Order Now',
    'hero.learn': 'Learn About Product',
    
    // About Section
    'about.title': 'Flavor, tradition and innovation.',
    'about.description': 'ErdbeerGourmet is the gourmet reinterpretation of the Brazilian Morango do Amor, created especially for the Swiss market. We combine the nostalgic sweetness of white brigadeiro with fresh strawberries and a crunchy artisanal caramel shell.',
    'about.strawberry': 'Fresh Strawberries',
    'about.brigadeiro': 'White Brigadeiro',
    'about.caramel': 'Artisanal Caramel',
    'about.guarantee': 'Guarantee of freshness and quality in every bite',
    
    // Pricing Section
    'pricing.title': 'Pricing',
    'pricing.individual': 'Individual',
    'pricing.pack2': '2-piece pack',
    'pricing.pack5': '5-piece pack',
    'pricing.pack10': '10-piece pack',
    'pricing.currency': 'CHF',
    'pricing.piece': 'per piece',
    'pricing.popular': 'Most Popular',
    'pricing.best': 'Best Value',
    'pricing.save': 'Save',
    'pricing.buy': 'Buy Now',
    
    // Order Section
    'order.title': 'How to Order',
    'order.whatsapp': 'WhatsApp',
    'order.whatsapp.desc': 'Send a message to +41 78 893 6517',
    'order.pickup': 'Pickup',
    'order.pickup.desc': 'Pick up at our production point',
    'order.delivery': 'Delivery',
    'order.delivery.desc': 'We deliver throughout the Zurich region',
    'order.cta.title': 'Ready to taste Switzerland\'s most desired sweet?',
    'order.cta.description': 'Click below and place your order directly with us:',
    'order.cta.button': 'ORDER NOW – WhatsApp',
    
    // Care Section
    'care.title': 'Caring for your ErdbeerGourmet',
    'care.refrigerate': 'Keep refrigerated',
    'care.refrigerate.desc': 'Store between 2°C and 8°C to maintain quality',
    'care.consume': 'Consume within 3 days',
    'care.consume.desc': 'For the best flavor and texture experience',
    'care.transport': 'Transport with care',
    'care.transport.desc': 'Avoid sudden movements to preserve presentation',
    
    // Contact Section
    'contact.title': 'Get in Touch',
    'contact.description': 'We are here to make your moments even more special.',
    'contact.whatsapp': 'WhatsApp',
    'contact.instagram': 'Instagram',
    'contact.email': 'E-mail',
    'contact.conclusion': 'Each ErdbeerGourmet is made with integrity, care and Brazilian soul.',
    
    // Product Gallery Section
    'gallery.title': 'Product Gallery',
    'gallery.description': 'See our ErdbeerGourmet in detail - each photo tells the story of a sweet made with love and dedication.',
    'gallery.card1': 'Sweet as love, intense as passion. Discover the flavor that melts hearts.',
    'gallery.card2': 'Shine that enchants, crunch that surprises. An explosion of flavor in every bite.',
    'gallery.card3': 'More than a sweet — it\'s an experience. The pleasure of biting into a perfect moment.',
    'gallery.card4': 'Luxury lives in the details. And this strawberry is pure sugared sophistication.',
    'gallery.card5': 'When sugar embraces strawberry, a masterpiece is born to enchant.',
    'gallery.card6': 'Small in size, giant in flavor. The gourmet that conquers at first touch.',
    
    // Footer
    'footer.copyright': 'Erdbeergourmet. All rights reserved.'
  },
  
  de: {
    // Navigation
    'nav.home': 'Startseite',
    'nav.product': 'Produkt',
    'nav.pricing': 'Preise',
    'nav.care': 'Pflege',
    'nav.about': 'Über uns',
    'nav.contact': 'Kontakt',
    'nav.order': 'Bestellen',
    
    // Hero Section
    'hero.tagline': 'Die handwerkliche Süßigkeit, die die Schweiz erobert hat',
    'hero.highlight': '🍓 Frische Erdbeere, weißes Brigadeiro und eine knusprige Karamellschale.',
    'hero.quality': '💎 Ein hochwertiges Produkt, Stück für Stück hergestellt, mit Geschmack und Emotion.',
    'hero.order': 'Jetzt bestellen',
    'hero.learn': 'Produkt kennenlernen',
    
    // About Section
    'about.title': 'Geschmack, Tradition und Innovation.',
    'about.description': 'ErdbeerGourmet ist die Gourmet-Neuinterpretation des brasilianischen Morango do Amor, speziell für den Schweizer Markt kreiert. Wir kombinieren die nostalgische Süße des weißen Brigadeiro mit frischen Erdbeeren und einer knusprigen handwerklichen Karamellschale.',
    'about.strawberry': 'Frische Erdbeeren',
    'about.brigadeiro': 'Weißes Brigadeiro',
    'about.caramel': 'Handwerkliches Karamell',
    'about.guarantee': 'Garantie für Frische und Qualität in jedem Bissen',
    
    // Pricing Section
    'pricing.title': 'Preise',
    'pricing.individual': 'Einzeln',
    'pricing.pack2': '2er-Pack',
    'pricing.pack5': '5er-Pack',
    'pricing.pack10': '10er-Pack',
    'pricing.currency': 'CHF',
    'pricing.piece': 'pro Stück',
    'pricing.popular': 'Am beliebtesten',
    'pricing.best': 'Bester Wert',
    'pricing.save': 'Sparen Sie',
    'pricing.buy': 'Jetzt kaufen',
    
    // Order Section
    'order.title': 'Wie bestellen',
    'order.whatsapp': 'WhatsApp',
    'order.whatsapp.desc': 'Senden Sie eine Nachricht an +41 78 893 6517',
    'order.pickup': 'Abholung',
    'order.pickup.desc': 'Abholen an unserem Produktionsstandort',
    'order.delivery': 'Lieferung',
    'order.delivery.desc': 'Wir liefern in der ganzen Region Zürich',
    'order.cta.title': 'Bereit, die begehrteste Süßigkeit der Schweiz zu probieren?',
    'order.cta.description': 'Klicken Sie unten und bestellen Sie direkt bei uns:',
    'order.cta.button': 'JETZT BESTELLEN – WhatsApp',
    
    // Care Section
    'care.title': 'Pflege Ihres ErdbeerGourmet',
    'care.refrigerate': 'Gekühlt aufbewahren',
    'care.refrigerate.desc': 'Zwischen 2°C und 8°C lagern, um die Qualität zu erhalten',
    'care.consume': 'Innerhalb von 3 Tagen verzehren',
    'care.consume.desc': 'Für das beste Geschmacks- und Texturerlebnis',
    'care.transport': 'Vorsichtig transportieren',
    'care.transport.desc': 'Vermeiden Sie ruckartige Bewegungen, um die Präsentation zu bewahren',
    
    // Contact Section
    'contact.title': 'Kontakt aufnehmen',
    'contact.description': 'Wir sind hier, um Ihre Momente noch spezieller zu machen.',
    'contact.whatsapp': 'WhatsApp',
    'contact.instagram': 'Instagram',
    'contact.email': 'E-Mail',
    'contact.conclusion': 'Jedes ErdbeerGourmet wird mit Integrität, Sorgfalt und brasilianischer Seele hergestellt.',
    
    // Product Gallery Section
    'gallery.title': 'Produktgalerie',
    'gallery.description': 'Sehen Sie unser ErdbeerGourmet im Detail - jedes Foto erzählt die Geschichte einer Süßigkeit, die mit Liebe und Hingabe hergestellt wurde.',
    'gallery.card1': 'Süß wie die Liebe, intensiv wie die Leidenschaft. Entdecken Sie den Geschmack, der Herzen schmelzen lässt.',
    'gallery.card2': 'Glanz, der verzaubert, Knusprigkeit, die überrascht. Eine Geschmacksexplosion in jedem Bissen.',
    'gallery.card3': 'Mehr als eine Süßigkeit — es ist ein Erlebnis. Das Vergnügen, einen perfekten Moment zu beißen.',
    'gallery.card4': 'Luxus wohnt in den Details. Und diese Erdbeere ist pure gezuckerte Raffinesse.',
    'gallery.card5': 'Wenn Zucker die Erdbeere umarmt, entsteht ein Meisterwerk zum Verzaubern.',
    'gallery.card6': 'Klein in der Größe, riesig im Geschmack. Das Gourmet, das bei der ersten Berührung erobert.',
    
    // Footer
    'footer.copyright': 'Erdbeergourmet. Alle Rechte vorbehalten.'
  },
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('pt');

  const t = (key: string): string => {
    return (translations[language] as Record<string, string>)[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = React.useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};