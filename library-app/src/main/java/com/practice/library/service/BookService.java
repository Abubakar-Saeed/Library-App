package com.practice.library.service;


import com.practice.library.dao.BookRepository;
import com.practice.library.dao.CheckoutRepository;
import com.practice.library.dao.HistoryRepository;
import com.practice.library.entity.Book;
import com.practice.library.entity.Checkout;
import com.practice.library.entity.History;
import com.practice.library.responsemodel.ShelfCurrentLoansResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.*;
import java.util.concurrent.TimeUnit;

@Service
@Transactional

public class BookService {

    private final BookRepository bookRepository;
    private final CheckoutRepository checkoutRepository;
    private final HistoryRepository historyRepository;

    public BookService(BookRepository bookRepository, CheckoutRepository checkoutRepository,HistoryRepository historyRepository) {
        this.bookRepository = bookRepository;
        this.checkoutRepository = checkoutRepository;
        this.historyRepository = historyRepository;

    }

    public Book checkoutBook(String userEmail, Long bookId) throws Exception {


        Optional<Book> book = bookRepository.findById(bookId);
        Checkout validateCheckout = checkoutRepository.findByUserEmailAndBookId(userEmail, bookId);

        if (book.isEmpty()) {
            // Book not found
            throw new Exception("Book not found.");
        }

        if (validateCheckout != null) {
            // Already checked out
            throw new Exception("Book already checked out by user.");
        }

        if (book.get().getCopiesAvailable() <= 0) {
            // No copies left
            throw new Exception("No copies of the book are currently available.");
        }

        book.get().setCopiesAvailable(book.get().getCopiesAvailable() - 1);
        bookRepository.save(book.get());

        Checkout checkout = new Checkout(userEmail, LocalDate.now().toString(),
                LocalDate.now().plusDays(7).toString(),
                book.get().getId());


        checkoutRepository.save(checkout);


        return book.get();

    }


    public boolean checkoutBookByUser(String userEmail, Long bookId) {


        Checkout checkout = checkoutRepository.findByUserEmailAndBookId(userEmail, bookId);

        if (checkout != null) {

            return true;
        } else {

            return false;
        }
    }

    public int currentLoansCount(String userEmail) {

        return checkoutRepository.findBookByUserEmail(userEmail).size();
    }


    public List<ShelfCurrentLoansResponse> currentLoans(String userEmail) throws Exception {

        List<ShelfCurrentLoansResponse> shelfCurrentLoansResponses = new ArrayList<>();

        List<Checkout> checkouts = checkoutRepository.findBookByUserEmail(userEmail);

        List<Long> bookIdList = new ArrayList<>();


        for (Checkout i : checkouts) {

            bookIdList.add(i.getBookId());
        }


        List<Book> bookList = bookRepository.findBookByBookIds(bookIdList);

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

        for (Book book : bookList) {

            Optional<Checkout> checkout = checkouts.stream()
                    .filter((x -> Objects.equals(x.getBookId(), book.getId()))).findFirst();

            if (checkout.isPresent()) {

                Date d1 = sdf.parse(checkout.get().getReturnDate());
                Date d2 = sdf.parse(LocalDate.now().toString());

                TimeUnit time = TimeUnit.DAYS;

                long differece_In_Time = time.convert(d1.getTime() - d2.getTime(), TimeUnit.MILLISECONDS);

                shelfCurrentLoansResponses.add(new ShelfCurrentLoansResponse(book, (int) differece_In_Time));
            }
        }

        return shelfCurrentLoansResponses;


    }


    public void returnBook(String userEmail, Long bookId) throws Exception {


        Optional<Book> book = bookRepository.findById(bookId);

        Checkout validateCheckout = checkoutRepository.findByUserEmailAndBookId(userEmail, bookId);

        if (book.isEmpty() || validateCheckout == null) {

            throw new Exception("There is no book in checkout");

        }
        book.get().setCopiesAvailable(book.get().getCopiesAvailable() + 1);
        bookRepository.save(book.get());
        checkoutRepository.delete(validateCheckout);
        History history = new History(userEmail,
                validateCheckout.getCheckoutDate(),
                LocalDate.now().toString(),
                book.get().getTitle(),
                book.get().getAuthor(),
                book.get().getDescription(),
                book.get().getImg()
                );

        historyRepository.save(
                history
        );

    }

    public void renewLoan(String userEmail, Long bookId) throws Exception {

        Checkout validateCheckout = checkoutRepository.findByUserEmailAndBookId(userEmail, bookId);

        if (validateCheckout == null) {
            throw new Exception("Book does not exist or not checkedout");

        }
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");

        Date d1 = simpleDateFormat.parse(validateCheckout.getReturnDate());
        Date d2 = simpleDateFormat.parse(LocalDate.now().toString());

        if (d1.compareTo(d2) > 0 || d1.compareTo(d2) == 0) {

            validateCheckout.setReturnDate(LocalDate.now().plusDays(7).toString());
            checkoutRepository.save(validateCheckout);
        }


    }
}
