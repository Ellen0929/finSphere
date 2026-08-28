package com.ellen.finsphere.controller;

import com.ellen.finsphere.dto.TransactionRequestDTO;
import com.ellen.finsphere.dto.TransactionResponseDTO;
import com.ellen.finsphere.service.TransactionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @PostMapping
    public ResponseEntity<TransactionResponseDTO> create(
            @RequestBody TransactionRequestDTO transaction) {

        TransactionResponseDTO createdTransaction =
                transactionService.create(transaction);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(createdTransaction);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TransactionResponseDTO>> findByUser(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                transactionService.findByUser(userId)
        );
    }

    @GetMapping("/user/{userId}/income")
    public ResponseEntity<BigDecimal> getIncome(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                transactionService.calculateIncome(userId)
        );
    }

    @GetMapping("/user/{userId}/expenses")
    public ResponseEntity<BigDecimal> getExpenses(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                transactionService.calculateExpenses(userId)
        );
    }

    @GetMapping("/user/{userId}/balance")
    public ResponseEntity<BigDecimal> getBalance(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                transactionService.calculateBalance(userId)
        );
    }
}