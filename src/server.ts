import express from 'express';
import routes from './routes';

import './database';

const app = express();

app.use(express.json());
app.use(routes);

app.get('/', (request, response) => response.json({ message: 'Hello TCC' }));

app.listen(3333, () => {
  console.log('🚀 TCC Server started!');
});
