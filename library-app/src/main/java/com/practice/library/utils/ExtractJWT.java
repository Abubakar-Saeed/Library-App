package com.practice.library.utils;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Base64;
import java.util.Map;

public class ExtractJWT {

    public static String payloadJWTExtraction(String token,String extraction) {
        try {
            // Remove "Bearer " prefix if present
            token = token.replace("Bearer ", "").trim();

            // Split JWT into parts
            String[] chunks = token.split("\\.");
            if (chunks.length < 2) {
                throw new IllegalArgumentException("Invalid JWT token.");
            }

            // Decode payload (2nd part)
            byte[] decodedBytes = Base64.getUrlDecoder().decode(chunks[1]);
            String payload = new String(decodedBytes);

            // Parse JSON
            ObjectMapper mapper = new ObjectMapper();
            Map<String, Object> payloadMap = mapper.readValue(payload, Map.class);

            // Return "sub" if it exists
            if (payloadMap.containsKey(extraction)) {
                return payloadMap.get(extraction).toString();
            } else {
                return null;
            }
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
