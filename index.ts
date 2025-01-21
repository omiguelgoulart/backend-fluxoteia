import express from 'express';
import cors from 'cors';
import routesLogin from './routes/login';
import routesUsuario from './routes/usuarios';
import routesDespesas from './routes/despesas';
import routesEntradas from './routes/entradas';
import routesCupom from './routes/cupom';


const app = express();
const port = 3002;

app.use(
  cors({
    origin: ['http://localhost:3000', 'https://seu-frontend-deployado.com'], // Adicione a URL do frontend aqui
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], // Métodos permitidos
    credentials: true, // Permitir cookies, se necessário
  })
);

app.use(express.json());

app.use('/login', routesLogin);
app.use('/usuarios', routesUsuario);
app.use('/despesas', routesDespesas);
app.use('/entradas', routesEntradas);
app.use('/cupom', routesCupom);


app.get('/', (req, res) => {
  res.send('API Ternos Avenida');
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
