import { RecommendationsService } from './recommendations.service';
export declare class RecommendationsController {
    private readonly recommendationsService;
    constructor(recommendationsService: RecommendationsService);
    getHomeRecommendations(): Promise<{
        hotBooks: ({
            category: {
                id: number;
                name: string;
            } | null;
            _count: {
                borrowRecords: number;
            };
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            isbn: string | null;
            title: string;
            author: string;
            publisher: string | null;
            description: string | null;
            coverUrl: string | null;
            totalCount: number;
            availableCount: number;
            location: string | null;
            status: import("@prisma/client").$Enums.BookStatus;
            categoryId: number | null;
        })[];
        newArrivals: ({
            category: {
                id: number;
                name: string;
            } | null;
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            isbn: string | null;
            title: string;
            author: string;
            publisher: string | null;
            description: string | null;
            coverUrl: string | null;
            totalCount: number;
            availableCount: number;
            location: string | null;
            status: import("@prisma/client").$Enums.BookStatus;
            categoryId: number | null;
        })[];
        categoryShelves: {
            category: {
                id: number;
                name: string;
            };
            books: {
                id: number;
                title: string;
                author: string;
                coverUrl: string | null;
                availableCount: number;
            }[];
        }[];
    }>;
}
