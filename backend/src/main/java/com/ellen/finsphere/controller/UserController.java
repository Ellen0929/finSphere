package com.ellen.finsphere.controller;

import com.ellen.finsphere.dto.UserRequestDTO;
import com.ellen.finsphere.dto.UserResponseDTO;
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
    public ResponseEntity<UserResponseDTO> create(
            @RequestBody UserRequestDTO user) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(userService.create(user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDTO> findById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                userService.findById(id)
        );
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<UserResponseDTO> findByEmail(
            @PathVariable String email) {

        return ResponseEntity.ok(
                userService.findByEmail(email)
        );
    }
}
