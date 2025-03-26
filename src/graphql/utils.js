// utils.js — Shared GraphQL utilities

const { GraphQLScalarType, Kind } = require('graphql');

// Custom Date scalar resolver
const DateScalar = new GraphQLScalarType({
  name: 'Date',
  description: 'Custom scalar type for Date objects',
  serialize(value) {
    return value instanceof Date ? value.toISOString() : null; // Convert outgoing Date to ISO string
  },
  parseValue(value) {
    return new Date(value); // Convert incoming ISO string to Date
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value); // Convert AST string to Date
    }
    return null;
  }
});

// Error handling utility
function formatError(error) {
  console.error('GraphQL Error:', error);
  return {
    message: error.message || 'An unknown error occurred',
    code: error.extensions?.code || 'INTERNAL_SERVER_ERROR',
    path: error.path || [],
  };
}

// Pagination formatter
function formatPagination(data, page, limit) {
  return {
    data,
    pagination: {
      currentPage: page,
      pageSize: limit,
      totalRecords: data.length,
    }
  };
}

// Authentication helper
function authenticate(user) {
  if (!user) {
    throw new Error('Authentication required');
  }
  console.log(`User authenticated: ${user.name} (Role: ${user.role})`);
  return user;
}

// Custom validator
function validateInput(schema, input) {
  const { error } = schema.validate(input);
  if (error) {
    throw new Error(`Invalid input: ${error.message}`);
  }
  return true;
}

module.exports = { DateScalar, formatError, formatPagination, authenticate, validateInput };
