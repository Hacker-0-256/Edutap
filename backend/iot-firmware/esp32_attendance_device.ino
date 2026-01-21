/*
 * EduTap ESP32 Attendance Device Firmware
 * 
 * Hardware:
 * - ESP32 Development Board
 * - MFRC522 RFID Reader (or PN532 NFC)
 * - LED indicators (optional)
 * - Buzzer (optional)
 * 
 * Libraries Required:
 * - WiFi (built-in)
 * - HTTPClient (built-in)
 * - ArduinoJson v6.x
 * - MFRC522 (for RC522) or Adafruit_PN532 (for PN532)
 * - SPI (built-in)
 * 
 * Configuration:
 * 1. Update WiFi credentials
 * 2. Update backend API URL
 * 3. Register device via admin panel and get API key
 * 4. Update deviceId and apiKey below
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <SPI.h>
#include <MFRC522.h>

// ============================================
// CONFIGURATION - UPDATE THESE VALUES
// ============================================

// WiFi Credentials
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// Backend API Configuration
const char* apiUrl = "http://192.168.1.100:5001";  // Change to your backend URL
// For production: "https://api.edutap.com"

// Device Credentials (from device registration)
const char* deviceId = "rfid-gate-001";  // Your device ID
const char* apiKey = "your-api-key-here";  // Your API key from registration

// Device Location
const char* deviceLocation = "Main Entrance";

// RFID Configuration
#define SS_PIN 5   // ESP32 GPIO5 (change if needed)
#define RST_PIN 4  // ESP32 GPIO4 (change if needed)
MFRC522 mfrc522(SS_PIN, RST_PIN);

// LED and Buzzer Pins (optional)
#define LED_GREEN 2   // GPIO2 (built-in LED on most ESP32)
#define LED_RED 15    // GPIO15
#define BUZZER 16     // GPIO16

// Timing Configuration
const unsigned long HEARTBEAT_INTERVAL = 30000;  // 30 seconds
const unsigned long CARD_DEBOUNCE_TIME = 2000;   // 2 seconds

// ============================================
// GLOBAL VARIABLES
// ============================================

String lastCardUID = "";
unsigned long lastReadTime = 0;
unsigned long lastHeartbeat = 0;
bool deviceAuthenticated = false;

// ============================================
// SETUP
// ============================================

void setup() {
  Serial.begin(115200);
  delay(1000);
  
  Serial.println("\n\n=================================");
  Serial.println("EduTap ESP32 Attendance Device");
  Serial.println("=================================\n");
  
  // Initialize RFID
  SPI.begin();
  mfrc522.PCD_Init();
  
  // Check if RFID reader is connected
  if (!mfrc522.PCD_PerformSelfTest()) {
    Serial.println("ERROR: RFID reader not detected!");
    Serial.println("Check wiring: SS_PIN and RST_PIN");
    while (1) {
      delay(1000);
    }
  }
  Serial.println("RFID reader initialized");
  
  // Initialize LEDs and Buzzer
  pinMode(LED_GREEN, OUTPUT);
  pinMode(LED_RED, OUTPUT);
  pinMode(BUZZER, OUTPUT);
  
  // Turn off LEDs initially
  digitalWrite(LED_GREEN, LOW);
  digitalWrite(LED_RED, LOW);
  
  // Connect to WiFi
  Serial.print("Connecting to WiFi: ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);
  
  int wifiAttempts = 0;
  while (WiFi.status() != WL_CONNECTED && wifiAttempts < 20) {
    delay(500);
    Serial.print(".");
    wifiAttempts++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nWiFi connected!");
    Serial.print("IP address: ");
    Serial.println(WiFi.localIP());
    Serial.print("Signal strength (RSSI): ");
    Serial.print(WiFi.RSSI());
    Serial.println(" dBm");
    
    // Blink green LED to indicate WiFi connection
    blinkLED(LED_GREEN, 3, 200);
  } else {
    Serial.println("\nERROR: WiFi connection failed!");
    Serial.println("Check SSID and password");
    blinkLED(LED_RED, 5, 200);
    ESP.restart();  // Restart and try again
  }
  
  // Authenticate device
  Serial.println("\nAuthenticating device...");
  if (authenticateDevice()) {
    Serial.println("✓ Device authenticated successfully!");
    deviceAuthenticated = true;
    blinkLED(LED_GREEN, 2, 300);
  } else {
    Serial.println("✗ Device authentication failed!");
    Serial.println("Check deviceId and apiKey");
    deviceAuthenticated = false;
    blinkLED(LED_RED, 3, 300);
  }
  
  // Send initial heartbeat
  sendHeartbeat();
  
  Serial.println("\nDevice ready! Waiting for cards...\n");
}

// ============================================
// MAIN LOOP
// ============================================

void loop() {
  // Check WiFi connection
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi disconnected! Reconnecting...");
    WiFi.reconnect();
    delay(5000);
    return;
  }
  
  // Check for new card
  if (mfrc522.PICC_IsNewCardPresent() && mfrc522.PICC_ReadCardSerial()) {
    // Get card UID
    String cardUID = getCardUID();
    
    if (cardUID.length() > 0) {
      // Prevent duplicate reads (debounce)
      unsigned long currentTime = millis();
      if (cardUID != lastCardUID || (currentTime - lastReadTime > CARD_DEBOUNCE_TIME)) {
        lastCardUID = cardUID;
        lastReadTime = currentTime;
        
        Serial.println("=================================");
        Serial.print("Card detected: ");
        Serial.println(cardUID);
        Serial.println("Sending to backend...");
        
        // Send card tap to backend
        handleCardTap(cardUID);
        
        Serial.println("=================================\n");
      }
    }
    
    // Halt card to prevent multiple reads
    mfrc522.PICC_HaltA();
    mfrc522.PCD_StopCrypto1();
  }
  
  // Send heartbeat periodically
  unsigned long currentTime = millis();
  if (currentTime - lastHeartbeat > HEARTBEAT_INTERVAL) {
    sendHeartbeat();
    lastHeartbeat = currentTime;
  }
  
  delay(100);  // Small delay to prevent CPU overload
}

// ============================================
// HELPER FUNCTIONS
// ============================================

String getCardUID() {
  String cardUID = "";
  for (byte i = 0; i < mfrc522.uid.size; i++) {
    if (mfrc522.uid.uidByte[i] < 0x10) {
      cardUID += "0";
    }
    cardUID += String(mfrc522.uid.uidByte[i], HEX);
  }
  cardUID.toUpperCase();
  return cardUID;
}

void blinkLED(int pin, int times, int duration) {
  for (int i = 0; i < times; i++) {
    digitalWrite(pin, HIGH);
    delay(duration);
    digitalWrite(pin, LOW);
    delay(duration);
  }
}

void beepBuzzer(int frequency, int duration) {
  tone(BUZZER, frequency, duration);
}

// ============================================
// DEVICE AUTHENTICATION
// ============================================

bool authenticateDevice() {
  HTTPClient http;
  String url = String(apiUrl) + "/api/devices/auth";
  
  http.begin(url);
  http.addHeader("Content-Type", "application/json");
  http.setTimeout(5000);  // 5 second timeout
  
  // Create JSON payload
  StaticJsonDocument<200> doc;
  doc["apiKey"] = apiKey;
  
  String jsonPayload;
  serializeJson(doc, jsonPayload);
  
  Serial.print("POST ");
  Serial.println(url);
  Serial.print("Payload: ");
  Serial.println(jsonPayload);
  
  int httpCode = http.POST(jsonPayload);
  
  bool success = false;
  if (httpCode == 200) {
    String response = http.getString();
    Serial.print("Response: ");
    Serial.println(response);
    
    // Parse response
    StaticJsonDocument<512> responseDoc;
    DeserializationError error = deserializeJson(responseDoc, response);
    
    if (!error && responseDoc["success"] == true) {
      success = true;
      Serial.print("Device: ");
      Serial.println(responseDoc["data"]["device"]["deviceId"].as<String>());
      Serial.print("School: ");
      Serial.println(responseDoc["data"]["device"]["schoolName"].as<String>());
    }
  } else {
    Serial.print("HTTP Error: ");
    Serial.println(httpCode);
    if (httpCode > 0) {
      String response = http.getString();
      Serial.print("Response: ");
      Serial.println(response);
    }
  }
  
  http.end();
  return success;
}

// ============================================
// HEARTBEAT (STATUS UPDATE)
// ============================================

void sendHeartbeat() {
  if (!deviceAuthenticated) {
    return;  // Don't send heartbeat if not authenticated
  }
  
  HTTPClient http;
  String url = String(apiUrl) + "/api/devices/" + String(deviceId) + "/status";
  
  http.begin(url);
  http.addHeader("Content-Type", "application/json");
  http.setTimeout(5000);
  
  // Get WiFi signal strength
  int signalStrength = WiFi.RSSI();
  
  // Create JSON payload
  StaticJsonDocument<300> doc;
  doc["status"] = "online";
  JsonObject metrics = doc.createNestedObject("metrics");
  metrics["signalStrength"] = signalStrength;
  // Add battery level if you have a battery monitor
  // metrics["batteryLevel"] = readBatteryLevel();
  
  String jsonPayload;
  serializeJson(doc, jsonPayload);
  
  int httpCode = http.POST(jsonPayload);
  
  if (httpCode == 200) {
    Serial.println("✓ Heartbeat sent (RSSI: " + String(signalStrength) + " dBm)");
  } else {
    Serial.print("✗ Heartbeat failed, HTTP code: ");
    Serial.println(httpCode);
  }
  
  http.end();
}

// ============================================
// CARD TAP HANDLER
// ============================================

void handleCardTap(String cardUID) {
  HTTPClient http;
  String url = String(apiUrl) + "/api/card/tap";
  
  http.begin(url);
  http.addHeader("Content-Type", "application/json");
  http.setTimeout(10000);  // 10 second timeout for card tap
  
  // Create JSON payload
  StaticJsonDocument<300> doc;
  doc["cardUID"] = cardUID;
  doc["deviceId"] = deviceId;
  doc["deviceLocation"] = deviceLocation;
  
  String jsonPayload;
  serializeJson(doc, jsonPayload);
  
  Serial.print("POST ");
  Serial.println(url);
  Serial.print("Payload: ");
  Serial.println(jsonPayload);
  
  int httpCode = http.POST(jsonPayload);
  
  if (httpCode == 200) {
    String response = http.getString();
    Serial.print("Response: ");
    Serial.println(response);
    
    // Parse JSON response
    StaticJsonDocument<1024> responseDoc;
    DeserializationError error = deserializeJson(responseDoc, response);
    
    if (!error && responseDoc["success"] == true) {
      // Success!
      Serial.println("✓ Card tap processed successfully");
      
      // Get response type (attendance or payment)
      String type = responseDoc["data"]["type"].as<String>();
      
      if (type == "attendance") {
        Serial.println("Type: Attendance");
        String studentName = responseDoc["data"]["data"]["student"]["firstName"].as<String>() + 
                            " " + responseDoc["data"]["data"]["student"]["lastName"].as<String>();
        Serial.print("Student: ");
        Serial.println(studentName);
      } else if (type == "payment") {
        Serial.println("Type: Payment");
        float balance = responseDoc["data"]["data"]["newBalance"].as<float>();
        Serial.print("New Balance: ");
        Serial.print(balance);
        Serial.println(" RWF");
      }
      
      // Success feedback
      digitalWrite(LED_GREEN, HIGH);
      beepBuzzer(1000, 200);  // High beep
      delay(500);
      digitalWrite(LED_GREEN, LOW);
      
    } else {
      // Error in response
      String errorMsg = responseDoc["message"].as<String>();
      Serial.print("✗ Error: ");
      Serial.println(errorMsg);
      
      // Error feedback
      digitalWrite(LED_RED, HIGH);
      beepBuzzer(500, 500);  // Low beep
      delay(500);
      digitalWrite(LED_RED, LOW);
    }
    
  } else {
    // HTTP error
    Serial.print("✗ HTTP Error: ");
    Serial.println(httpCode);
    
    if (httpCode > 0) {
      String response = http.getString();
      Serial.print("Response: ");
      Serial.println(response);
    } else {
      Serial.println("Network error - check connection");
    }
    
    // Network error feedback
    digitalWrite(LED_RED, HIGH);
    beepBuzzer(300, 1000);  // Long low beep
    delay(500);
    digitalWrite(LED_RED, LOW);
  }
  
  http.end();
}

// ============================================
// END OF CODE
// ============================================




