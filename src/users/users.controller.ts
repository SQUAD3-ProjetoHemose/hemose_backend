import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Audit } from '../common/decorators/audit.decorator';
import { UserRole } from './enums/user-role.enum';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @Audit({ action: 'CREATE', resource: 'User', includeBody: true, excludeFields: ['password'] })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Roles(UserRole.ADMIN,UserRole.RECEPCIONISTA)
  @Audit({ action: 'LIST', resource: 'User' })
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
