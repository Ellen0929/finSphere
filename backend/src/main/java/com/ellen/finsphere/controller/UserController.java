package com.ellen.finsphere.controller;

import com.ellen.finsphere.model.User;
import com.ellen.finsphere.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<User> create(
            @RequestBody User user) {

        User createdUser = userService.create(user);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(createdUser);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> findById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                userService.findById(id)
        );
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<User> findByEmail(
            @PathVariable String email) {

        return ResponseEntity.ok(
                userService.findByEmail(email)
        );
    }
}
