package kr.ac.kopo.kihwan.frameworktermproject.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy; // 추가됨
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    public SecurityConfig() {
        // ★ 서버 켜질 때 이 로그가 안 찍히면, 패키지 위치가 잘못된 겁니다!
        System.out.println("=== [SecurityConfig] 보안 설정이 로드되었습니다. ===");
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // 1. CSRF 해제 (Rest API 사용 시 불필요)
                .csrf(csrf -> csrf.disable())

                // 2. CORS 설정 연결 (중요)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // 3. 세션 관리 (JWT 등 사용 시 STATELESS가 맞지만, 일단 기본값 유지해도 무방)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))

                // 4. 권한 설정 (순서 중요!)
                .authorizeHttpRequests(auth -> auth
                        // OPTIONS 요청 허용
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        // ★★★ 여기에 "/error"를 꼭 추가하세요! 그래야 진짜 에러 메시지가 보입니다. ★★★
                        .requestMatchers("/auth/**", "/api/members/**", "/images/**", "/api/items/**", "/error").permitAll()

                        .anyRequest().authenticated()
                );

        return http.build();
    }

    // CORS 상세 설정
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        // 프론트엔드 주소 확실하게 지정
        config.setAllowedOrigins(List.of("http://localhost:3000"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true); // 쿠키/인증정보 허용

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}