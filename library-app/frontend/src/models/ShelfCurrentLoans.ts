import BookModel from "./bookModel";

class ShelfCurrentLoans {
  book: BookModel;
  dayLeft: number;

  constructor(book: BookModel, daysLeft: number) {
    this.book = book;
    this.dayLeft = daysLeft;
  }
}
export default ShelfCurrentLoans;
