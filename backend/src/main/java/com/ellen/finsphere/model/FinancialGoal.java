package com.ellen.finsphere.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "financial_goals")
public class FinancialGoal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal targetAmount;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal currentAmount;

    private LocalDate deadline;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public FinancialGoal() {
    }

    public FinancialGoal(
            Long id,
            String name,
            BigDecimal targetAmount,
            BigDecimal currentAmount,
            LocalDate deadline,
            User user) {

        this.id = id;
        this.name = name;
        this.targetAmount = targetAmount;
        this.currentAmount = currentAmount;
        this.deadline = deadline;
        this.user = user;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public BigDecimal getTargetAmount() {
        return targetAmount;
    }

    public void setTargetAmount(BigDecimal targetAmount) {
        this.targetAmount = targetAmount;
    }

    public BigDecimal getCurrentAmount() {
        return currentAmount;
    }

    public void setCurrentAmount(BigDecimal currentAmount) {
        this.currentAmount = currentAmount;
    }

    public LocalDate getDeadline() {
        return deadline;
    }

    public void setDeadline(LocalDate deadline) {
        this.deadline = deadline;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}