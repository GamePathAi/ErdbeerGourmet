// Função de verificação de saúde (health check)
exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      status: 'OK',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      netlify: true,
      version: '1.0.0'
    })
  };
};