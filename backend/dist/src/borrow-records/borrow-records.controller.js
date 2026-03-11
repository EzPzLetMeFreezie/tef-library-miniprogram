"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BorrowRecordsController = void 0;
const common_1 = require("@nestjs/common");
const borrow_records_service_1 = require("./borrow-records.service");
const borrow_book_dto_1 = require("./dto/borrow-book.dto");
const return_book_dto_1 = require("./dto/return-book.dto");
const query_borrow_records_dto_1 = require("./dto/query-borrow-records.dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
let BorrowRecordsController = class BorrowRecordsController {
    borrowRecordsService;
    constructor(borrowRecordsService) {
        this.borrowRecordsService = borrowRecordsService;
    }
    async findAll(query) {
        return this.borrowRecordsService.findAll(query);
    }
    async findMy(user, page = '1', pageSize = '10', status) {
        return this.borrowRecordsService.findByUser(user.id, {
            page: Number(page),
            pageSize: Number(pageSize),
            status,
        });
    }
    async borrow(user, dto) {
        return this.borrowRecordsService.borrowBook({
            ...dto,
            userId: dto.userId || user.id,
        });
    }
    async returnBook(dto) {
        return this.borrowRecordsService.returnBook(dto.recordId);
    }
};
exports.BorrowRecordsController = BorrowRecordsController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_borrow_records_dto_1.QueryBorrowRecordsDto]),
    __metadata("design:returntype", Promise)
], BorrowRecordsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('my'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('pageSize')),
    __param(3, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, String]),
    __metadata("design:returntype", Promise)
], BorrowRecordsController.prototype, "findMy", null);
__decorate([
    (0, common_1.Post)('borrow'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, borrow_book_dto_1.BorrowBookDto]),
    __metadata("design:returntype", Promise)
], BorrowRecordsController.prototype, "borrow", null);
__decorate([
    (0, common_1.Post)('return'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [return_book_dto_1.ReturnBookDto]),
    __metadata("design:returntype", Promise)
], BorrowRecordsController.prototype, "returnBook", null);
exports.BorrowRecordsController = BorrowRecordsController = __decorate([
    (0, common_1.Controller)('borrow-records'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [borrow_records_service_1.BorrowRecordsService])
], BorrowRecordsController);
//# sourceMappingURL=borrow-records.controller.js.map