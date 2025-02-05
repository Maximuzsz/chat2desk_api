import express from 'express';
import cors from 'cors';
import router from './src/routes/userRoutes';
import { swaggerDocs } from "./src/utils/swaggerConfig";

const app = express();
app.use("/api-docs", swaggerDocs.ui.serve, swaggerDocs.ui.setup(swaggerDocs.spec));
app.use(cors());
app.use(express.json());

app.use('/api', router);


export default app;