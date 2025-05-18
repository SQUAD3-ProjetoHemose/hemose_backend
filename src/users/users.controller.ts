import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
// Import Guards and Decorators later for authorization
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
// import { RolesGuard } from '../auth/guards/roles.guard';
// import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from './enums/user-role.enum';

@Controller('users')
// @UseGuards(JwtAuthGuard, RolesGuard) // Apply guards globally or per route later
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @Roles(UserRole.ADMIN) // Only admin can create users
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // @Roles(UserRole.ADMIN) // Only admin can view all users
  @Get()
  findAll(@Query('role') role?: UserRole) {
    if (role) {
      return this.usersService.findAllByRole(role);
    }
    return this.usersService.findAll();
  }

  // @Roles(UserRole.ADMIN) // Only admin can view a specific user by ID
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  // @Roles(UserRole.ADMIN) // Only admin can update users
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  // @Roles(UserRole.ADMIN) // Only admin can delete users
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
