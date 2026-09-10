package com.ellen.finsphere.service;

import com.ellen.finsphere.dto.FinancialGoalRequestDTO;
import com.ellen.finsphere.dto.FinancialGoalResponseDTO;
import com.ellen.finsphere.model.FinancialGoal;
import com.ellen.finsphere.model.User;
import com.ellen.finsphere.repository.FinancialGoalRepository;
import com.ellen.finsphere.repository.UserRepository;
import org.springframework.stereotype.Service;
import java.util.List;

import java.math.BigDecimal;

@Service
public class FinancialGoalService {

        private final FinancialGoalRepository financialGoalRepository;
        private final UserRepository userRepository;

        public FinancialGoalService(
                        FinancialGoalRepository financialGoalRepository,
                        UserRepository userRepository) {

                this.financialGoalRepository = financialGoalRepository;
                this.userRepository = userRepository;
        }

        public FinancialGoalResponseDTO create(
                        FinancialGoalRequestDTO dto) {

                if (dto.getName() == null
                                || dto.getName().isBlank()) {

                        throw new IllegalArgumentException(
                                        "O nome da meta é obrigatório.");
                }

                if (dto.getTargetAmount() == null
                                || dto.getTargetAmount()
                                                .compareTo(BigDecimal.ZERO) <= 0) {

                        throw new IllegalArgumentException(
                                        "O valor da meta deve ser maior que zero.");
                }

                BigDecimal currentAmount = dto.getCurrentAmount() == null
                                ? BigDecimal.ZERO
                                : dto.getCurrentAmount();

                if (currentAmount.compareTo(BigDecimal.ZERO) < 0) {
                        throw new IllegalArgumentException(
                                        "O valor atual não pode ser negativo.");
                }

                User user = userRepository
                                .findById(dto.getUserId())
                                .orElseThrow(() -> new IllegalArgumentException(
                                                "Usuário não encontrado."));

                FinancialGoal financialGoal = new FinancialGoal(
                                null,
                                dto.getName(),
                                dto.getTargetAmount(),
                                currentAmount,
                                dto.getDeadline(),
                                user);

                FinancialGoal savedGoal = financialGoalRepository.save(financialGoal);

                return new FinancialGoalResponseDTO(
                                savedGoal.getId(),
                                savedGoal.getName(),
                                savedGoal.getTargetAmount(),
                                savedGoal.getCurrentAmount(),
                                savedGoal.getDeadline(),
                                savedGoal.getUser().getId());
        }

        public List<FinancialGoalResponseDTO> findByUser(Long userId) {

                return financialGoalRepository
                                .findByUserId(userId)
                                .stream()
                                .map(goal -> new FinancialGoalResponseDTO(
                                                goal.getId(),
                                                goal.getName(),
                                                goal.getTargetAmount(),
                                                goal.getCurrentAmount(),
                                                goal.getDeadline(),
                                                goal.getUser().getId()))
                                .toList();
        }

        public void delete(Long id) {

                if (!financialGoalRepository.existsById(id)) {
                        throw new IllegalArgumentException(
                                        "Meta financeira não encontrada.");
                }

                financialGoalRepository.deleteById(id);
        }

        public FinancialGoalResponseDTO updateCurrentAmount(
                        Long id,
                        BigDecimal currentAmount) {

                FinancialGoal goal = financialGoalRepository
                                .findById(id)
                                .orElseThrow(() -> new IllegalArgumentException(
                                                "Meta financeira não encontrada."));

                if (currentAmount == null
                                || currentAmount.compareTo(BigDecimal.ZERO) < 0) {
                        throw new IllegalArgumentException(
                                        "O valor atual não pode ser negativo.");
                }

                goal.setCurrentAmount(currentAmount);

                FinancialGoal updatedGoal = financialGoalRepository.save(goal);

                return new FinancialGoalResponseDTO(
                                updatedGoal.getId(),
                                updatedGoal.getName(),
                                updatedGoal.getTargetAmount(),
                                updatedGoal.getCurrentAmount(),
                                updatedGoal.getDeadline(),
                                updatedGoal.getUser().getId());
        }
}
