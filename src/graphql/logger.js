// logger.js — Logging GraphQL requests and AI interactions for AgriVision

const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, 'graphql.log');

// Log request and response
function logGraphQLRequest({ query, variables, user }) {
  const logEntry = `GraphQL Request:\nUser: ${user?.name || 'Guest'}\nQuery: ${query}\nVariables: ${JSON.stringify(variables)}\nTime: ${new Date().toISOString()}\n`;
  fs.appendFileSync(logFile, logEntry + '\n');
}

function logGraphQLResponse({ data, errors }) {
  const logEntry = `GraphQL Response:\nData: ${JSON.stringify(data)}\nErrors: ${JSON.stringify(errors)}\nTime: ${new Date().toISOString()}\n`;
  fs.appendFileSync(logFile, logEntry + '\n');
}

function logAIModelInteraction({ model, input, output }) {
  const logEntry = `AI Model Interaction:\nModel: ${model}\nInput: ${JSON.stringify(input)}\nOutput: ${JSON.stringify(output)}\nTime: ${new Date().toISOString()}\n`;
  fs.appendFileSync(logFile, logEntry + '\n');
}

module.exports = { logGraphQLRequest, logGraphQLResponse, logAIModelInteraction };
