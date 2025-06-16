import mongoose from 'mongoose';
import { getEnvVar } from '../utils/getEnvVar.js';

export const initMongoConnection = async () => {
  try {
    const mongoUri = getEnvVar('MONGO_URI');
    console.log('MONGODB_URL from env:', mongoUri);

    await mongoose.connect(mongoUri, {
      appName: 'homeWork',
    });

    console.log('Mongo connection successfully established!');
  } catch (e) {
    console.log('Error while setting up mongo connection', e);
    throw e;
  }
};
