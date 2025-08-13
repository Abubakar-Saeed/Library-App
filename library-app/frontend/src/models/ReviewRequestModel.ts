class ReviewRequestModel {
  rating: number;
  bookId: number;
  reviewDescription: string;

  constructor(rating: number, bookId: number, reviewDescrition: string) {
    this.rating = rating;
    this.bookId = bookId;
    this.reviewDescription = reviewDescrition;
  }
}
export default ReviewRequestModel;
