# Como Adicionar suas Imagens de Produto

## 📁 Onde colocar as imagens

Coloque suas imagens de produto na pasta:
```
src/assets/images/
```

## 🖼️ Nomes dos arquivos

Renomeie suas imagens para seguir este padrão:
- `produto-1.jpg` - Imagem principal do produto
- `produto-2.jpg` - Corte transversal ou vista interna
- `produto-3.jpg` - Embalagem ou apresentação
- `produto-4.jpg` - Processo de produção
- `produto-5.jpg` - Ingredientes
- `produto-6.jpg` - Apresentação final ou contexto

## 📐 Especificações recomendadas

- **Formato**: JPG, PNG ou WebP
- **Resolução**: Mínimo 800x600px, recomendado 1200x900px
- **Proporção**: Preferencialmente 4:3 ou 16:9
- **Tamanho**: Máximo 2MB por imagem para carregamento rápido

## 🎨 Dicas para melhores resultados

1. **Iluminação**: Use luz natural ou iluminação suave
2. **Fundo**: Prefira fundos neutros (branco, cinza claro)
3. **Qualidade**: Imagens nítidas e bem focadas
4. **Ângulos**: Varie os ângulos para mostrar diferentes aspectos
5. **Contexto**: Inclua imagens do produto em uso ou ambiente

## 🔧 Personalizando a galeria

Para personalizar títulos e descrições, edite o arquivo:
```
src/components/ProductGallery.tsx
```

Procure pela seção `productImages` e modifique:
- `title`: Título que aparece ao passar o mouse
- `alt`: Texto alternativo para acessibilidade

## 📱 Visualização

Após adicionar as imagens:
1. Salve os arquivos na pasta correta
2. Execute `npm run dev`
3. Acesse a seção "Galeria do Produto" no site
4. Clique nas imagens para visualização ampliada

## ⚠️ Importante

- Certifique-se de que possui os direitos das imagens
- Otimize as imagens antes de adicionar (use ferramentas como TinyPNG)
- Teste em diferentes dispositivos (desktop, tablet, mobile)

## 🎯 Resultado

Sua galeria terá:
- ✅ Grid responsivo com 6 imagens
- ✅ Efeito hover com zoom
- ✅ Modal para visualização ampliada
- ✅ Design moderno e profissional
- ✅ Otimizada para mobile

---

**Precisa de ajuda?** Entre em contato para suporte técnico!