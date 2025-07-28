# Como Usar Logo Personalizado

## Instruções para Adicionar Sua Própria Imagem de Logo

### 1. Preparar a Imagem
- Coloque sua imagem JPEG na pasta `src/assets/images/`
- Recomendamos o nome `logo.jpg` para facilitar
- Formato recomendado: JPEG, PNG ou WebP
- Tamanho recomendado: 300x300px ou proporção quadrada
- A imagem será redimensionada automaticamente

### 2. Ativar o Logo Personalizado

Para usar sua imagem personalizada no lugar do morango SVG, modifique o arquivo `src/components/HeroSection.tsx`:

**Opção 1 - Substituir completamente:**
```tsx
<Logo 
  width={350} 
  height={350} 
  className="hero-logo" 
  inline={true}
  useCustomImage={true}
  customImagePath="/assets/images/logo.jpg"
/>
```

**Opção 2 - Alternar entre SVG e imagem:**
```tsx
// Adicione uma variável de controle no início do componente
const useCustomLogo = true; // mude para false para voltar ao SVG

// No JSX:
<Logo 
  width={350} 
  height={350} 
  className="hero-logo" 
  inline={true}
  useCustomImage={useCustomLogo}
  customImagePath="/assets/images/logo.jpg"
/>
```

### 3. Propriedades Disponíveis

- `useCustomImage`: true/false - ativa/desativa a imagem personalizada
- `customImagePath`: caminho para sua imagem
- `width` e `height`: dimensões do logo
- `inline`: true para layout horizontal, false para vertical
- `className`: classe CSS personalizada

### 4. Efeitos Incluídos

Sua imagem personalizada terá automaticamente:
- ✅ Animação de flutuação (igual ao morango SVG)
- ✅ Efeito hover com zoom
- ✅ Sombra e bordas arredondadas
- ✅ Responsividade automática
- ✅ Fallback caso a imagem não carregue

### 5. Exemplo Prático

1. Coloque sua imagem em `src/assets/images/meu-logo.jpg`
2. Abra `src/components/HeroSection.tsx`
3. Encontre a linha com `<Logo width={350}...`
4. Substitua por:
```tsx
<Logo 
  width={350} 
  height={350} 
  className="hero-logo" 
  inline={true}
  useCustomImage={true}
  customImagePath="/assets/images/meu-logo.jpg"
/>
```
5. Salve o arquivo e veja o resultado!

### 6. Dicas Importantes

- ⚠️ Certifique-se de que o caminho da imagem está correto
- ⚠️ Use imagens otimizadas para web (não muito grandes)
- ⚠️ Teste em diferentes tamanhos de tela
- ⚠️ Mantenha uma cópia de backup da imagem

### 7. Voltar ao Logo Original

Para voltar ao morango SVG, simplesmente mude `useCustomImage={false}` ou remova a propriedade.

---

**Precisa de ajuda?** O sistema está configurado para funcionar automaticamente. Se sua imagem não aparecer, verifique:
1. O caminho está correto?
2. A imagem existe na pasta?
3. O nome do arquivo está exato (incluindo extensão)?
4. Você salvou as alterações no código?