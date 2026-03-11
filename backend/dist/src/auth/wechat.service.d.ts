import { ConfigService } from '@nestjs/config';
export declare class WechatService {
    private readonly config;
    private readonly logger;
    constructor(config: ConfigService);
    code2Session(code: string): Promise<string | null>;
}
