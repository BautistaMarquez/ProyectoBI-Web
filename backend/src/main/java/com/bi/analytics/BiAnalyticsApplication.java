package com.bi.analytics;

import io.github.cdimascio.dotenv.Dotenv;
import io.github.cdimascio.dotenv.DotenvEntry;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class BiAnalyticsApplication {

	public static void main(String[] args) {
		loadDotenv();
		SpringApplication.run(BiAnalyticsApplication.class, args);
	}

	private static void loadDotenv() {
		Dotenv dotenv = load("..");
		if (dotenv.entries().isEmpty()) {
			dotenv = load(".");
		}
		for (DotenvEntry entry : dotenv.entries()) {
			String key = entry.getKey();
			if (System.getProperty(key) == null && System.getenv(key) == null) {
				System.setProperty(key, entry.getValue());
			}
		}
	}

	private static Dotenv load(String directory) {
		return Dotenv.configure().directory(directory).ignoreIfMissing().ignoreIfMalformed().load();
	}

}
