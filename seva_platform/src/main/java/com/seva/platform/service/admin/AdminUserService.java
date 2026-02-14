package com.seva.platform.service.admin;

import com.google.firebase.auth.FirebaseAuth;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AdminUserService {

    public void promoteToAdmin(String uid) {
        try {
            Map<String, Object> claims = new HashMap<>();
            claims.put("role", "admin");
            FirebaseAuth.getInstance().setCustomUserClaims(uid, claims);
        } catch (Exception e) {
            throw new RuntimeException("Failed to promote user to admin: " + e.getMessage(), e);
        }
    }

    public void demoteToUser(String uid) {
        try {
            FirebaseAuth.getInstance().setCustomUserClaims(uid, Map.of());
        } catch (Exception e) {
            throw new RuntimeException("Failed to demote admin: " + e.getMessage(), e);
        }
    }
}
