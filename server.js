// AgriVision System - Ultimate Backend with Advanced Enhancements 🚀
// 🏗 Deploy to Kubernetes / AWS / DigitalOcean
// 📊 Fine-tune AI models for better insights
// 💰 Monetize blockchain-based supply chain solutions
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { ApolloServer } from 'apollo-server-express';
import { createServer } from 'http';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws';
import cron from 'node-cron';
import redis from 'redis';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import { CircuitBreaker } from 'opossum';
import k8s from '@kubernetes/client-node'; // Kubernetes integration
import winston from 'winston';
import 'express-async-errors'; // Handle async errors globally

// Load environment variables
dotenv.config();

// Import GraphQL schema and resolvers
import typeDefs from './graphql/schema.js';
import resolvers from './graphql/resolvers.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import farmRoutes from './routes/farmRoutes.js';
import sensorRoutes from './routes/sensorRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import marketRoutes from './routes/marketRoutes.js'; // Added market access
import weatherRoutes from './routes/weatherRoutes.js'; // Added weather data support

// Import utilities and middleware
import logger from './utils/logger.js';
import emailService from './utils/emailService.js';
import roleMiddleware from './middleware/roleMiddleware.js';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './config/swagger.json';
import { AIModel } from './utils/aiModel.js';
import { Blockchain } from './utils/blockchain.js';
import weatherService from './utils/weatherService.js';
import { i18n } from './utils/i18n.js';

const app = express();
const httpServer = createServer(app);
const redisClient = redis.createClient({ legacyMode: true });

// Redis Client Error Handling
redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

redisClient.connect().then(() => {
  console.log('✅ Redis connected successfully');
});

// Logger setup with Winston
const loggerInstance = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('combined'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/v1/auth', authRoutes);

// Rate Limiting with Redis (Ensure Redis is connected first)
redisClient.on('connect', () => {
  const rateLimiter = new RateLimiterRedis({
    storeClient: redisClient,
    points: 100,
    duration: 900,
  });
  app.use((req, res, next) => {
    rateLimiter.consume(req.ip)
      .then(() => next())
      .catch(() => res.status(429).json({ message: 'Too many requests' }));
  });
});

// Load environment variables
const dbURI = process.env.NODE_ENV === 'production' 
  ? process.env.MONGO_URI_PROD 
  : process.env.MONGO_URI_LOCAL;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Avoid indefinite hangs
      socketTimeoutMS: 45000, // Handle socket timeouts
    });
    loggerInstance.info('✅ MongoDB connected successfully');
  } catch (err) {
    loggerInstance.error('❌ MongoDB connection error:', err);
    process.exit(1);
  }
};

mongoose.connection.on('connected', () => {
  loggerInstance.info('✅ Mongoose connected to database');
});

mongoose.connection.on('error', (err) => {
  loggerInstance.error('❌ Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  loggerInstance.warn('⚠️ Mongoose disconnected');
});

// 🏗 Kubernetes Deployment - Ready for Market-Scale Growth
const kc = new k8s.KubeConfig();
kc.loadFromDefault();
const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

// Graceful shutdown handling
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  wsServer.close();
  await redisClient.disconnect();
  loggerInstance.warn('⚠️ MongoDB, Redis, and WebSockets closed due to app termination');
  process.exit(0);
});

// WebSockets for Real-Time Updates
const schema = makeExecutableSchema({ typeDefs, resolvers });
const wsServer = new WebSocketServer({ server: httpServer, path: '/graphql' });
useServer({ schema }, wsServer);

wsServer.on('error', (error) => {
  loggerInstance.error('WebSocket error:', error);
});

// Apollo Server Setup
const server = new ApolloServer({
  schema,
  context: ({ req }) => {
    const token = req.headers.authorization || '';
    return { req, token };
  },
});
await server.start();
server.applyMiddleware({ app });
httpServer.listen(process.env.PORT || 5001, () => {
  loggerInstance.info(`🚀 Server ready at http://localhost:${process.env.PORT || 5001}${server.graphqlPath}`);
});

// REST API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/farms', farmRoutes);
app.use('/api/sensors', sensorRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/weather', weatherRoutes);

export default connectDB;
