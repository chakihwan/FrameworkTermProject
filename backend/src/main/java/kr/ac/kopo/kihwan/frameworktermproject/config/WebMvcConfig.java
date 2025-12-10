package kr.ac.kopo.kihwan.frameworktermproject.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 브라우저에서 /images/abc.jpg 로 요청하면
        // 실제로는 D:/lost_found_images/abc.jpg 파일을 보여준다.
        registry.addResourceHandler("/images/**")
                .addResourceLocations("file:///D:/FrameworkTermProject/lost_found_images/");
    }
}