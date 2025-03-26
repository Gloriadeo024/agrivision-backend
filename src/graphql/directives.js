// directives.js — Custom GraphQL directives for AgriVision

const { SchemaDirectiveVisitor } = require('graphql-tools');
const { defaultFieldResolver } = require('graphql');

class AuthDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;
    field.resolve = async function (...args) {
      const [, , context] = args;
      if (!context.user) {
        throw new Error('You must be logged in to access this resource.');
      }
      return resolve.apply(this, args);
    };
  }
}

class AIEnhancedDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;
    field.resolve = async function (...args) {
      const result = await resolve.apply(this, args);
      // AI model interaction hook (for future AI processing)
      console.log('AI-enhanced field access:', field.name);
      return result; // Placeholder — customize with AI logic
    };
  }
}

module.exports = { AuthDirective, AIEnhancedDirective };
