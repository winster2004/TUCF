import { Test, TestingModule } from '@nestjs/testing';
import { AtsController } from './ats.controller';
import { AtsService } from './ats.service';

describe('AtsController', () => {
  let controller: AtsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AtsController],
      providers: [{ provide: AtsService, useValue: { analyze: jest.fn() } }],
    }).compile();

    controller = module.get<AtsController>(AtsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
