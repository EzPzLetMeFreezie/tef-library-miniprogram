import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
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
