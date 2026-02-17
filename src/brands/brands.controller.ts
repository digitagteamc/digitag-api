import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { BrandsService } from "./brands.service";
import { UserGuard } from "../auth/user.guard";

@Controller("brands")
export class BrandsController {
  constructor(private readonly brands: BrandsService) {}

  @UseGuards(UserGuard)
  @Get("me/status")
  myStatus(@Req() req: any) {
    return this.brands.myStatus(req.user);
  }

  @UseGuards(UserGuard)
  @Post("register")
  async registerBrand(@Body() body: {
    phoneNumber: string;
    brandName: string;
    pan: string;
    gstin?: string;
    city?: string;
    state?: string;
  }) {
    return this.brands.registerBrand(body);
  }
}
