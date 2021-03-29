import server from './server';

server.listen(process.env.PORT, () => console.log(`Servidor de ${ process.env.NODE_ENV === 'production' ? 'PRODUÇÃO' : 'DESENVOLVIMENTO' } inicializado!`));