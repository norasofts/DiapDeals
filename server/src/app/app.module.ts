import ormConfig from '@app/ormconfig';
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppService } from '@app/app/app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthMiddleware } from '../security/middlewares/auth.middleware';
import { PointModule } from './point/point.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { AppController } from './app.controller';
import { ImageModule } from './image/image.module';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { OnlineDealsModule } from './online-deals/online-deals.module';
import { MerchantModule } from './merchant/merchant.module';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(ormConfig),
    ConfigModule.forRoot(),
    MailerModule.forRoot({
      transport: {
        host: process.env.SENDGRID_HOST,
        port: 465,
        secure: true,
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD,
        },
      },
      template: {
        dir: join(process.cwd(), 'src/mails'),
        adapter: new HandlebarsAdapter(),
      },
    }),
    UserModule,
    PointModule,
    ImageModule,
    OnlineDealsModule,
    MerchantModule,
    CategoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
