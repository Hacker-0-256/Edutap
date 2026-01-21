/*
 * EduTap ESP32 Payment Device (POS/Canteen) Firmware
 * 
 * Hardware:
 * - ESP32 Development Board
 * - MFRC522 RFID Reader (or PN532 NFC)
 * - 0.96" OLED Display (optional, for showing balance)
 * - Keypad (optional, for manual amount entry)
 * - LED indicators
 * - Buzzer
 * 
 * Libraries Required:
 * - WiFi (built-in)
 * - HTTPClient (built-in)
 * - ArduinoJson v6.x
 * - MFRC522 (for RC522) or Adafruit_PN532 (for PN532)
 * - SPI (built-in)
 * - U8g2lib (for OLED display, optional)
 * 
 * Configuration:
 * 1. Update WiFi credentials
 * 2. Update backend API URL
 * 3. Register device via admin panel and get API key
 * 4. Update deviceId and apiKey below
 * 5. Set default payment amount or implement keypad input
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <SPI.h>
#include <MFRC522.h>

// Uncomment if using OLED display
// #include <U8g2lib.h>
// U8g2lib u8g2;

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
const char* deviceId = "pos-canteen-001";  // Your device ID
const char* apiKey = "your-api-key-here";  // Your API key from registration

// Device Location
const char* deviceLocation = "Main Canteen";

// Payment Configuration
const float DEFAULT_AMOUNT = 500.0;  // Default payment amount in RWF
// If you have a keypad, implement amount input instead

// RFID Configuration
#define SS_PIN 5   // ESP32 GPIO5 (change if needed)
#define RST_PIN 4  // ESP32 GPIO4 (change if needed)
MFRC522 mfrc522(SS_PIN, RST_PIN);

// LED and Buzzer Pins
#define LED_GREEN 2   // GPIO2
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
float currentAmount = DEFAULT_AMOUNT;

// ============================================
// SETUP
// ============================================

void setup() {
  Serial.begin(115200);
  delay(1000);
  
  Serial.println("\n\n=================================");
  Serial.println("EduTap ESP32 Payment Device");
  Serial.println("=================================\n");
  
  // Initialize RFID
  SPI.begin();
  mfrc522.PCD_Init();
  
  // Check if RFID reader is connected
  if (!mfrc522.PCD_PerformSelfTest()) {
    Serial.println("ERROR: RFID reader not detected!");
    while (1) {
      delay(1000);
    }
  }
  Serial.println("RFID reader initialized");
  
  // Initialize LEDs and Buzzer
  pinMode(LED_GREEN, OUTPUT);
  pinMode(LED_RED, OUTPUT);
  pinMode(BUZZER, OUTPUT);
  
  // Initialize OLED display (if available)
  // u8g2.begin();
  // u8g2.clearBuffer();
  // u8g2.setFont(u8g2_font_ncenB08_tr);
  // u8g2.drawStr(0, 10, "EduTap POS");
  // u8g2.sendBuffer();
  
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
    
    blinkLED(LED_GREEN, 3, 200);
  } else {
    Serial.println("\nERROR: WiFi connection failed!");
    blinkLED(LED_RED, 5, 200);
    ESP.restart();
  }
  
  // Authenticate device
  Serial.println("\nAuthenticating device...");
  if (authenticateDevice()) {
    Serial.println("✓ Device authenticated successfully!");
    deviceAuthenticated = true;
    blinkLED(LED_GREEN, 2, 300);
  } else {
    Serial.println("✗ Device authentication failed!");
    deviceAuthenticated = false;
    blinkLED(LED_RED, 3, 300);
  }
  
  // Send initial heartbeat
  sendHeartbeat();
  
  Serial.println("\nDevice ready! Waiting for cards...");
  Serial.print("Default amount: ");
  Serial.print(currentAmount);
  Serial.println(" RWF\n");
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
  
  // TODO: If you have a keypad, read amount input here
  // currentAmount = readAmountFromKeypad();
  
  // Check for new card
  if (mfrc522.PICC_IsNewCardPresent() && mfrc522.PICC_ReadCardSerial()) {
    String cardUID = getCardUID();
    
    if (cardUID.length() > 0) {
      unsigned long currentTime = millis();
      if (cardUID != lastCardUID || (currentTime - lastReadTime > CARD_DEBOUNCE_TIME)) {
        lastCardUID = cardUID;
        lastReadTime = currentTime;
        
        Serial.println("=================================");
        Serial.print("Card detected: ");
        Serial.println(cardUID);
        Serial.print("Amount: ");
        Serial.print(currentAmount);
        Serial.println(" RWF");
        Serial.println("Processing payment...");
        
        // Process payment
        handlePayment(cardUID, currentAmount);
        
        Serial.println("=================================\n");
      }
    }
    
    mfrc522.PICC_HaltA();
    mfrc522.PCD_StopCrypto1();
  }
  
  // Send heartbeat periodically
  unsigned long currentTime = millis();
  if (currentTime - lastHeartbeat > HEARTBEAT_INTERVAL) {
    sendHeartbeat();
    lastHeartbeat = currentTime;
  }
  
  delay(100);
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
  http.setTimeout(5000);
  
  StaticJsonDocument<200> doc;
  doc["apiKey"] = apiKey;
  
  String jsonPayload;
  serializeJson(doc, jsonPayload);
  
  int httpCode = http.POST(jsonPayload);
  
  bool success = false;
  if (httpCode == 200) {
    String response = http.getString();
    StaticJsonDocument<512> responseDoc;
    DeserializationError error = deserializeJson(responseDoc, response);
    
    if (!error && responseDoc["success"] == true) {
      success = true;
    }
  }
  
  http.end();
  return success;
}

// ============================================
// HEARTBEAT
// ============================================

void sendHeartbeat() {
  if (!deviceAuthenticated) {
    return;
  }
  
  HTTPClient http;
  String url = String(apiUrl) + "/api/devices/" + String(deviceId) + "/status";
  
  http.begin(url);
  http.addHeader("Content-Type", "application/json");
  http.setTimeout(5000);
  
  StaticJsonDocument<300> doc;
  doc["status"] = "online";
  JsonObject metrics = doc.createNestedObject("metrics");
  metrics["signalStrength"] = WiFi.RSSI();
  
  String jsonPayload;
  serializeJson(doc, jsonPayload);
  
  http.POST(jsonPayload);
  http.end();
}

// ============================================
// PAYMENT PROCESSING
// ============================================

void handlePayment(String cardUID, float amount) {
  HTTPClient http;
  String url = String(apiUrl) + "/api/card/tap";
  
  http.begin(url);
  http.addHeader("Content-Type", "application/json");
  http.setTimeout(10000);
  
  // Create JSON payload for payment
  StaticJsonDocument<400> doc;
  doc["cardUID"] = cardUID;
  doc["deviceId"] = deviceId;
  doc["deviceLocation"] = deviceLocation;
  doc["amount"] = amount;
  doc["description"] = "Canteen purchase";
  
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
    
    StaticJsonDocument<1024> responseDoc;
    DeserializationError error = deserializeJson(responseDoc, response);
    
    if (!error && responseDoc["success"] == true) {
      // Payment successful!
      Serial.println("✓ Payment processed successfully");
      
      // Get transaction details
      float newBalance = responseDoc["data"]["data"]["newBalance"].as<float>();
      String transactionId = responseDoc["data"]["data"]["transaction"]["id"].as<String>();
      
      Serial.print("Transaction ID: ");
      Serial.println(transactionId);
      Serial.print("New Balance: ");
      Serial.print(newBalance);
      Serial.println(" RWF");
      
      // Display on OLED if available
      // u8g2.clearBuffer();
      // u8g2.setFont(u8g2_font_ncenB10_tr);
      // u8g2.drawStr(0, 15, "Payment OK");
      // u8g2.setFont(u8g2_font_ncenB08_tr);
      // String balanceStr = "Balance: " + String(newBalance) + " RWF";
      // u8g2.drawStr(0, 30, balanceStr.c_str());
      // u8g2.sendBuffer();
      
      // Success feedback
      digitalWrite(LED_GREEN, HIGH);
      beepBuzzer(1000, 300);  // High beep
      delay(1000);
      digitalWrite(LED_GREEN, LOW);
      
    } else {
      // Error in response
      String errorMsg = responseDoc["message"].as<String>();
      Serial.print("✗ Payment failed: ");
      Serial.println(errorMsg);
      
      // Display error on OLED
      // u8g2.clearBuffer();
      // u8g2.setFont(u8g2_font_ncenB10_tr);
      // u8g2.drawStr(0, 15, "Payment Failed");
      // u8g2.setFont(u8g2_font_ncenB08_tr);
      // u8g2.drawStr(0, 30, errorMsg.c_str());
      // u8g2.sendBuffer();
      
      // Error feedback
      digitalWrite(LED_RED, HIGH);
      beepBuzzer(500, 500);  // Low beep
      delay(1000);
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
    }
    
    // Network error feedback
    digitalWrite(LED_RED, HIGH);
    beepBuzzer(300, 1000);
    delay(1000);
    digitalWrite(LED_RED, LOW);
  }
  
  http.end();
}

// ============================================
// END OF CODE
// ============================================




