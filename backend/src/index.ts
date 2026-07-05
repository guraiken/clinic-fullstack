import { auth } from './middleware/auth';
import express from 'express';
import cors from "cors"
import { authRouter } from './routes/auth';
import { userRouter } from './routes/usuarios';
import { examesRouter } from './routes/exames';
import { patientRouter } from './routes/pacientes';
import { prontuaryRouter } from './routes/prontuarios';
import { consultRouter } from './routes/consultas';
import { env } from './env';

const app = express();
app.use(express.json())

app.use(cors())

// Garante resposta correta a requests OPTIONS (preflight)

app.use(authRouter)
app.use(auth)

app.use(userRouter)
app.use(examesRouter)
app.use(patientRouter)
app.use(prontuaryRouter)
app.use(consultRouter)

app.listen(env.port, () => {
  console.log("Servidor ta de pé :p " + env.port)
})

// Anotação Controller controla tudo que tem a ver com req e res
// Services cuida de toda a lógica necessária
// Repositórios cuidam de tudo relacionado ao banco de dados