package com.ellen.finsphere.service;

import com.ellen.finsphere.dto.TransactionRequestDTO;
import com.ellen.finsphere.dto.TransactionResponseDTO;
import com.ellen.finsphere.model.Category;
import com.ellen.finsphere.model.Transaction;
import com.ellen.finsphere.model.TransactionType;
import com.ellen.finsphere.model.User;
import com.ellen.finsphere.repository.CategoryRepository;
import com.ellen.finsphere.repository.TransactionRepository;
import com.ellen.finsphere.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    public TransactionService(
            TransactionRepository transactionRepository,
            CategoryRepository categoryRepository,
            UserRepository userRepository) {

        this.transactionRepository = transactionRepository;
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
    }

    public TransactionResponseDTO create(TransactionRequestDTO dto) {

        if (dto.getAmount() == null
                || dto.getAmount().compareTo(BigDecimal.ZERO) <= 0) {

            throw new IllegalArgumentException(
                    "O valor da transação deve ser maior que zero."
            );
        }

        if (dto.getType() == null) {
            throw new IllegalArgumentException(
                    "O tipo da transação é obrigatório."
            );
        }

        Category category = categoryRepository
                .findById(dto.getCategoryId())
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Categoria não encontrada."
                        )
                );

        User user = userRepository
                .findById(dto.getUserId())
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Usuário não encontrado."
                        )
                );

        Transaction transaction = new Transaction(
                null,
                dto.getDescription(),
                dto.getAmount(),
                dto.getType(),
                dto.getDate(),
                category,
                user
        );

        Transaction savedTransaction =
                transactionRepository.save(transaction);

        return toResponseDTO(savedTransaction);
    }

    public List<TransactionResponseDTO> findByUser(Long userId) {

        return transactionRepository
                .findByUserId(userId)
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    public BigDecimal calculateIncome(Long userId) {

        return transactionRepository
                .findByUserId(userId)
                .stream()
                .filter(transaction ->
                        transaction.getType() == TransactionType.INCOME)
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public BigDecimal calculateExpenses(Long userId) {

        return transactionRepository
                .findByUserId(userId)
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

    private TransactionResponseDTO toResponseDTO(
            Transaction transaction) {

        return new TransactionResponseDTO(
                transaction.getId(),
                transaction.getDescription(),
                transaction.getAmount(),
                transaction.getType(),
                transaction.getDate(),
                transaction.getCategory().getId(),
                transaction.getCategory().getName(),
                transaction.getUser().getId()
        );
    }
}