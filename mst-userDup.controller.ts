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
  } from '@loopback/rest';
  import {MstUser} from '../../models';
  import {MstUserRepository} from '../../repositories';
  
  export class MstUserDupController {
    constructor(
      @repository(MstUserRepository)
      public mstUserRepository: MstUserRepository,
    ) {}
  
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
  
