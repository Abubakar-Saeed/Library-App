package com.practice.library.dao;

import com.practice.library.entity.Checkout;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface CheckoutRepository extends JpaRepository<Checkout,Long> {



    Checkout  findByUserEmailAndBookId(String userEmail,Long bookId);
    List<Checkout> findBookByUserEmail(String userEmail);
    @Modifying
    @Transactional
    @Query("delete from Checkout where bookId = :book_id")
    void deleteAllByBookId(@Param("book_id") Long bookId);
}
