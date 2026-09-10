package com.ellen.finsphere.controller;

import com.ellen.finsphere.dto.FinancialGoalRequestDTO;
import com.ellen.finsphere.dto.FinancialGoalResponseDTO;
import com.ellen.finsphere.service.FinancialGoalService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/goals")
public class FinancialGoalController {

        private final FinancialGoalService financialGoalService;

        public FinancialGoalController(
                        FinancialGoalService financialGoalService) {

                this.financialGoalService = financialGoalService;
        }

        @PostMapping
        public ResponseEntity<FinancialGoalResponseDTO> create(
                        @RequestBody FinancialGoalRequestDTO goal) {

                FinancialGoalResponseDTO createdGoal = financialGoalService.create(goal);

                return ResponseEntity
                                .status(HttpStatus.CREATED)
                                .body(createdGoal);
        }

        @GetMapping("/user/{userId}")
        public ResponseEntity<List<FinancialGoalResponseDTO>> findByUser(
                        @PathVariable Long userId) {

                return ResponseEntity.ok(
                                financialGoalService.findByUser(userId));
        }

        @DeleteMapping("/{id}")
        public ResponseEntity<Void> delete(
                        @PathVariable Long id) {

                financialGoalService.delete(id);

                return ResponseEntity.noContent().build();
        }

        @PatchMapping("/{id}/current-amount")
        public ResponseEntity<FinancialGoalResponseDTO> updateCurrentAmount(
                        @PathVariable Long id,
                        @RequestBody BigDecimal currentAmount) {

                return ResponseEntity.ok(
                                financialGoalService.updateCurrentAmount(
                                                id,
                                                currentAmount));
        }
}
