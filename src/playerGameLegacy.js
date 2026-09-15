// Temporary migration seam for the pre-access player route implementation.
// New access authority lives in playerGame.js; this file should shrink as old
// route internals are retired rather than gaining new top-level gates.
export * from './playerGame.js';
