import { Controller, Get, Req, HttpStatus,UseGuards, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from "express";

@Controller('auth')
export class AuthController {
  
    @Get("/facebook")
  @UseGuards(AuthGuard("facebook"))
  async facebookLogin(): Promise<any> {
    console.log('Initiating Facebook OAuth flow...');
    return HttpStatus.OK;

  }

  @Get("/facebook/redirect")
  @UseGuards(AuthGuard("facebook"))
  async facebookLoginRedirect(@Req() req: Request ,  @Res() res: Response): Promise<any> {
    const user = req.user;
    console.log('Facebook OAuth callback received:', user);
    return {
      statusCode: HttpStatus.OK,
      data: req.user,
    };
  }
}
