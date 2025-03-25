import { repository } from '@loopback/repository';
import { DepositBook } from '../../models';
import { DepositBookRepository } from '../../repositories';
import { post, get, patch, put, del, param, requestBody } from '@loopback/rest';

export class DepositBookBasicController {
  constructor(
    @repository(DepositBookRepository)
    public depositBookRepo: DepositBookRepository,
  ) {}

  @post('/deposit-books')
  async createDepositBook(@requestBody() depositBook: Omit<DepositBook, 'depositBookId'>) {
    return this.depositBookRepo.create(depositBook);
  }

  @get('/deposit-books')
  async getAllDepositBooks() {
    return this.depositBookRepo.find();
  }

  @get('/deposit-books/{id}')
  async getDepositBookById(@param.path.number('id') id: number) {
    return this.depositBookRepo.findById(id);
  }

  @patch('/deposit-books/{id}')
  async updateDepositBookById(
    @param.path.number('id') id: number,
    @requestBody() depositBook: Partial<DepositBook>,
  ) {
    await this.depositBookRepo.updateById(id, depositBook);
  }

  @put('/deposit-books/{id}')
  async replaceDepositBookById(
    @param.path.number('id') id: number,
    @requestBody() depositBook: DepositBook,
  ) {
    await this.depositBookRepo.replaceById(id, depositBook);
  }

  @del('/deposit-books/{id}')
  async deleteDepositBookById(@param.path.number('id') id: number) {
    await this.depositBookRepo.deleteById(id);
  }
}
