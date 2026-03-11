import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
export declare class CategoriesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<({
        _count: {
            books: number;
        };
    } & {
        id: number;
        name: string;
        sortOrder: number;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    create(dto: CreateCategoryDto): Promise<{
        id: number;
        name: string;
        sortOrder: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: number, dto: UpdateCategoryDto): Promise<{
        id: number;
        name: string;
        sortOrder: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: number): Promise<{
        id: number;
        name: string;
        sortOrder: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
