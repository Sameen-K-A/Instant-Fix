// import { createClient } from 'redis';
// import dotenv from 'dotenv';

// dotenv.config();

// const redisConnection = () => {
//    const client = createClient({
//       url: `redis://${process.env.Redis_host}:${process.env.Redis_port}`
//    });

//    client.on('connect', () => {
//       console.log('Redis is connected');
//    });

//    client.on('error', (error) => {
//       console.error('Redis is not connected', error);
//    });

//    client.connect();
//    return client;
// };

// export default redisConnection;