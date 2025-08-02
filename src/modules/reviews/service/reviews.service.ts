import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { Review } from '../entity/review.entity';
import { ItemsService } from 'src/modules/items/service/items.service';
import { RoutinesService } from 'src/modules/routines/service/routines.service';
import { ReviewType } from '../enum/review-type.enum';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    private readonly itemsService: ItemsService,
    private readonly routinesService: RoutinesService,
  ) {}

  // 리뷰 등록
  async createReview(
    user_key: number,
    key: number,
    review_type: ReviewType,
    review_content: string,
    rating: number,
  ): Promise<Review> {
    const newReview = this.reviewRepository.create({
      user_key,
      item_key: review_type === 'I' ? key : undefined,
      routine_key: review_type === 'R' ? key : undefined,
      review_type,
      review_content,
      rating,
      review_at: new Date(),
    });
    if (!newReview) {
      throw new InternalServerErrorException('리뷰를 등록할 수 없습니다.');
    }
    const averageRating = await this.calculateAverageRating(key, review_type);
    if (review_type === 'R') {
      await this.routinesService.updateRoutineRating(key, averageRating);
    } else if (review_type === 'I') {
      await this.itemsService.updateItemRating(key, averageRating);
    }

    return await this.reviewRepository.save(newReview);
  }
  // 루틴 별 리뷰 조회
  async getReviewByRoutine(
    routine_key: number,
    lastPolled?: Date,
  ): Promise<Review[]> {
    const whereClause: any = { routine_key };
    if (lastPolled) {
      whereClause.review_at = MoreThan(lastPolled);
    }

    const reviews = await this.reviewRepository.find({
      where: whereClause,
      order: { review_at: 'DESC' },
    });
    if (!reviews) {
      return [];
    }
    return reviews;
  }
  // 상품 별 리뷰 조회
  async getReviewByItem(
    item_key: number,
    lastPolled?: Date,
  ): Promise<Review[]> {
    const whereClause: any = { item_key };
    if (lastPolled) {
      whereClause.review_at = MoreThan(lastPolled);
    }
    const reviews = await this.reviewRepository.find({
      where: whereClause,
      order: { review_at: 'DESC' },
    });
    if (!reviews) {
      return [];
    }
    return reviews;
  }

  async deleteReview(review_key: number): Promise<void> {
    const review = await this.reviewRepository.findOneBy({ review_key });
    if (!review) {
      throw new Error('해당 리뷰를 찾을 수 없습니다.');
    }
    await this.reviewRepository.delete(review_key);
  }

  async calculateAverageRating(
    key: number,
    review_type: 'I' | 'R',
  ): Promise<number> {
    if (review_type === 'R') {
      const result = await this.reviewRepository
        .createQueryBuilder('review')
        .select('AVG(review.rating)', 'average')
        .where('review.routine_key = :routine_key', { routine_key: key })
        .getRawOne();

      return parseFloat(result.average) || 0;
    } else if (review_type === 'I') {
      const result = await this.reviewRepository
        .createQueryBuilder('review')
        .select('AVG(review.rating)', 'average')
        .where('review.item_key = :item_key', { item_key: key })
        .getRawOne();

      return parseFloat(result.average) || 0;
    }
    return 0;
  }
}
