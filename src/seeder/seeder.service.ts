// // src/seeder/seeder.service.ts
// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { User } from 'src/user/entities/user.entity';
// import { UserRole } from 'src/common/enums/roles.enum';
// import * as bcrypt from 'bcrypt';

// @Injectable()
// export class SeederService {
//   constructor(
//     @InjectRepository(User)
//     private readonly userRepository: Repository<User>, // Inject User repository
//   ) {}

//   async seedSuperAdmin() {
//     const existingSuperAdmin = await this.userRepository.findOne({
//       where: { role: UserRole.SuperAdmin },
//     });
//     if (!existingSuperAdmin) {
//       const hashedPassword = await bcrypt.hash('superadmin123', 10);
//       const superAdmin = this.userRepository.create({
//         email: 'usama.wizz@gmail.com',
//         password: hashedPassword,
//         name: 'Usama Ahmed',
//         role: UserRole.SuperAdmin,
//       });
//       await this.userRepository.save(superAdmin);
//       console.log('Super Admin created!');
//     } else {
//       console.log('Super Admin already exists.');
//     }
//   }
// }
