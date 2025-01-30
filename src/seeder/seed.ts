// // src/seeder/seed.ts
// import { NestFactory } from '@nestjs/core';
// // import { AppModule } from '../app.module';
// // import { SeederService } from './seeder.service';
// import { AppModule } from 'src/app.module';
// import { SeederService } from './seeder.service';

// async function bootstrap() {
//   try {
//     // Create the NestJS application
//     const app = await NestFactory.create(AppModule);

//     // Get the SeederService
//     const seederService = app.get(SeederService);

//     // Execute the seeding logic
//     await seederService.seedSuperAdmin();

//     // Close the application after seeding
//     await app.close();

//     console.log('Seeding completed!');
//   } catch (error) {
//     console.error('Error during seeding:', error);
//     process.exit(1); // Exit with error code
//   }
// }

// // Run the script
// bootstrap();
