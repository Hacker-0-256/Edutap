# 🛠️ IoT Engineer Tasks - ESP32 + PN532 NFC Module + RFID Cards

This document outlines **exactly what the IoT engineer needs to do** to integrate ESP32 devices with PN532 NFC modules and RFID cards into the EduTap system.

---

## 📋 Your Responsibilities

As the IoT engineer, you are responsible for:

1. **Hardware Setup & Assembly**
2. **Firmware Development** (ESP32 programming)
3. **Device Registration** (one-time per device)
4. **Testing & Debugging**
5. **Deployment & Maintenance**

---

## 🔧 Phase 1: Hardware Setup

### Required Components
- ✅ **ESP32 Development Board** (ESP32-WROOM-32 or ESP32-DevKitC)
- ✅ **PN532 NFC Module** (for reading RFID/NFC cards)
- ✅ **RFID Cards** (MIFARE cards for students)
- ✅ **Power Supply**: 5V 2A USB adapter or 12V adapter
- ✅ **Optional**: LED indicators (green/red), buzzer, OLED display

### Wiring Diagram (ESP32 ↔ PN532)

```
ESP32          PN532 NFC Module
------         ----------------
3.3V    ──────► VCC
GND     ──────► GND
GPIO 18 ──────► SCL (I2C Clock)
GPIO 19 ──────► SDA (I2C Data)
```

**OR using SPI (if your PN532 supports it):**
```
ESP32          PN532 NFC Module
------         ----------------
3.3V    ──────► VCC
GND     ──────► GND
GPIO 23 ──────► MOSI
GPIO 19 ──────► MISO
GPIO 18 ──────► SCK
GPIO 5  ──────► SS (Chip Select)
GPIO 4  ──────► RST (Reset)
```

### Optional Components Wiring
```
ESP32          Components
------         ----------
GPIO 2  ──────► Green LED (with 220Ω resistor)
GPIO 15 ──────► Red LED (with 220Ω resistor)
GPIO 16 ──────► Buzzer
```

---

## 💻 Phase 2: Software Setup

### Step 1: Install Arduino IDE
1. Download Arduino IDE (v1.8.19 or later) from https://www.arduino.cc/en/software
2. Install ESP32 Board Support:
   - Go to **File → Preferences**
   - Add to "Additional Board Manager URLs": `https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json`
   - Go to **Tools → Board → Boards Manager**
   - Search "ESP32" and install "esp32 by Espressif Systems"

### Step 2: Install Required Libraries
In Arduino IDE, go to **Sketch → Include Library → Manage Libraries** and install:

1. **ArduinoJson** by Benoit Blanchon (v6.21.3 or later)
2. **Adafruit PN532** by Adafruit (for PN532 NFC module)
3. **Adafruit BusIO** by Adafruit (dependency for PN532)

### Step 3: Get Backend API URL
Ask the backend team for:
- **Backend URL**: `http://your-backend-url:5001` (or production URL)
- **WiFi SSID and Password** for the school network

---

## 📝 Phase 3: Firmware Development

### Complete ESP32 + PN532 Code Template

Create a new Arduino sketch and paste this code:

