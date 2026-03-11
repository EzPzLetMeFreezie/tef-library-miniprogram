import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { BooksModule } from './books/books.module';
import { BorrowRecordsModule } from './borrow-records/borrow-records.module';
import { RecommendationsModule } from './recommendations/recommendations.module';
import { ImportExportModule } from './import-export/import-export.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    CategoriesModule,
    BooksModule,
    BorrowRecordsModule,
    RecommendationsModule,
    ImportExportModule,
  ],
})
export class AppModule {}
