package kr.ac.kopo.kihwan.frameworktermproject.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
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

    // 1. 암호화 모듈 등록 (이게 있어야 비번을 암호화할 수 있음)
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // 2. 보안 필터 설정 (리액트 통신을 위해 꼭 필요!)
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // CSRF 비활성화 (리액트와 통신할 땐 끄는 게 편함)
                .csrf(csrf -> csrf.disable())
                // CORS 설정 적용 (3000번 포트 허용)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                // 3. 주소별 권한 설정
                .authorizeHttpRequests(auth -> auth
                        // 회원가입, 로그인, 글쓰기(POST), 목록조회(GET), 이미지조회 등 모두 허용 + 댓글 조회와 쓰기 허용
                        .requestMatchers("/api/members/**", "/api/items/**", "/images/**", "/api/comments/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/items").permitAll() // 글쓰기 POST 명시적 허용
                        .anyRequest().authenticated()
                );

        return http.build();
    }

    // 3. CORS 구체적인 설정
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        config.setAllowedOrigins(List.of("http://localhost:3000")); // 리액트 주소
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
