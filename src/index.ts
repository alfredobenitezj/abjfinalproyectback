import http from 'http';
import { app } from './app.js';
import createDebug from 'debug';
import { dbConnect } from './db/db.connect.js';
const debug = createDebug('Pfinal AlfredoB');
const PORT = process.env.PORT || 4400;
const server = http.createServer(app);
dbConnect()
  .then((mongoose) => {
    server.listen(PORT);
    debug(
      'Conectado a la base de datos :',
      mongoose.connection.db.databaseName
    );
  })
  .catch((error) => {
    server.emit('error', error);
  });
server.on('modo on', () => {
  debug('Esta siendo escuchado por' + PORT);
});
server.on('error', (error) => {
  console.log(error.message);
});