```cpp
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <Wire.h>
#include <Adafruit_PN532.h>

// ============================================
// CONFIGURATION - UPDATE THESE VALUES
// ============================================

// WiFi Credentials
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// Backend API URL
const char* apiUrl = "http://192.168.1.100:5001";  // Change to your backend URL
// For production: "https://api.edutap.com"

// Device Credentials (you'll get these after device registration)
const char* deviceId = "rfid-gate-001";  // Change to your device ID
const char* apiKey = "your-api-key-here";  // Change after registration

// Device Location (for attendance/payment tracking)
const char* deviceLocation = "Main Entrance Gate";

// PN532 Configuration (I2C)
#define PN532_IRQ   4   // GPIO 4
#define PN532_RESET 5   // GPIO 5

// Optional: LED and Buzzer pins
#define LED_GREEN 2
#define LED_RED 15
#define BUZZER 16

// ============================================
// GLOBAL OBJECTS
// ============================================

Adafruit_PN532 nfc(PN532_IRQ, PN532_RESET);

// Card reading debounce
String lastCardUID = "";
unsigned long lastReadTime = 0;
const unsigned long DEBOUNCE_TIME = 2000;  // 2 seconds

// Heartbeat timer
unsigned long lastHeartbeat = 0;
const unsigned long HEARTBEAT_INTERVAL = 30000;  // 30 seconds

// ============================================
// SETUP FUNCTION
// ============================================

void setup() {
  Serial.begin(115200);
  delay(1000);
  
  Serial.println("\n=== EduTap IoT Device Starting ===");
  
  // Initialize PN532
  Serial.println("Initializing PN532...");
  nfc.begin();
  
  uint32_t versiondata = nfc.getFirmwareVersion();
  if (!versiondata) {
    Serial.println("ERROR: PN532 not found! Check wiring.");
    while (1) {
      delay(1000);
    }
  }
  
  Serial.print("PN532 Firmware Version: ");
  Serial.print((versiondata >> 24) & 0xFF, DEC);
  Serial.print('.');
  Serial.println((versiondata >> 16) & 0xFF, DEC);
  
  // Configure PN532 to read RFID tags
  nfc.SAMConfig();
  Serial.println("PN532 ready!");
  
  // Initialize LEDs and Buzzer (if connected)
  pinMode(LED_GREEN, OUTPUT);
  pinMode(LED_RED, OUTPUT);
  pinMode(BUZZER, OUTPUT);
  
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
    blinkLED(LED_GREEN, 3);
  } else {
    Serial.println("\nERROR: WiFi connection failed!");
    blinkLED(LED_RED, 5);
    while (1) {
      delay(1000);
    }
  }
  
  // Authenticate device with backend
  Serial.println("Authenticating device...");
  if (authenticateDevice()) {
    Serial.println("✓ Device authenticated successfully!");
    blinkLED(LED_GREEN, 2);
  } else {
    Serial.println("✗ Device authentication failed!");
    Serial.println("Check your deviceId and apiKey in the code.");
    blinkLED(LED_RED, 3);
  }
  
  // Send initial heartbeat
  sendHeartbeat();
  
  Serial.println("\n=== Device Ready - Waiting for cards ===");
}

// ============================================
// MAIN LOOP
// ============================================

void loop() {
  // Check for WiFi reconnection
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi disconnected! Reconnecting...");
    WiFi.begin(ssid, password);
    delay(5000);
    return;
  }
  
  // Read RFID/NFC card
  uint8_t uid[] = { 0, 0, 0, 0, 0, 0, 0 };
  uint8_t uidLength;
  
  if (nfc.readPassiveTargetID(PN532_MIFARE_ISO14443A, uid, &uidLength, 100)) {
    // Convert UID to hex string
    String cardUID = "";
    for (uint8_t i = 0; i < uidLength; i++) {
      if (uid[i] < 0x10) cardUID += "0";
      cardUID += String(uid[i], HEX);
    }
    cardUID.toUpperCase();
    
    // Debounce: ignore same card for 2 seconds
    unsigned long currentTime = millis();
    if (cardUID != lastCardUID || (currentTime - lastReadTime > DEBOUNCE_TIME)) {
      lastCardUID = cardUID;
      lastReadTime = currentTime;
      
      Serial.print("Card detected: ");
      Serial.println(cardUID);
      
      // Send card tap to backend
      handleCardTap(cardUID);
      
      // Small delay before next read
      delay(500);
    }
  }
  
  // Send heartbeat every 30 seconds
  unsigned long currentTime = millis();
  if (currentTime - lastHeartbeat > HEARTBEAT_INTERVAL) {
    sendHeartbeat();
    lastHeartbeat = currentTime;
  }
  
  delay(100);  // Small delay in main loop
}

// ============================================
// DEVICE AUTHENTICATION
// ============================================

bool authenticateDevice() {
  HTTPClient http;
  String url = String(apiUrl) + "/api/devices/auth";
  
  http.begin(url);
  http.addHeader("Content-Type", "application/json");
  
  // Create JSON payload
  StaticJsonDocument<256> doc;
  doc["apiKey"] = apiKey;
  
  String jsonPayload;
  serializeJson(doc, jsonPayload);
  
  Serial.print("Auth URL: ");
  Serial.println(url);
  Serial.print("Auth Payload: ");
  Serial.println(jsonPayload);
  
  int httpCode = http.POST(jsonPayload);
  
  bool success = false;
  if (httpCode == 200) {
    String response = http.getString();
    Serial.print("Auth Response: ");
    Serial.println(response);
    
    // Parse response
    StaticJsonDocument<512> responseDoc;
    DeserializationError error = deserializeJson(responseDoc, response);
    
    if (!error && responseDoc["success"] == true) {
      success = true;
      Serial.println("Device authenticated!");
    }
  } else {
    Serial.print("Auth failed! HTTP Code: ");
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
// HEARTBEAT (Status Update)
// ============================================

void sendHeartbeat() {
  HTTPClient http;
  String url = String(apiUrl) + "/api/devices/" + String(deviceId) + "/status";
  
  http.begin(url);
  http.addHeader("Content-Type", "application/json");
  
  // Get WiFi signal strength
  int signalStrength = WiFi.RSSI();
  
  // Create JSON payload
  StaticJsonDocument<256> doc;
  doc["status"] = "online";
  doc["metrics"]["signalStrength"] = signalStrength;
  doc["metrics"]["batteryLevel"] = 100;  // Update if you have battery monitoring
  
  String jsonPayload;
  serializeJson(doc, jsonPayload);
  
  int httpCode = http.POST(jsonPayload);
  
  if (httpCode == 200) {
    Serial.println("✓ Heartbeat sent");
  } else {
    Serial.print("✗ Heartbeat failed! HTTP Code: ");
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
  
  // Create JSON payload
  StaticJsonDocument<512> doc;
  doc["cardUID"] = cardUID;
  doc["deviceId"] = deviceId;
  doc["deviceLocation"] = deviceLocation;
  
  // For payment devices, add amount:
  // doc["amount"] = 500;
  // doc["description"] = "Lunch purchase";
  
  String jsonPayload;
  serializeJson(doc, jsonPayload);
  
  Serial.print("Card Tap URL: ");
  Serial.println(url);
  Serial.print("Card Tap Payload: ");
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
      // Success feedback
      Serial.println("✓ Card tap successful!");
      blinkLED(LED_GREEN, 1);
      beep(BUZZER, 1000, 200);  // High beep for success
      
      // For payment devices, you can extract balance:
      // float balance = responseDoc["data"]["data"]["transaction"]["balanceAfter"];
      // Serial.print("New Balance: ");
      // Serial.println(balance);
      
    } else {
      // Error in response
      Serial.println("✗ Card tap failed!");
      String errorMsg = responseDoc["message"] | "Unknown error";
      Serial.print("Error: ");
      Serial.println(errorMsg);
      blinkLED(LED_RED, 2);
      beep(BUZZER, 500, 500);  // Low beep for error
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
    blinkLED(LED_RED, 3);
    beep(BUZZER, 300, 1000);  // Long low beep for network error
  }
  
  http.end();
}

// ============================================
// HELPER FUNCTIONS
// ============================================

void blinkLED(int pin, int times) {
  for (int i = 0; i < times; i++) {
    digitalWrite(pin, HIGH);
    delay(200);
    digitalWrite(pin, LOW);
    delay(200);
  }
}

void beep(int pin, int frequency, int duration) {
  // Simple beep using tone (if buzzer supports it)
  // For passive buzzer:
  tone(pin, frequency, duration);
  // For active buzzer, just use digitalWrite:
  // digitalWrite(pin, HIGH);
  // delay(duration);
  // digitalWrite(pin, LOW);
}
```

