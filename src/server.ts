import express from 'express';
import cors from 'cors';
import { ejs } from 'consolidate';
import path from 'path';

import routes from './routes';
import uploadConfig from './config/upload';

import './database';

const app = express();

app.use(cors());
app.use(express.json());

// For render views
app.engine('ejs', ejs);
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

app.use('/files', express.static(uploadConfig.directory));

app.use(routes);

app.get('/', (request, response) => response.json({ message: 'Hello TCC' }));

app.listen(3333, () => {
  console.log('🚀 TCC Server started!');
});
