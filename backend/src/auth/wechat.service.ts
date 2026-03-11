import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WechatService {
  private readonly logger = new Logger(WechatService.name);

  constructor(private readonly config: ConfigService) {}

  async code2Session(code: string): Promise<string | null> {
    const mockMode = this.config.get<string>('MOCK_WECHAT') === 'true';

    if (mockMode) {
      this.logger.warn('WeChat mock mode enabled - using fixed openid');
      return 'mock_admin_openid';
    }

    const appid = this.config.get<string>('WECHAT_APPID');
    const secret = this.config.get<string>('WECHAT_SECRET');
    const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${code}&grant_type=authorization_code`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.openid) {
        return data.openid;
      }
      this.logger.error('WeChat code2Session failed', data);
      return null;
    } catch (error) {
      this.logger.error('WeChat code2Session error', error);
      return null;
    }
  }
}
