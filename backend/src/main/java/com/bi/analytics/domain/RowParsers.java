package com.bi.analytics.domain;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.HashMap;
import java.util.Map;

/** Null-safe extraction helpers for rows returned by Power BI executeQueries. */
final class RowParsers {

	private RowParsers() {
	}

	/** Re-keys a row by column name: {@code 'Tabla'[Col]} / {@code [Medida]} -> lower-case {@code col}. */
	static Map<String, Object> normalize(Map<String, Object> row) {
		Map<String, Object> normalized = new HashMap<>();
		if (row == null) {
			return normalized;
		}
		row.forEach((key, value) -> {
			if (key != null) {
				normalized.put(normalizeKey(key), value);
			}
		});
		return normalized;
	}

	private static String normalizeKey(String key) {
		int open = key.lastIndexOf('[');
		int close = key.lastIndexOf(']');
		String name = (open >= 0 && close > open) ? key.substring(open + 1, close) : key;
		return name.trim().toLowerCase();
	}

	private static Object get(Map<String, Object> row, String column) {
		return row.get(column.toLowerCase());
	}

	static String string(Map<String, Object> row, String column) {
		Object value = get(row, column);
		if (value == null) {
			return null;
		}
		String text = value.toString().trim();
		return text.isEmpty() ? null : text;
	}

	static BigDecimal decimal(Map<String, Object> row, String column) {
		Object value = get(row, column);
		if (value == null) {
			return null;
		}
		if (value instanceof BigDecimal bd) {
			return bd;
		}
		try {
			return new BigDecimal(value.toString().trim());
		} catch (NumberFormatException e) {
			return null;
		}
	}

	static Integer integer(Map<String, Object> row, String column) {
		BigDecimal value = decimal(row, column);
		return value == null ? null : value.intValue();
	}

	static LocalDate date(Map<String, Object> row, String column) {
		String text = string(row, column);
		if (text == null) {
			return null;
		}
		try {
			return LocalDateTime.parse(text).toLocalDate();
		} catch (DateTimeParseException e) {
			// fall through to date-only
		}
		try {
			return LocalDate.parse(text.length() > 10 ? text.substring(0, 10) : text);
		} catch (DateTimeParseException e) {
			return null;
		}
	}
}
