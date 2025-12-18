import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from './articles.entity';
import { CreateArticleDto } from './create-article.dto';
import { UpdateArticleDto } from './update-article.dto';
import Redis from 'ioredis';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
    @Inject("REDIS_CLIENT") private redis: Redis
  ) {}

  async create(createArticleDto: CreateArticleDto, user_id: number) {
    const article = this.articleRepository.create({
      ...createArticleDto,
      user_id: user_id
    });
    await this.redis.del('articles:');
    return this.articleRepository.save(article);
  }

  // find all articles
  async findAll(): Promise<Article[]> {
    const rkey = `articles:`
    const cashed = await this.redis.get(rkey)

    if (cashed)
    {
        return JSON.parse(cashed)
    }

    const articles = await this.articleRepository.find()

    await this.redis.setex(rkey, 120, JSON.stringify(articles))

    return articles;
  }

  // find one article
  async findOne(article_id: number): Promise<Article> {

    // redis
    const rkey = `article:${article_id}`
    const cashed = await this.redis.get(rkey)

    if (cashed) {
        return JSON.parse(cashed)
    }
    const article = await this.articleRepository.findOneBy({ article_id });

    if (!article) {
      throw new NotFoundException('not found article');
    }
    await this.redis.setex(rkey, 300, JSON.stringify(article))

    return article;
  }

  // update article
  async update(
    article_id: number,
    updateArticleDto: UpdateArticleDto,
  ): Promise<Article> {
    await this.articleRepository.update(article_id, updateArticleDto);

    // invalidation
    await this.redis.del(`articles:${article_id}`) 

    return this.findOne(article_id);
  }

  // delete article by id
  async remove(article_id: number) {
    const result = await this.articleRepository.delete(article_id)

    // invalidation
    await this.redis.del(`articles:`) 
    
    if (result.affected === 0) {
        throw new NotFoundException(`not found to delete article by article_id: ${article_id}`)
    }
  }
}
