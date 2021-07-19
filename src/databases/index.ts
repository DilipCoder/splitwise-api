import config from 'config';
import { dbConfig } from '@interfaces/db.interface';

const env: string = config.get('env');
const { host, port, database, password }: dbConfig = config.get('dbConfig');

// db setup as local and hosted as per node environment (.env)
const url =
  env === 'test'
    ? `mongodb+srv://tempUser:${password}@cluster0.groyx.mongodb.net/${database}?retryWrites=true&w=majority`
    : `mongodb://${host}:${port}/${database}`;

export const dbConnection = {
  url,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  },
};
