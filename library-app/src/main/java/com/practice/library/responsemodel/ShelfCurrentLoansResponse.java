package com.practice.library.responsemodel;

import com.practice.library.entity.Book;

public class ShelfCurrentLoansResponse {

    Book book;
    int dayLeft;

    public ShelfCurrentLoansResponse(){}
    public ShelfCurrentLoansResponse(Book book, int dayLeft){

        this.book = book;
        this.dayLeft = dayLeft;
    }


    public Book getBook() {
        return book;
    }

    public void setBook(Book book) {
        this.book = book;
    }

    public int getDayLeft() {
        return dayLeft;
    }

    public void setDayLeft(int dayLeft) {
        this.dayLeft = dayLeft;
    }
}
