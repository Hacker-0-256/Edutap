# IoT Integration Quick Reference

## 🚀 Quick Start (5 Steps)

### 1. Register Device
```bash
POST /api/devices/register
Authorization: Bearer YOUR_ADMIN_TOKEN

{
  "deviceId": "rfid-gate-001",
  "name": "Main Entrance Gate",
  "deviceType": "attendance_reader",  # or "pos" for payment
  "schoolId": "6942c83c61e18873521275bb",
  "location": {
    "building": "Main Building",
    "zone": "entrance"
  },
  "capabilities": ["rfid"]
}
```

**Save the `apiKey` from response!**

---

### 2. Configure ESP32 Firmware

Update these in `esp32_attendance_device.ino`:
```cpp
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
const char* apiUrl = "http://192.168.1.100:5001";
const char* deviceId = "rfid-gate-001";
const char* apiKey = "your-api-key-from-step-1";
```

---

### 3. Upload Firmware to ESP32

- Install Arduino IDE
- Install libraries: `ArduinoJson`, `MFRC522`
- Upload `esp32_attendance_device.ino`
- Monitor Serial output (115200 baud)

---

### 4. Test Authentication

ESP32 should automatically authenticate on boot. Check Serial Monitor:
```
✓ Device authenticated successfully!
Device ready! Waiting for cards...
```

---

### 5. Test Card Tap

Tap a student card. You should see:
```
Card detected: CARD789012
✓ Card tap processed successfully
```

---

## 📡 API Endpoints for IoT Devices

### Device Authentication
```
POST /api/devices/auth
Content-Type: application/json

{ "apiKey": "your-api-key" }
```

### Heartbeat (Status Update)
```
POST /api/devices/{deviceId}/status
Content-Type: application/json

{
  "status": "online",
  "metrics": {
    "signalStrength": -45,
    "batteryLevel": 85
  }
}
```

### Card Tap (Attendance)
```
POST /api/card/tap
Content-Type: application/json

{
  "cardUID": "CARD789012",
  "deviceId": "rfid-gate-001",
  "deviceLocation": "Main Entrance"
}
```

### Card Tap (Payment)
```
POST /api/card/tap
Content-Type: application/json

{
  "cardUID": "CARD789012",
  "deviceId": "pos-canteen-001",
  "deviceLocation": "Main Canteen",
  "amount": 500,
  "description": "Lunch purchase"
}
```

---

## 🔧 Device Types

| Device Type | Use Case | Endpoint Behavior |
|------------|----------|-------------------|
| `attendance_reader` | School gates | Records attendance |
| `rfid_reader` | General RFID | Records attendance |
| `esp32` | Custom ESP32 | Records attendance |
| `pos` | Canteen/POS | Processes payment |
| `canteen_reader` | Canteen | Processes payment |

---

## 🔑 Device Credentials

- **deviceId**: Unique identifier (e.g., `rfid-gate-001`)
- **apiKey**: Authentication key (from registration)
- **secretKey**: Not used in firmware (for admin use)

---

## 📊 Response Codes

| HTTP Code | Meaning | Action |
|-----------|---------|--------|
| 200 | Success | Show green LED, beep |
| 400 | Bad Request | Check card UID, device ID |
| 401 | Unauthorized | Check API key |
| 404 | Not Found | Device not registered |

---

## 🐛 Common Issues

### "Device not found"
- Check `deviceId` matches registration
- Verify device is registered in database

### "Invalid API key"
- Verify API key is correct
- Check device status is not "inactive"

### "Card is not active"
- Student card is deactivated
- Check card status in admin panel

### WiFi connection fails
- Check SSID and password
- Ensure 2.4GHz network (not 5GHz)
- Check signal strength

### Backend not reachable
- Verify backend URL is correct
- Check backend server is running
- Test with `curl` or Postman first
- Ensure same network (for local testing)

---

## 📁 File Locations

- **Integration Guide**: `backend/IOT_INTEGRATION_GUIDE.md`
- **Attendance Firmware**: `backend/iot-firmware/esp32_attendance_device.ino`
- **Payment Firmware**: `backend/iot-firmware/esp32_payment_device.ino`
- **API Documentation**: `backend/API_DOCUMENTATION.md`

---

## 🔌 Hardware Connections

### ESP32 + MFRC522 (RC522)
```
ESP32    →    MFRC522
GPIO5    →    SDA (SS)
GPIO4    →    RST
GPIO23   →    MOSI
GPIO19   →    MISO
GPIO18   →    SCK
3.3V     →    3.3V
GND      →    GND
```

### ESP32 + PN532 (NFC)
```
ESP32    →    PN532
GPIO4    →    IRQ
GPIO5    →    RESET
GPIO23   →    MOSI
GPIO19   →    MISO
GPIO18   →    SCK
3.3V     →    3.3V
GND      →    GND
```

---

## ⚡ Timing Configuration

- **Heartbeat Interval**: 30 seconds (default)
- **Card Debounce**: 2 seconds (prevents duplicate reads)
- **HTTP Timeout**: 5-10 seconds

---

## 🔒 Security Notes

1. **API Key Storage**: Store in EEPROM or secure storage (not hardcoded)
2. **HTTPS**: Use HTTPS in production (requires SSL certificate)
3. **Network**: Use WPA2/WPA3 WiFi encryption
4. **Validation**: Backend validates all requests

---

## 📞 Support

- Check Serial Monitor output
- Review backend logs
- Test API endpoints with Postman
- Check device health in admin panel

---

**Last Updated**: 2024




