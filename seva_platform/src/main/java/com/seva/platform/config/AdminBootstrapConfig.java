package com.seva.platform.config;

import com.seva.platform.service.admin.AdminUserService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AdminBootstrapConfig {

    @Bean
    CommandLineRunner bootstrapAdmin(
            AdminUserService adminUserService,
            @Value("${app.bootstrap.admin.enabled:false}") boolean enabled,
            @Value("${app.bootstrap.admin.uid:}") String bootstrapUid
    ) {
        return args -> {
            if (!enabled) return;
            if (bootstrapUid == null || bootstrapUid.isBlank()) {
                System.out.println("⚠️ Bootstrap enabled but uid missing. Skipping.");
                return;
            }

            adminUserService.promoteToAdmin(bootstrapUid.trim());
            System.out.println("✅ Bootstrapped admin claim for uid: " + bootstrapUid);
            System.out.println("ℹ️ Turn OFF app.bootstrap.admin.enabled after this run.");
        };
    }
}
