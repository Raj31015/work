import {
    Count,
    CountSchema,
    Filter,
    repository,
    Where,
  } from '@loopback/repository';
  import {
    post,
    get,
    getModelSchemaRef,
    param,
    patch,
    del,
    requestBody,
    HttpErrors
  } from '@loopback/rest';
  import {MstUser} from '../../models';
  import {MstUserRepository} from '../../repositories';
  import {JWTService} from '../../services/jwt-service';
import {UserProfile, securityId} from '@loopback/security';
import {hash, compare} from 'bcryptjs';
import {authenticate} from '@loopback/authentication'; 
import {inject} from "@loopback/core";
@authenticate('jwt')
  export class MstUserDupController {
    constructor(
      @repository(MstUserRepository)
      public mstUserRepository: MstUserRepository,
    @inject('services.JWTService') private jwtService: JWTService,
    ) {}
  
  @post('/users/register')
  async register(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              email: {type: 'string'},
              password: {type: 'string'},
            },
          },
        },
      },
    })
    userData: {email: string; password: string},
  ): Promise<MstUser> {
    const existingUser = await this.mstUserRepository.findOne({where: {email: userData.email}});
    if (existingUser) throw new HttpErrors.Conflict('Email already registered');

    const hashedPassword = await hash(userData.password, 10);
    return this.mstUserRepository.create({...userData, password: hashedPassword});
  }

  @post('/users/login')
  async login(
    @requestBody() credentials: {email: string; password: string},
  ): Promise<{token: string}> {
    const user = await this.mstUserRepository.findOne({where: {email: credentials.email}});
    if (!user) throw new HttpErrors.NotFound('User not found');

    const passwordMatched = await compare(credentials.password, user.password);
    if (!passwordMatched) throw new HttpErrors.Unauthorized('Invalid credentials');

    const userProfile: UserProfile = {
      [securityId]: user.id.toString(),
      email: user.email,
      name: user.email,
    };

    const token = await this.jwtService.generateToken(userProfile);
    return {token};
  }
    @post('/users')
    async create(@requestBody() user: MstUser): Promise<MstUser> {
      return this.mstUserRepository.create(user);
    }
  
    @get('/users')
    async find(@param.filter(MstUser) filter?: Filter<MstUser>): Promise<MstUser[]> {
      return this.mstUserRepository.find(filter);
    }
  
    @get('/users/{id}')
    async findById(@param.path.number('id') id: number): Promise<MstUser | null> {
      return this.mstUserRepository.findById(id);
    }
  
    @patch('/users/{id}')
    async updateById(
      @param.path.number('id') id: number,
      @requestBody() user: Partial<MstUser>,
    ): Promise<void> {
      await this.mstUserRepository.updateById(id, user);
    }
  
    @del('/users/{id}')
    async deleteById(@param.path.number('id') id: number): Promise<void> {
      await this.mstUserRepository.deleteById(id);
    }
  }
  
