package com.ellen.finsphere.service;

import com.ellen.finsphere.model.Transaction;
import com.ellen.finsphere.model.TransactionType;
import com.ellen.finsphere.repository.TransactionRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;

    public TransactionService(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    public Transaction create(Transaction transaction) {

        if (transaction.getAmount() == null
                || transaction.getAmount().compareTo(BigDecimal.ZERO) <= 0) {

            throw new IllegalArgumentException(
                    "O valor da transação deve ser maior que zero."
            );
        }

        if (transaction.getType() == null) {
            throw new IllegalArgumentException(
                    "O tipo da transação é obrigatório."
            );
        }

        return transactionRepository.save(transaction);
    }

    public List<Transaction> findByUser(Long userId) {
        return transactionRepository.findByUserId(userId);
    }

    public BigDecimal calculateIncome(Long userId) {

        return findByUser(userId)
                .stream()
                .filter(transaction ->
                        transaction.getType() == TransactionType.INCOME)
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public BigDecimal calculateExpenses(Long userId) {

        return findByUser(userId)
                .stream()
                .filter(transaction ->
                        transaction.getType() == TransactionType.EXPENSE)
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public BigDecimal calculateBalance(Long userId) {

        BigDecimal income = calculateIncome(userId);
        BigDecimal expenses = calculateExpenses(userId);

        return income.subtract(expenses);
    }
}