---

## 🔐 Phase 4: Device Registration

### Step 1: Register Device via Admin Panel

1. **Login** to EduTap Admin Dashboard
2. Navigate to **Devices** section
3. Click **"+ Register Device"** button
4. Fill in the form:
   - **Device ID**: `rfid-gate-001` (unique, use descriptive names)
   - **Name**: `Main Entrance Gate`
   - **Device Type**: 
     - `attendance_reader` (for gates/entrances)
     - `pos` (for canteen/payment devices)
   - **School**: Select the school
   - **Location**: 
     - Zone: `Entrance`
     - Building: `Main Building`
     - Floor: `Ground Floor`
     - Room: `Main Entrance`
   - **Capabilities**: Select `nfc` (or `rfid`)
5. Click **"Register Device"**
6. **IMPORTANT**: Copy and save the **API Key** and **Secret Key** shown after registration

### Step 2: Update Firmware with Credentials

1. Open your Arduino sketch
2. Update these lines in the code:
   ```cpp
   const char* deviceId = "rfid-gate-001";  // Your device ID
   const char* apiKey = "a1b2c3d4e5f6...";  // API key from registration
   ```
3. Update WiFi credentials:
   ```cpp
   const char* ssid = "SchoolWiFi";
   const char* password = "SchoolPassword";
   ```
4. Update backend URL:
   ```cpp
   const char* apiUrl = "http://192.168.1.100:5001";  // Your backend URL
   ```
5. **Upload** the code to ESP32

---

## 🧪 Phase 5: Testing

### Testing Checklist

#### 1. Hardware Test
- [ ] ESP32 powers on (LED on board lights up)
- [ ] PN532 module detected (check Serial Monitor for firmware version)
- [ ] Can read RFID card (card UID appears in Serial Monitor)

#### 2. WiFi Test
- [ ] ESP32 connects to WiFi (Serial Monitor shows "WiFi connected!")
- [ ] IP address obtained and displayed
- [ ] Can ping backend server from ESP32 network

#### 3. Authentication Test
- [ ] Device authenticates successfully (Serial Monitor shows "✓ Device authenticated")
- [ ] Device appears as "online" in admin panel
- [ ] No HTTP errors in Serial Monitor

