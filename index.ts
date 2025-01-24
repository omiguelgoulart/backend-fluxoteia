import express from 'express';
import cors from 'cors';
import routesLogin from './routes/login';
import routesUsuario from './routes/usuarios';
import routesDespesas from './routes/despesas';
import routesEntradas from './routes/entradas';
import routesCupom from './routes/cupom';
import { Request, Response, NextFunction } from 'express';


const app = express();
const port = 3002;

app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'https://seu-frontend-deployado.com',
      'https://fluxoteia.vercel.app',
      'http://fluxoteia-miguels-projects-c40d335f.vercel.app',
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], // Métodos permitidos
    credentials: true, // Permitir cookies, se necessário
    allowedHeaders: "Content-Type,Authorization",
  })
);

interface Error {
  stack?: string;
}

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Ocorreu um erro no servidor.' });
});

app.use(express.json());

app.use('/login', routesLogin);
app.use('/usuarios', routesUsuario);
app.use('/despesas', routesDespesas);
app.use('/entradas', routesEntradas);
app.use('/cupom', routesCupom);


app.get('/', (req, res) => {
  res.send('API em execução');
});

app.listen(port, () => {
  console.log(
    `Servidor rodando em ${
      process.env.NODE_ENV === 'production' ? 'produção' : `http://localhost:${port}`
    }`
  );
});

