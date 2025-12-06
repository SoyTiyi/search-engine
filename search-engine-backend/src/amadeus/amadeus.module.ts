import { Module } from '@nestjs/common';
import { AmadeusService } from './amadeus.service';
import { AuthService } from 'src/auth/auth.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [AmadeusService, AuthService]
})
export class AmadeusModule {}
