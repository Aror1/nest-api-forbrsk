import { Test, TestingModule } from '@nestjs/testing';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './create-article.dto';

const mockArticle = { article_id: 1, title: 'Test', content: 'Content', user_id: 123 };
const mockArticles = [mockArticle];

const mockArticlesService = {
  create: jest.fn().mockResolvedValue(mockArticle),
  findAll: jest.fn().mockResolvedValue(mockArticles),
  findOne: jest.fn().mockResolvedValue(mockArticle),
  update: jest.fn().mockResolvedValue(mockArticle),
  remove: jest.fn().mockResolvedValue(undefined),
};

describe('articles', () => {
  let controller: ArticlesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArticlesController],
      providers: [
        {
          provide: ArticlesService,
          useValue: mockArticlesService,
        },
      ],
    }).compile();

    controller = module.get<ArticlesController>(ArticlesController);
  });

  it('create an article', async () => {
    const dto: CreateArticleDto = { article_title: 'new', article_desc: 'new desc', article_user_id: 123, date: new Date(Date.now())};
    const result = await controller.create(dto);
    expect(result).toEqual(mockArticle);
  });

  it('find all articles', async () => {
    const result = await controller.findAll();
    expect(result).toEqual(mockArticles);
  });

  it('find one article', async () => {
    const result = await controller.findOne(1);
    expect(result).toEqual(mockArticle);
  });

  it('delete an article', async () => {
    const result = await controller.remove(1);
    expect(result).toBeUndefined();
  });
});