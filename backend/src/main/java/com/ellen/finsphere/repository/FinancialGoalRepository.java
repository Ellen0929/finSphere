package com.ellen.finsphere.repository;

import com.ellen.finsphere.model.FinancialGoal;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FinancialGoalRepository extends JpaRepository<FinancialGoal, Long> {

    List<FinancialGoal> findByUserId(Long userId);
}