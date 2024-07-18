import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcryptjs from 'bcryptjs';
import { User } from './entities/user.entity';
//para autentcar a los usuarios, ya que es una tarea comun
import { JwtService } from '@nestjs/jwt';

//la interface que contiene como tienen que venir los datos
import { JwtPayload, LoginResponse } from './interfaces';
import { RegisterDto, LoginDto, UpdateAuthDto, CreateUserDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async create(CreateUserDto: CreateUserDto): Promise<User> {
    //console.log(CreateUserDto);

    try {
      const { password, ...userData } = CreateUserDto;
      const newUser = new this.userModel({
        password: bcryptjs.hashSync(password, 10),
        ...userData,
      });

      await newUser.save();
      //renombramos la contraseña del usuario _ para no tener que mandarla en la base de datos
      const { password: _, ...user } = newUser.toJSON();
      return user;
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException(`${CreateUserDto.email} already exists!`);
      }
      throw new InternalServerErrorException('Something was happend!');
    }
  }

  async login(loginDto: LoginDto): Promise<LoginResponse> {
    //console.log({loginDto})
    /**
     * USER { _id , name , email, roles}
     * TOKEN ADASKDNSKA.KASNDAKSDNSA.SAMDKASMD
     *
     */
    // extraemos del loginDto lo que necesitamos
    const { email, password } = loginDto;
    //buscamos en la base de datos, si hay algun usuario que tenga la misma propiedad que estamos mandando
    const user = await this.userModel.findOne({ email: email });

    if (!user) {
      throw new UnauthorizedException('this email dnt exists');
    }

    //compara que la contraseña ingresada sea igual a la contraseña que está en la base de datos
    if (!bcryptjs.compareSync(password, user.password)) {
      throw new UnauthorizedException('this password is not correctly');
    }

    const { password: _,  } = user.toJSON();
    return {
      user,
      token: this.getJwt({id: user.id}),
    };
  }

  async register(registerUser: RegisterDto): Promise<LoginResponse>{


    const user = await this.create(registerUser);
    return{
      user,
      token: this.getJwt({id: user._id})
    }
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  //creamos el metodo que nos permite acceder al usuario
  getJwt(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }
}
