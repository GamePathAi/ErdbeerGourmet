import React, { createContext, useState, ReactNode } from 'react';

export type Language = 'pt' | 'en' | 'de';

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  getCurrencySymbol: () => string;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Definição de preços e símbolos de moeda por idioma
const currencyData = {
  pt: {
    symbol: 'R$',
    fromPrice: 'R$ 197,00',
    price: 'R$ 47,00'
  },
  en: {
    symbol: '$',
    fromPrice: '$197.00',
    price: '$47.00'
  },
  de: {
    symbol: '€',
    fromPrice: '€180,00',
    price: '€43,00'
  }
};

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
    'footer.copyright': 'Erdbeergourmet. Todos os direitos reservados.',
    
    // Ebook
    'ebook.timer': 'OFERTA ESPECIAL EXPIRA EM:',
    'ebook.professional': 'SEGREDOS DE CONFEITEIRO PROFISSIONAL',
    'ebook.title': 'de Desperdiçar Morangos e Ingredientes!',
    'ebook.subtitle': 'Você que tenta e não consegue fazer aquela camada de brigadeiro cremosa...',
    'ebook.subtitle2': 'Vou ensinar TODAS as técnicas para o',
    'ebook.subtitle3': 'Morango com Brigadeiro e Calda de Vidro PERFEITO',
    'ebook.course': 'CURSO COMPLETO',
    'ebook.course_name': 'Morango Gourmet Profissional',
    'ebook.pdf': 'PDF Completo',
    'ebook.students': '+2.847 Alunos',
    'ebook.guarantee': 'Garantia 7 dias',
    'ebook.reviews': '(328 avaliações)',
    'ebook.from': currencyData.pt.fromPrice,
    'ebook.price': currencyData.pt.price,
    'ebook.discount': '🔥 76% DE DESCONTO - APENAS HOJE!',
    'ebook.name_placeholder': 'Seu nome completo',
    'ebook.email_placeholder': 'Seu melhor email',
    'ebook.processing': 'Processando...',
    'ebook.buy_secure': '🍓 FINALIZAR COMPRA SEGURA',
    'ebook.buy_now': '🍓 QUERO DOMINAR O MORANGO GOURMET AGORA!',
    'ebook.secure_payment': 'Pagamento 100% seguro • Acesso imediato • Garantia de 7 dias',
    'ebook.problem_title': '😤 Você Já Passou Por Isso?',
    'ebook.problem1': 'Brigadeiro escorre do morango?',
    'ebook.problem2': 'Calda de vidro talha na hora errada?',
    'ebook.problem3': 'Camadas não grudam direito?',
    'ebook.problem4': 'Textura nunca fica igual das confeitarias?',
    'ebook.problem5': 'Desperdiça ingredientes caros tentando acertar?',
    'ebook.problem6': 'Não sabe a ordem certa das camadas?',
    'ebook.solution_title': '✨ A Solução Está Aqui!',
    'ebook.solution_text': 'Depois de 15 anos trabalhando em confeitarias premium e ensinando centenas de pessoas, criei o método definitivo que NUNCA falha.',
    'ebook.learn_title': '🎯 O que você vai aprender:',
    'ebook.technique_title': '🍫 TÉCNICA EXCLUSIVA REVELADA:',
     'ebook.technique_text': 'O segredo do "Brigadeiro de Cobertura" - a camada cremosa que vai entre o morango e a calda de vidro, criando aquela textura inesquecível que todos perguntam como fazer!',
     'ebook.testimonials_title': '💬 Veja o que nossos alunos estão dizendo:',
     'ebook.urgency_title': '⏰ ÚLTIMAS HORAS!',
     'ebook.urgency_text': 'Esta oferta especial expira à meia-noite.',
     'ebook.urgency_text2': 'Não perca a chance de finalmente dominar o morango gourmet!',
     'ebook.time_remaining': 'restantes para garantir seu desconto',
     'ebook.final_cta': '🍓 SIM! QUERO GARANTIR MINHA VAGA AGORA',
     'ebook.guarantee_title': 'Garantia Incondicional de 7 Dias',
     'ebook.guarantee_text': 'Se por qualquer motivo você não ficar 100% satisfeito com o curso, devolvemos todo seu dinheiro em até 7 dias. Sem perguntas, sem complicações.',
     'ebook.alert_fill': 'Por favor, preencha seu nome e email para continuar.',
    
    // Benefits
    'ebook.benefit1': 'Técnica secreta da calda de vidro perfeita que nunca talha',
    'ebook.benefit2': 'Receita exclusiva do brigadeiro de cobertura cremoso',
    'ebook.benefit3': 'Método para escolher o morango ideal (95% erram isso)',
    'ebook.benefit4': '3 texturas diferentes: cremosa, crocante e aveludada',
    'ebook.benefit5': 'Temperatura exata para cada camada (crucial!)',
    'ebook.benefit6': 'Truques de apresentação que impressionam',
    'ebook.benefit7': 'Técnica das 3 camadas: morango + brigadeiro + calda cristal',
    'ebook.benefit8': 'Variações gourmet: chocolate branco, meio amargo e ruby',
    
    // Testimonials
    'ebook.testimonial1.name': 'Maria Silva',
    'ebook.testimonial1.text': 'Finalmente consegui fazer a calda perfeita! Meus convidados pensaram que comprei em uma confeitaria premium.',
    'ebook.testimonial2.name': 'Carlos Mendes',
    'ebook.testimonial2.text': 'Tentei por anos e sempre dava errado. Com essas técnicas, acertei na primeira tentativa!',
    'ebook.testimonial3.name': 'Ana Costa',
    'ebook.testimonial3.text': 'O segredo da temperatura mudou tudo. Agora faço para vender e está sendo um sucesso!'
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
    'footer.copyright': 'Erdbeergourmet. All rights reserved.',
    
    // Ebook
    'ebook.timer': 'SPECIAL OFFER EXPIRES IN:',
    'ebook.professional': 'PROFESSIONAL PASTRY CHEF SECRETS',
    'ebook.title': 'Wasting Strawberries and Ingredients!',
    'ebook.subtitle': 'You who try and can\'t make that creamy brigadeiro layer...',
    'ebook.subtitle2': 'I will teach you ALL the techniques for the',
    'ebook.subtitle3': 'PERFECT Strawberry with Brigadeiro and Glass Syrup',
    'ebook.course': 'COMPLETE COURSE',
    'ebook.course_name': 'Professional Gourmet Strawberry',
    'ebook.pdf': 'Complete PDF',
    'ebook.students': '+2,847 Students',
    'ebook.guarantee': '7-day guarantee',
    'ebook.reviews': '(328 reviews)',
    'ebook.from': currencyData.en.fromPrice,
    'ebook.price': currencyData.en.price,
    'ebook.discount': '🔥 76% OFF - TODAY ONLY!',
    'ebook.name_placeholder': 'Your full name',
    'ebook.email_placeholder': 'Your best email',
    'ebook.processing': 'Processing...',
    'ebook.buy_secure': '🍓 COMPLETE SECURE PURCHASE',
    'ebook.buy_now': '🍓 I WANT TO MASTER GOURMET STRAWBERRY NOW!',
    'ebook.secure_payment': '100% secure payment • Immediate access • 7-day guarantee',
    'ebook.problem_title': '😤 Have You Been Through This?',
    'ebook.problem1': 'Brigadeiro drips off the strawberry?',
    'ebook.problem2': 'Glass syrup crystallizes at the wrong time?',
    'ebook.problem3': 'Layers don\'t stick properly?',
    'ebook.problem4': 'Texture never matches pastry shops?',
    'ebook.problem5': 'Waste expensive ingredients trying to get it right?',
    'ebook.problem6': 'Don\'t know the right order of layers?',
    'ebook.solution_title': '✨ The Solution Is Here!',
    'ebook.solution_text': 'After 15 years working in premium pastry shops and teaching hundreds of people, I created the definitive method that NEVER fails.',
    'ebook.learn_title': '🎯 What you will learn:',
    'ebook.technique_title': '🍫 EXCLUSIVE TECHNIQUE REVEALED:',
     'ebook.technique_text': 'The secret of the "Brigadeiro Coating" - the creamy layer that goes between the strawberry and the glass syrup, creating that unforgettable texture that everyone asks how to make!',
     'ebook.testimonials_title': '💬 See what our students are saying:',
     'ebook.urgency_title': '⏰ LAST HOURS!',
     'ebook.urgency_text': 'This special offer expires at midnight.',
     'ebook.urgency_text2': "Don't miss the chance to finally master gourmet strawberries!",
     'ebook.time_remaining': 'remaining to secure your discount',
     'ebook.final_cta': '🍓 YES! I WANT TO SECURE MY SPOT NOW',
     'ebook.guarantee_title': 'Unconditional 7-Day Guarantee',
     'ebook.guarantee_text': 'If for any reason you are not 100% satisfied with the course, we will refund all your money within 7 days. No questions, no complications.',
     'ebook.alert_fill': 'Please fill in your name and email to continue.',
    
    // Benefits
    'ebook.benefit1': 'Secret technique for perfect glass syrup that never crystallizes',
    'ebook.benefit2': 'Exclusive recipe for creamy coating brigadeiro',
    'ebook.benefit3': 'Method to choose the ideal strawberry (95% get this wrong)',
    'ebook.benefit4': '3 different textures: creamy, crunchy and velvety',
    'ebook.benefit5': 'Exact temperature for each layer (crucial!)',
    'ebook.benefit6': 'Presentation tricks that impress',
    'ebook.benefit7': '3-layer technique: strawberry + brigadeiro + crystal syrup',
    'ebook.benefit8': 'Gourmet variations: white chocolate, semi-sweet and ruby',
    
    // Testimonials
    'ebook.testimonial1.name': 'Maria Silva',
    'ebook.testimonial1.text': 'I finally managed to make the perfect syrup! My guests thought I bought it from a premium pastry shop.',
    'ebook.testimonial2.name': 'Carlos Mendes',
    'ebook.testimonial2.text': 'I tried for years and it always went wrong. With these techniques, I got it right on the first try!',
    'ebook.testimonial3.name': 'Ana Costa',
    'ebook.testimonial3.text': 'The temperature secret changed everything. Now I make them to sell and it\'s being a success!'
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
    'footer.copyright': 'Erdbeergourmet. Alle Rechte vorbehalten.',
    
    // Ebook
    'ebook.timer': 'SONDERANGEBOT LÄUFT AB IN:',
    'ebook.professional': 'PROFESSIONELLE KONDITOR-GEHEIMNISSE',
    'ebook.title': 'Erdbeeren und Zutaten zu verschwenden!',
    'ebook.subtitle': 'Sie, die es versuchen und diese cremige Brigadeiro-Schicht nicht hinbekommen...',
    'ebook.subtitle2': 'Ich werde Ihnen ALLE Techniken für die',
    'ebook.subtitle3': 'PERFEKTE Erdbeere mit Brigadeiro und Glassirup beibringen',
    'ebook.course': 'VOLLSTÄNDIGER KURS',
    'ebook.course_name': 'Professionelle Gourmet-Erdbeere',
    'ebook.pdf': 'Vollständiges PDF',
    'ebook.students': '+2.847 Schüler',
    'ebook.guarantee': '7-Tage-Garantie',
    'ebook.reviews': '(328 Bewertungen)',
    'ebook.from': currencyData.de.fromPrice,
    'ebook.price': currencyData.de.price,
    'ebook.discount': '🔥 76% RABATT - NUR HEUTE!',
    'ebook.name_placeholder': 'Ihr vollständiger Name',
    'ebook.email_placeholder': 'Ihre beste E-Mail',
    'ebook.processing': 'Verarbeitung...',
    'ebook.buy_secure': '🍓 SICHEREN KAUF ABSCHLIESSEN',
    'ebook.buy_now': '🍓 ICH MÖCHTE GOURMET-ERDBEEREN JETZT MEISTERN!',
    'ebook.secure_payment': '100% sichere Zahlung • Sofortiger Zugang • 7-Tage-Garantie',
    'ebook.problem_title': '😤 Haben Sie das schon erlebt?',
    'ebook.problem1': 'Brigadeiro tropft von der Erdbeere ab?',
    'ebook.problem2': 'Glassirup kristallisiert zur falschen Zeit?',
    'ebook.problem3': 'Schichten kleben nicht richtig?',
    'ebook.problem4': 'Textur entspricht nie der von Konditoreien?',
    'ebook.problem5': 'Verschwenden teure Zutaten beim Versuch, es richtig zu machen?',
    'ebook.problem6': 'Kennen die richtige Reihenfolge der Schichten nicht?',
    'ebook.solution_title': '✨ Die Lösung ist hier!',
    'ebook.solution_text': 'Nach 15 Jahren Arbeit in Premium-Konditoreien und dem Unterrichten von Hunderten von Menschen habe ich die definitive Methode entwickelt, die NIEMALS versagt.',
    'ebook.learn_title': '🎯 Was Sie lernen werden:',
    'ebook.technique_title': '🍫 EXKLUSIVE TECHNIK ENTHÜLLT:',
     'ebook.technique_text': 'Das Geheimnis der "Brigadeiro-Beschichtung" - die cremige Schicht zwischen der Erdbeere und dem Glassirup, die diese unvergessliche Textur schafft, nach der jeder fragt!',
     'ebook.testimonials_title': '💬 Sehen Sie, was unsere Schüler sagen:',
     'ebook.urgency_title': '⏰ LETZTE STUNDEN!',
     'ebook.urgency_text': 'Dieses Sonderangebot läuft um Mitternacht ab.',
     'ebook.urgency_text2': 'Verpassen Sie nicht die Chance, endlich Gourmet-Erdbeeren zu meistern!',
     'ebook.time_remaining': 'verbleibend, um Ihren Rabatt zu sichern',
     'ebook.final_cta': '🍓 JA! ICH MÖCHTE MEINEN PLATZ JETZT SICHERN',
     'ebook.guarantee_title': 'Bedingungslose 7-Tage-Garantie',
     'ebook.guarantee_text': 'Wenn Sie aus irgendeinem Grund nicht 100% zufrieden mit dem Kurs sind, erstatten wir Ihr gesamtes Geld innerhalb von 7 Tagen zurück. Keine Fragen, keine Komplikationen.',
     'ebook.alert_fill': 'Bitte füllen Sie Ihren Namen und Ihre E-Mail aus, um fortzufahren.',
    
    // Benefits
    'ebook.benefit1': 'Geheime Technik für perfekten Glassirup, der nie kristallisiert',
    'ebook.benefit2': 'Exklusives Rezept für cremigen Überzugs-Brigadeiro',
    'ebook.benefit3': 'Methode zur Auswahl der idealen Erdbeere (95% machen das falsch)',
    'ebook.benefit4': '3 verschiedene Texturen: cremig, knusprig und samtig',
    'ebook.benefit5': 'Exakte Temperatur für jede Schicht (entscheidend!)',
    'ebook.benefit6': 'Präsentationstricks, die beeindrucken',
    'ebook.benefit7': '3-Schichten-Technik: Erdbeere + Brigadeiro + Kristallsirup',
    'ebook.benefit8': 'Gourmet-Variationen: weiße Schokolade, halbbitter und ruby',
    
    // Testimonials
    'ebook.testimonial1.name': 'Maria Silva',
    'ebook.testimonial1.text': 'Endlich habe ich es geschafft, den perfekten Sirup zu machen! Meine Gäste dachten, ich hätte ihn in einer Premium-Konditorei gekauft.',
    'ebook.testimonial2.name': 'Carlos Mendes',
    'ebook.testimonial2.text': 'Ich habe es jahrelang versucht und es ging immer schief. Mit diesen Techniken habe ich es beim ersten Versuch geschafft!',
    'ebook.testimonial3.name': 'Ana Costa',
    'ebook.testimonial3.text': 'Das Temperatur-Geheimnis hat alles verändert. Jetzt mache ich sie zum Verkauf und es ist ein Erfolg!'
  },
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    // Recuperar idioma do localStorage ou usar 'pt' como padrão
    const savedLanguage = localStorage.getItem('erdbeergourmet-language');
    return (savedLanguage as Language) || 'pt';
  });
  
  // Salvar idioma no localStorage quando mudar
  const handleSetLanguage = (lang: Language) => {
    console.log('🌍 Setting language to:', lang);
    localStorage.setItem('erdbeergourmet-language', lang);
    setLanguage(lang);
  };

  const t = (key: string): string => {
    const translation = (translations[language] as Record<string, string>)[key];
    if (!translation) {
      console.warn('🌍 Missing translation for key:', key, 'in language:', language);
      return key;
    }
    return translation;
  };

  const getCurrencySymbol = (): string => {
    return currencyData[language].symbol;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t, getCurrencySymbol }}>
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