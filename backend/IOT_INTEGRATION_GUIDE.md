# IoT Device Integration Guide for EduTap

This guide provides complete instructions for connecting RFID/NFC readers (IoT devices) to the EduTap backend system.

---

## 📋 Table of Contents

1. [Hardware Requirements](#hardware-requirements)
2. [Software/Firmware Requirements](#softwarefirmware-requirements)
3. [Connection Architecture](#connection-architecture)
4. [Step-by-Step Integration Procedure](#step-by-step-integration-procedure)
5. [Device Registration](#device-registration)
6. [Device Authentication](#device-authentication)
7. [Card Tap Implementation](#card-tap-implementation)
8. [IoT Device Code Examples](#iot-device-code-examples)
9. [Backend API Endpoints](#backend-api-endpoints)
10. [Testing & Troubleshooting](#testing--troubleshooting)

---

## 🔧 Hardware Requirements

### For Attendance Devices (RFID/NFC Readers at Gates)
- **Microcontroller**: ESP32 or ESP8266
- **RFID Reader**: RC522 (MFRC522) or PN532 (NFC)
- **Power**: 5V USB or 12V adapter
- **Connectivity**: WiFi (2.4GHz)
- **Optional**: LED indicators, buzzer for feedback

### For Payment Devices (POS/Canteen Readers)
- **Microcontroller**: ESP32 (recommended for better performance)
- **RFID Reader**: RC522 (MFRC522) or PN532 (NFC)
- **Display**: 0.96" OLED or 16x2 LCD (optional, for showing balance)
- **Power**: 5V USB or 12V adapter
- **Connectivity**: WiFi (2.4GHz) or Ethernet
- **Optional**: Keypad for manual amount entry

### Recommended Components
- **ESP32 Development Board**: ESP32-WROOM-32 or ESP32-DevKitC
- **RFID Module**: MFRC522 (cheap, ~$2-3) or PN532 (better range, ~$5-8)
- **Power Supply**: 5V 2A USB adapter
- **Enclosure**: Weatherproof box for outdoor gates

---

## 💻 Software/Firmware Requirements

### For ESP32/ESP8266
- **Arduino IDE** (v1.8.19+) or **PlatformIO**
- **Libraries**:
  - `WiFi` (built-in)
  - `HTTPClient` (built-in)
  - `ArduinoJson` (v6.x) - for JSON parsing
  - `MFRC522` or `Adafruit_PN532` - for RFID/NFC
  - `SPI` (built-in) - for RFID communication

### Installation
```bash
# In Arduino IDE Library Manager, install:
1. ArduinoJson by Benoit Blanchon (v6.21.3)
2. MFRC522 by GithubCommunity (for RC522)
   OR
   Adafruit PN532 by Adafruit (for PN532)
```

---

## 🏗️ Connection Architecture

```
┌─────────────────┐
│  RFID/NFC Card  │
└────────┬────────┘
         │
         │ (RFID/NFC Signal)
         │
┌────────▼────────┐         WiFi/HTTP         ┌──────────────────┐
│   ESP32 Device  │ ──────────────────────────► │  EduTap Backend  │
│                 │                             │   (Node.js API)  │
│  - RFID Reader  │ ◄────────────────────────── │                  │
│  - WiFi Module  │         JSON Response       │  - MongoDB       │
│  - Firmware     │                             │  - Socket.io     │
└─────────────────┘                             └──────────────────┘
```

### Data Flow
1. **Card Tap** → ESP32 reads card UID
2. **HTTP Request** → ESP32 sends card UID + device info to backend
3. **Backend Processing** → Validates card, processes attendance/payment
4. **Response** → Backend sends success/error + balance (for payments)
5. **Device Feedback** → ESP32 shows LED/buzzer feedback

---

## 📝 Step-by-Step Integration Procedure

### Phase 1: Device Registration (One-time setup)

#### Step 1: Register Device via Admin Panel or API

**Option A: Via Admin Panel (Recommended)**
1. Login as admin
2. Navigate to "Devices" section
3. Click "Add New Device"
4. Fill in device details:
   - **Device ID**: `rfid-gate-001` (unique identifier)
   - **Name**: `Main Entrance Gate`
   - **Device Type**: `attendance_reader` or `pos`
   - **School**: Select school
   - **Location**: Building, floor, room, zone
   - **Capabilities**: `rfid` or `nfc`

**Option B: Via API (for automation)**
```bash
POST http://your-backend-url/api/devices/register
Authorization: Bearer YOUR_ADMIN_TOKEN
Content-Type: application/json

{
  "deviceId": "rfid-gate-001",
  "name": "Main Entrance Gate",
  "deviceType": "attendance_reader",
  "schoolId": "6942c83c61e18873521275bb",
  "location": {
    "building": "Main Building",
    "floor": "Ground Floor",
    "room": "Entrance",
    "zone": "entrance"
  },
  "capabilities": ["rfid"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Device registered successfully",
  "data": {
    "success": true,
    "device": {
      "id": "...",
      "deviceId": "rfid-gate-001",
      "name": "Main Entrance Gate",
      "deviceType": "attendance_reader",
      "apiKey": "a1b2c3d4e5f6...",  // ⚠️ SAVE THIS!
      "secretKey": "x9y8z7w6v5u4...",  // ⚠️ SAVE THIS!
      "status": "offline"
    }
  }
}
```

**⚠️ IMPORTANT**: Save the `apiKey` and `secretKey` - you'll need them in your firmware!

---

### Phase 2: Firmware Configuration

#### Step 2: Configure WiFi and API Endpoint

In your ESP32 firmware, set these constants:

```cpp
// WiFi Credentials
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// Backend API URL
const char* apiUrl = "http://your-backend-url";  // e.g., "http://192.168.1.100:5001"
// OR for production:
// const char* apiUrl = "https://api.edutap.com";

// Device Credentials (from registration)
const char* deviceId = "rfid-gate-001";
const char* apiKey = "a1b2c3d4e5f6...";  // From registration response
```

---

### Phase 3: Device Authentication & Heartbeat

#### Step 3: Implement Authentication on Device Startup

Your ESP32 should authenticate on boot:

```cpp
bool authenticateDevice() {
  HTTPClient http;
  http.begin(apiUrl + "/api/devices/auth");
  http.addHeader("Content-Type", "application/json");
  
  String jsonPayload = "{\"apiKey\":\"" + String(apiKey) + "\"}";
  int httpCode = http.POST(jsonPayload);
  
  if (httpCode == 200) {
    String response = http.getString();
    // Parse response to get device info
    http.end();
    return true;
  }
  
  http.end();
  return false;
}
```

#### Step 4: Implement Heartbeat (Status Updates)

Send periodic status updates to keep device "online":

```cpp
void sendHeartbeat() {
  HTTPClient http;
  http.begin(apiUrl + "/api/devices/" + String(deviceId) + "/status");
  http.addHeader("Content-Type", "application/json");
  
  // Get battery level, signal strength, etc.
  int batteryLevel = 100;  // Read from battery monitor if available
  int signalStrength = WiFi.RSSI();
  
  String jsonPayload = "{"
    "\"status\":\"online\","
    "\"metrics\":{"
      "\"batteryLevel\":" + String(batteryLevel) + ","
      "\"signalStrength\":" + String(signalStrength) +
    "}"
  "}";
  
  http.POST(jsonPayload);
  http.end();
}

// Call this every 30 seconds
void loop() {
  // ... other code ...
  
  static unsigned long lastHeartbeat = 0;
  if (millis() - lastHeartbeat > 30000) {  // 30 seconds
    sendHeartbeat();
    lastHeartbeat = millis();
  }
}
```

---

### Phase 4: Card Tap Implementation

#### Step 5: Read Card UID and Send to Backend

When a card is detected:

```cpp
void handleCardTap(String cardUID) {
  HTTPClient http;
  http.begin(apiUrl + "/api/card/tap");
  http.addHeader("Content-Type", "application/json");
  
  // For attendance device
  String jsonPayload = "{"
    "\"cardUID\":\"" + cardUID + "\","
    "\"deviceId\":\"" + String(deviceId) + "\","
    "\"deviceLocation\":\"Main Entrance\""
  "}";
  
  // For payment device (POS/canteen)
  // String jsonPayload = "{"
  //   "\"cardUID\":\"" + cardUID + "\","
  //   "\"deviceId\":\"" + String(deviceId) + "\","
  //   "\"deviceLocation\":\"Main Canteen\","
  //   "\"amount\":500,"
  //   "\"description\":\"Lunch purchase\""
  // "}";
  
  int httpCode = http.POST(jsonPayload);
  
  if (httpCode == 200) {
    String response = http.getString();
    // Parse response
    StaticJsonDocument<512> doc;
    deserializeJson(doc, response);
    
    bool success = doc["success"];
    if (success) {
      // Show success feedback (LED green, buzzer beep)
      digitalWrite(LED_GREEN, HIGH);
      tone(BUZZER, 1000, 200);
      
      // For payment devices, show balance
      if (doc["data"]["type"] == "payment") {
        float balance = doc["data"]["data"]["newBalance"];
        // Display on LCD/OLED if available
      }
    } else {
      // Show error feedback (LED red, buzzer long beep)
      digitalWrite(LED_RED, HIGH);
      tone(BUZZER, 500, 500);
    }
  } else {
    // Network error
    digitalWrite(LED_RED, HIGH);
    tone(BUZZER, 300, 1000);
  }
  
  http.end();
}
```

---

## 🔐 Device Authentication

### Authentication Flow

```
┌──────────┐                    ┌──────────┐
│  ESP32   │                    │ Backend  │
└────┬─────┘                    └────┬─────┘
     │                               │
     │ 1. POST /api/devices/auth    │
     │    { "apiKey": "..." }       │
     ├──────────────────────────────►│
     │                               │
     │ 2. Validate API key           │
     │    Check device status        │
     │                               │
     │ 3. Response:                  │
     │    { "success": true,         │
     │      "device": {...} }        │
     │◄──────────────────────────────┤
     │                               │
     │ 4. Store device info          │
     │    Start heartbeat            │
     │                               │
```

### Current Implementation

The backend already has device authentication built-in:

**Endpoint**: `POST /api/devices/auth`

**Request:**
```json
{
  "apiKey": "your-device-api-key"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Device authenticated successfully",
  "data": {
    "success": true,
    "device": {
      "id": "...",
      "deviceId": "rfid-gate-001",
      "name": "Main Entrance Gate",
      "schoolId": "...",
      "schoolName": "Sunrise Elementary School",
      "capabilities": ["rfid"],
      "location": {...}
    }
  }
}
```

---

## 📡 Card Tap Implementation

### Unified Card Tap Endpoint

The backend automatically routes card taps to attendance or payment based on device type:

**Endpoint**: `POST /api/card/tap`

**For Attendance Devices:**
```json
{
  "cardUID": "CARD789012",
  "deviceId": "rfid-gate-001",
  "deviceLocation": "Main Entrance"
}
```

**For Payment Devices (POS/Canteen):**
```json
{
  "cardUID": "CARD789012",
  "deviceId": "pos-canteen-001",
  "deviceLocation": "Main Canteen",
  "amount": 500,
  "description": "Lunch purchase"
}
```

**Response (Attendance):**
```json
{
  "success": true,
  "message": "Attendance processed successfully",
  "data": {
    "type": "attendance",
    "success": true,
    "data": {
      "student": {...},
      "attendance": {...}
    }
  }
}
```

**Response (Payment):**
```json
{
  "success": true,
  "message": "Payment processed successfully",
  "data": {
    "type": "payment",
    "success": true,
    "data": {
      "transaction": {...},
      "newBalance": 1500
    }
  }
}
```

---

## 💾 IoT Device Code Examples

### Complete ESP32 + MFRC522 Example (Attendance Device)

```cpp
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <SPI.h>
#include <MFRC522.h>

// WiFi Configuration
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// Backend API
const char* apiUrl = "http://192.168.1.100:5001";  // Change to your backend URL
const char* deviceId = "rfid-gate-001";
const char* apiKey = "your-api-key-from-registration";

// RFID Configuration
#define SS_PIN 5   // ESP32 pin GPIO5
#define RST_PIN 4  // ESP32 pin GPIO4
MFRC522 mfrc522(SS_PIN, RST_PIN);

// LED Pins
#define LED_GREEN 2
#define LED_RED 15
#define BUZZER 16

String lastCardUID = "";
unsigned long lastReadTime = 0;

void setup() {
  Serial.begin(115200);
  
  // Initialize RFID
  SPI.begin();
  mfrc522.PCD_Init();
  
  // Initialize LEDs and Buzzer
  pinMode(LED_GREEN, OUTPUT);
  pinMode(LED_RED, OUTPUT);
  pinMode(BUZZER, OUTPUT);
  
  // Connect to WiFi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected!");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
  
  // Authenticate device
  if (authenticateDevice()) {
    Serial.println("Device authenticated!");
    digitalWrite(LED_GREEN, HIGH);
    delay(1000);
    digitalWrite(LED_GREEN, LOW);
  } else {
    Serial.println("Device authentication failed!");
    digitalWrite(LED_RED, HIGH);
  }
  
  // Send initial heartbeat
  sendHeartbeat();
}

void loop() {
  // Check for new card
  if (mfrc522.PICC_IsNewCardPresent() && mfrc522.PICC_ReadCardSerial()) {
    // Get card UID
    String cardUID = "";
    for (byte i = 0; i < mfrc522.uid.size; i++) {
      if (mfrc522.uid.uidByte[i] < 0x10) cardUID += "0";
      cardUID += String(mfrc522.uid.uidByte[i], HEX);
    }
    cardUID.toUpperCase();
    
    // Prevent duplicate reads (debounce)
    if (cardUID != lastCardUID || (millis() - lastReadTime > 2000)) {
      lastCardUID = cardUID;
      lastReadTime = millis();
      
      Serial.println("Card detected: " + cardUID);
      
      // Send card tap to backend
      handleCardTap(cardUID);
    }
    
    mfrc522.PICC_HaltA();
  }
  
  // Send heartbeat every 30 seconds
  static unsigned long lastHeartbeat = 0;
  if (millis() - lastHeartbeat > 30000) {
    sendHeartbeat();
    lastHeartbeat = millis();
  }
  
  delay(100);
}

bool authenticateDevice() {
  HTTPClient http;
  String url = String(apiUrl) + "/api/devices/auth";
  http.begin(url);
  http.addHeader("Content-Type", "application/json");
  
  String jsonPayload = "{\"apiKey\":\"" + String(apiKey) + "\"}";
  int httpCode = http.POST(jsonPayload);
  
  bool success = false;
  if (httpCode == 200) {
    String response = http.getString();
    Serial.println("Auth response: " + response);
    success = true;
  } else {
    Serial.println("Auth failed, HTTP code: " + String(httpCode));
  }
  
  http.end();
  return success;
}

void sendHeartbeat() {
  HTTPClient http;
  String url = String(apiUrl) + "/api/devices/" + String(deviceId) + "/status";
  http.begin(url);
  http.addHeader("Content-Type", "application/json");
  
  int signalStrength = WiFi.RSSI();
  
  String jsonPayload = "{"
    "\"status\":\"online\","
    "\"metrics\":{"
      "\"signalStrength\":" + String(signalStrength) +
    "}"
  "}";
  
  int httpCode = http.POST(jsonPayload);
  if (httpCode == 200) {
    Serial.println("Heartbeat sent");
  }
  
  http.end();
}

void handleCardTap(String cardUID) {
  HTTPClient http;
  String url = String(apiUrl) + "/api/card/tap";
  http.begin(url);
  http.addHeader("Content-Type", "application/json");
  
  String jsonPayload = "{"
    "\"cardUID\":\"" + cardUID + "\","
    "\"deviceId\":\"" + String(deviceId) + "\","
    "\"deviceLocation\":\"Main Entrance\""
  "}";
  
  int httpCode = http.POST(jsonPayload);
  
  if (httpCode == 200) {
    String response = http.getString();
    Serial.println("Response: " + response);
    
    // Parse JSON response
    StaticJsonDocument<512> doc;
    DeserializationError error = deserializeJson(doc, response);
    
    if (!error && doc["success"] == true) {
      // Success feedback
      digitalWrite(LED_GREEN, HIGH);
      tone(BUZZER, 1000, 200);
      delay(500);
      digitalWrite(LED_GREEN, LOW);
    } else {
      // Error feedback
      digitalWrite(LED_RED, HIGH);
      tone(BUZZER, 500, 500);
      delay(500);
      digitalWrite(LED_RED, LOW);
    }
  } else {
    // Network error
    Serial.println("HTTP Error: " + String(httpCode));
    digitalWrite(LED_RED, HIGH);
    tone(BUZZER, 300, 1000);
    delay(500);
    digitalWrite(LED_RED, LOW);
  }
  
  http.end();
}
```

### ESP32 + PN532 (NFC) Example

Similar to above, but replace MFRC522 with:

```cpp
#include <Adafruit_PN532.h>

#define PN532_IRQ   4
#define PN532_RESET 5

Adafruit_PN532 nfc(PN532_IRQ, PN532_RESET);

void setup() {
  nfc.begin();
  uint32_t versiondata = nfc.getFirmwareVersion();
  if (!versiondata) {
    Serial.println("PN532 not found!");
    while (1);
  }
  nfc.SAMConfig();
}

void loop() {
  uint8_t uid[] = { 0, 0, 0, 0, 0, 0, 0 };
  uint8_t uidLength;
  
  if (nfc.readPassiveTargetID(PN532_MIFARE_ISO14443A, uid, &uidLength)) {
    String cardUID = "";
    for (uint8_t i = 0; i < uidLength; i++) {
      if (uid[i] < 0x10) cardUID += "0";
      cardUID += String(uid[i], HEX);
    }
    cardUID.toUpperCase();
    
    handleCardTap(cardUID);
    delay(1000);
  }
}
```

---

## 🔌 Backend API Endpoints

### Device Management

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/devices/register` | Register new device | Admin Token |
| `POST` | `/api/devices/auth` | Authenticate device | API Key |
| `POST` | `/api/devices/:deviceId/status` | Update device status (heartbeat) | API Key |
| `GET` | `/api/devices/:deviceId/health` | Get device health | API Key |
| `GET` | `/api/devices/:deviceId` | Get device details | API Key |
| `PUT` | `/api/devices/:deviceId/config` | Update device config | API Key |

### Card Operations

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/card/tap` | Process card tap (attendance/payment) | None (device auth via deviceId) |
| `GET` | `/api/card/device/:deviceId/action` | Get device action type | None |

### Example: Device Status Update (Heartbeat)

```bash
POST http://your-backend-url/api/devices/rfid-gate-001/status
Content-Type: application/json

{
  "status": "online",
  "metrics": {
    "batteryLevel": 85,
    "signalStrength": -45
  }
}
```

---

## 🧪 Testing & Troubleshooting

### Testing Checklist

1. **Device Registration**
   - [ ] Device registered successfully
   - [ ] API key and secret key saved
   - [ ] Device appears in admin panel

2. **WiFi Connection**
   - [ ] ESP32 connects to WiFi
   - [ ] Can ping backend server
   - [ ] IP address obtained

3. **Device Authentication**
   - [ ] Authentication request succeeds
   - [ ] Device status changes to "online"
   - [ ] Device info received correctly

4. **Heartbeat**
   - [ ] Heartbeat sent every 30 seconds
   - [ ] Device stays "online" in backend
   - [ ] Last seen timestamp updates

5. **Card Reading**
   - [ ] RFID reader detects cards
   - [ ] Card UID extracted correctly
   - [ ] Card UID format matches backend (uppercase hex)

6. **Card Tap Processing**
   - [ ] Card tap request sent to backend
   - [ ] Backend responds with success/error
   - [ ] LED/buzzer feedback works
   - [ ] Attendance/payment recorded in database

### Common Issues & Solutions

#### Issue 1: Device Authentication Fails
**Symptoms**: HTTP 401, "Invalid API key"

**Solutions**:
- Verify API key is correct (copy-paste from registration)
- Check device is not "inactive" in database
- Ensure API key is sent in request body, not header

#### Issue 2: Card Tap Returns 400 Error
**Symptoms**: "Device not found" or "Card is not active"

**Solutions**:
- Verify `deviceId` matches registered device ID
- Check card UID format (should be uppercase hex, e.g., "CARD789012")
- Ensure student card is active in database
- Check device status is "online" or "maintenance"

#### Issue 3: WiFi Connection Issues
**Symptoms**: Cannot connect to WiFi, frequent disconnects

**Solutions**:
- Check WiFi credentials (SSID and password)
- Ensure 2.4GHz network (ESP32 doesn't support 5GHz)
- Check signal strength (should be > -70 dBm)
- Add WiFi reconnection logic:
  ```cpp
  if (WiFi.status() != WL_CONNECTED) {
    WiFi.begin(ssid, password);
    delay(5000);
  }
  ```

#### Issue 4: Backend Not Reachable
**Symptoms**: HTTP connection timeout, cannot reach API

**Solutions**:
- Verify backend URL is correct (no trailing slash)
- Check backend server is running
- Test with `curl` or Postman first
- For local network, use IP address (e.g., `http://192.168.1.100:5001`)
- Check firewall settings
- Ensure ESP32 and backend are on same network

#### Issue 5: Duplicate Card Reads
**Symptoms**: Same card triggers multiple requests

**Solutions**:
- Implement debouncing (wait 2 seconds between reads)
- Track last card UID and ignore duplicates
- Use `PICC_HaltA()` after reading card

#### Issue 6: Device Status Shows "Offline"
**Symptoms**: Device works but shows offline in admin panel

**Solutions**:
- Ensure heartbeat is sent every 30 seconds
- Check heartbeat endpoint is correct
- Verify device status update succeeds (HTTP 200)
- Check device `lastSeen` timestamp updates

---

## 🔒 Security Considerations

1. **API Key Storage**
   - Store API key in ESP32's EEPROM or flash (not hardcoded)
   - Use secure storage if possible
   - Rotate API keys periodically

2. **HTTPS (Production)**
   - Use HTTPS for production deployments
   - Add SSL certificate validation in ESP32 code
   - Use `WiFiClientSecure` instead of `HTTPClient`

3. **Network Security**
   - Use WPA2/WPA3 WiFi encryption
   - Consider VLAN isolation for IoT devices
   - Implement firewall rules

4. **Device Validation**
   - Backend validates device ID and API key
   - Rate limiting prevents abuse
   - Device status checked before processing

---

## 📊 Monitoring & Maintenance

### Device Health Monitoring

The backend tracks device health automatically:
- **Status**: online, offline, maintenance, faulty, inactive
- **Last Seen**: Timestamp of last heartbeat
- **Health Score**: Calculated based on status, battery, signal, uptime
- **Statistics**: Total scans, successful scans, uptime

### Admin Panel Features

- View all devices and their status
- See device health scores
- Monitor device activity logs
- Update device configuration remotely
- Deactivate/reactivate devices

---

## 🚀 Next Steps

1. **Hardware Setup**
   - Purchase ESP32 and RFID reader
   - Assemble hardware components
   - Test RFID reading locally

2. **Firmware Development**
   - Install Arduino IDE and libraries
   - Load example code
   - Configure WiFi and API credentials
   - Upload to ESP32

3. **Device Registration**
   - Register device via admin panel or API
   - Save API key securely

4. **Testing**
   - Test authentication
   - Test heartbeat
   - Test card tap with real student cards
   - Verify data in database

5. **Deployment**
   - Install devices at school locations
   - Configure network access
   - Monitor device health
   - Train staff on device management

---

## 📞 Support

For issues or questions:
- Check backend logs: `backend/logs/`
- Review device logs in admin panel
- Test API endpoints with Postman
- Check device health scores

---

## 📚 Additional Resources

- **ESP32 Documentation**: https://docs.espressif.com/projects/esp-idf/
- **MFRC522 Library**: https://github.com/miguelbalboa/rfid
- **ArduinoJson**: https://arduinojson.org/
- **Backend API Docs**: See `backend/API_DOCUMENTATION.md`

---

**Last Updated**: 2024
**Version**: 1.0




