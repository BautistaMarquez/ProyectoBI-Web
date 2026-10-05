package com.bi.analytics.config;

import java.time.Duration;

import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.github.benmanes.caffeine.cache.Caffeine;

@Configuration
@EnableCaching
public class CacheConfig {

	public static final String ANALYTICS_CACHE = "analytics";

	@Bean
	public CacheManager cacheManager() {
		CaffeineCacheManager manager = new CaffeineCacheManager(ANALYTICS_CACHE);
		manager.setCaffeine(Caffeine.newBuilder()
				.expireAfterWrite(Duration.ofMinutes(30))
				.maximumSize(100));
		return manager;
	}
}
