/**
 * Legacy Glossary Terms File
 * This file now imports from the modular glossary structure
 * for backward compatibility
 */

// Re-export everything from the new modular structure
export * from './glossary';

// For backward compatibility, also export the main array
export { glossaryTerms } from './glossary';