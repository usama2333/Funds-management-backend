import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class MockUserMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    // Ensure req.user is set before accessing it
    req.user = { role: 'admin' }; // Or 'user', 'superadmin' depending on the test
    next();
  }
}