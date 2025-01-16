import express from 'express'
import cors from 'cors'
import routesLogin from "./routes/login"
import routesUsuario from "./routes/usuarios"
import routesDespesas from "./routes/despesas"


const app = express()
const port = 3002

// Permitir requisições de qualquer origem
app.use(cors({ origin: 'http://localhost:3000' }))

app.use(express.json())

app.use("/login", routesLogin)
app.use("/usuarios", routesUsuario)
app.use("/despesas", routesDespesas)

app.get("/", (req, res) => {
    res.send("API Ternos Avenida")
})

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`)
})
