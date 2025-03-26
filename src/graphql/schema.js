// graphql/schema.js - GraphQL Schema for AgriVision
import { gql } from 'apollo-server-express';

const typeDefs = gql`
type Query {
  hello: String
}
  type User {
    id: ID!
    name: String!
    email: String!
    phoneNumber: String
    role: String!
    isActive: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  type Farm {
    id: ID!
    name: String!
    location: String!
    size: Float
    cropType: String
    owner: User!
    createdAt: String!
    updatedAt: String!
  }

  type Sensor {
    id: ID!
    type: String!
    value: Float!
    unit: String!
    farm: Farm!
    status: String!
    createdAt: String!
    updatedAt: String!
  }

  type Market {
    id: ID!
    product: String!
    price: Float!
    category: String
    availability: Boolean!
    location: String!
    createdAt: String!
    updatedAt: String!
  }

  type AIInsight {
    id: ID!
    analysisType: String!
    prediction: String!
    confidence: Float!
    recommendations: [String]
    createdAt: String!
  }

  type Weather {
    id: ID!
    temperature: Float!
    humidity: Float!
    windSpeed: Float!
    precipitation: Float
    forecast: String
    airQuality: String
    location: String!
    recordedAt: String!
  }

  type MarketAccess {
    id: ID!
    product: String!
    demand: Int!
    supply: Int!
    region: String!
    priceTrends: [Float]
    transactionHistory: [String]
    insights: [String]
    createdAt: String!
    updatedAt: String!
  }

  type Subscription {
    sensorDataUpdated(farmId: ID!): Sensor
    marketPriceUpdated(product: String!): Market
    weatherAlert(region: String!): Weather
  }

  type Query {
    getUsers: [User!]
    getUser(id: ID!): User
    getFarms: [Farm!]
    getFarm(id: ID!): Farm
    sensors: [Sensor]
    markets: [Market]
    aiInsights: [AIInsight]
    weatherData(location: String!): [Weather]
    marketAccess(region: String!): [MarketAccess]
  }

  type Mutation {
    addUser(name: String!, email: String!, phoneNumber: String, role: String!): User
    updateUser(id: ID!, name: String, email: String, phoneNumber: String, role: String, isActive: Boolean): User
    deleteUser(id: ID!): String
    
    addFarm(name: String!, location: String!, size: Float, cropType: String, ownerId: ID!): Farm
    updateFarm(id: ID!, name: String, location: String, size: Float, cropType: String): Farm
    deleteFarm(id: ID!): String

    addSensor(type: String!, value: Float!, unit: String!, status: String!, farmId: ID!): Sensor
    updateSensor(id: ID!, type: String, value: Float, unit: String, status: String): Sensor
    deleteSensor(id: ID!): String

    addMarket(product: String!, price: Float!, category: String, availability: Boolean!, location: String!): Market
    updateMarket(id: ID!, product: String, price: Float, category: String, availability: Boolean): Market
    deleteMarket(id: ID!): String

    analyzeData(analysisType: String!): AIInsight
    
    addWeatherData(temperature: Float!, humidity: Float!, windSpeed: Float!, precipitation: Float, forecast: String, airQuality: String, location: String!): Weather
    
    addMarketAccess(product: String!, demand: Int!, supply: Int!, region: String!, priceTrends: [Float], transactionHistory: [String], insights: [String]): MarketAccess
  }
`;

export default typeDefs;
