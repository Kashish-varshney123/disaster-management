// Mock authentication middleware
const users = {
  netrunnerX: { id: 'netrunnerX', role: 'admin' },
  reliefAdmin: { id: 'reliefAdmin', role: 'contributor' }
};

export function mockAuth(req, res, next) {
  // For demo, always use netrunnerX
  req.user = users.netrunnerX;
  next();
}
