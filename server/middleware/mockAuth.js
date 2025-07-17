// Simple mock authentication middleware for development
export default function mockAuth(req, res, next) {
  req.user = { id: 'mock-user', role: 'admin' };
  next();
}
