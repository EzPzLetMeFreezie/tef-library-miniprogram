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
var WechatService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WechatService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let WechatService = WechatService_1 = class WechatService {
    config;
    logger = new common_1.Logger(WechatService_1.name);
    constructor(config) {
        this.config = config;
    }
    async code2Session(code) {
        const mockMode = this.config.get('MOCK_WECHAT') === 'true';
        if (mockMode) {
            this.logger.warn('WeChat mock mode enabled - using fixed openid');
            return 'mock_admin_openid';
        }
        const appid = this.config.get('WECHAT_APPID');
        const secret = this.config.get('WECHAT_SECRET');
        const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${code}&grant_type=authorization_code`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            if (data.openid) {
                return data.openid;
            }
            this.logger.error('WeChat code2Session failed', data);
            return null;
        }
        catch (error) {
            this.logger.error('WeChat code2Session error', error);
            return null;
        }
    }
};
exports.WechatService = WechatService;
exports.WechatService = WechatService = WechatService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], WechatService);
//# sourceMappingURL=wechat.service.js.map