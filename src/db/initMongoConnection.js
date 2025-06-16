import mongoose from 'mongoose';

export const initMongoConnection = async () => {
  try {
    const mongoUri = process.env.MONGODB_URL;

    console.log('MONGODB_URL from env:', mongoUri);

    if (!mongoUri) {
      throw new Error('MONGODB_URL is not defined in environment variables');
    }

    await mongoose.connect(mongoUri, {
      appName: 'homeWork',
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Mongo connection successfully established!');
  } catch (e) {
    console.error('Error while setting up mongo connection', e);
    throw e;
  }
};