#### 4. Heartbeat Test
- [ ] Heartbeat sent every 30 seconds (check Serial Monitor)
- [ ] Device status stays "online" in admin panel
- [ ] "Last Seen" timestamp updates in admin panel

#### 5. Card Tap Test
- [ ] Card detected and UID extracted correctly
- [ ] Card tap request sent to backend (check Serial Monitor)
- [ ] Backend responds with success (HTTP 200)
- [ ] LED/buzzer feedback works (green LED + beep for success)
- [ ] Attendance/payment recorded in database (check admin panel)

### Common Issues & Solutions

#### ❌ **PN532 Not Found**
- **Check**: Wiring connections (VCC, GND, SDA, SCL)
- **Check**: I2C address (try scanning with I2C scanner)
- **Solution**: Verify PN532 is powered (3.3V, not 5V)

#### ❌ **WiFi Connection Failed**
- **Check**: SSID and password are correct
- **Check**: WiFi is 2.4GHz (ESP32 doesn't support 5GHz)
- **Check**: Signal strength (should be > -70 dBm)
- **Solution**: Move closer to router or use WiFi extender

#### ❌ **Device Authentication Failed**
- **Check**: `deviceId` matches registered device ID exactly
- **Check**: `apiKey` is correct (copy-paste from registration)
- **Check**: Backend URL is correct (no trailing slash)
- **Solution**: Re-register device and get new API key

#### ❌ **Card Tap Returns Error**
- **Check**: Card UID format (should be uppercase hex, e.g., "CARD789012")
- **Check**: Student card is registered and active in database
- **Check**: Device status is "online" in admin panel
- **Solution**: Test with a registered student card

#### ❌ **HTTP Connection Timeout**
- **Check**: Backend server is running
- **Check**: Backend URL is correct (IP address for local network)
- **Check**: ESP32 and backend are on same network
- **Check**: Firewall allows connections on port 5001
- **Solution**: Test backend with Postman/curl first

---

## 🚀 Phase 6: Deployment

### Pre-Deployment Checklist
- [ ] All devices tested and working
- [ ] Device IDs are unique and descriptive
- [ ] All devices registered in admin panel
- [ ] API keys saved securely
- [ ] WiFi credentials configured
- [ ] Backend URL configured (production URL if deploying)

### Installation Steps
1. **Mount Devices** at school locations (gates, canteen, etc.)
2. **Power On** devices and verify WiFi connection
3. **Verify** devices appear as "online" in admin panel
4. **Test** with real student cards
5. **Monitor** device health in admin panel

### Maintenance Tasks
- **Daily**: Check device status in admin panel (should be "online")
- **Weekly**: Review device health scores
- **Monthly**: Check for firmware updates
- **As Needed**: Replace devices if faulty, update WiFi credentials

---

## 📊 Monitoring

### What to Monitor
1. **Device Status**: Should be "online" for active devices
2. **Last Seen**: Should update every 30 seconds
3. **Health Score**: Should be > 80 for healthy devices
4. **Card Tap Success Rate**: Should be > 95%

### Where to Check
- **Admin Panel**: Devices section shows all device statuses
- **Serial Monitor**: Real-time logs from ESP32
- **Backend Logs**: Check `backend/logs/` for API requests

---

## 📞 Support & Resources

### If You Need Help
1. **Check Serial Monitor** for error messages
2. **Check Backend Logs** for API errors
3. **Test API Endpoints** with Postman/curl
4. **Review** `backend/IOT_INTEGRATION_GUIDE.md` for detailed docs

### Useful Links
- **ESP32 Documentation**: https://docs.espressif.com/projects/esp-idf/
- **Adafruit PN532 Library**: https://github.com/adafruit/Adafruit-PN532
- **ArduinoJson Documentation**: https://arduinojson.org/

---

## ✅ Summary: What You Need to Do

1. ✅ **Assemble hardware** (ESP32 + PN532 + wiring)
2. ✅ **Install Arduino IDE** and ESP32 board support
3. ✅ **Install libraries** (ArduinoJson, Adafruit_PN532)
4. ✅ **Get backend URL** and WiFi credentials from team
5. ✅ **Copy firmware code** and update configuration
6. ✅ **Register device** in admin panel (get API key)
7. ✅ **Update firmware** with device credentials
8. ✅ **Upload code** to ESP32
9. ✅ **Test** all functionality
10. ✅ **Deploy** devices at school locations
11. ✅ **Monitor** device health regularly

---

**Last Updated**: 2024  
**For Questions**: Contact backend team or refer to `backend/IOT_INTEGRATION_GUIDE.md`


