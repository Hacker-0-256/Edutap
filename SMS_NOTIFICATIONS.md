# 📱 EduTap SMS Notification System

## Overview

Parents receive **all information via SMS**. No mobile app or web interface is needed for parents.

---

## 📨 SMS Notification Types

### 1. **Attendance Notification**
**Trigger**: When student taps card at attendance device

**Message Template**:
```
Hello [Parent First Name], your child [Student First Name] [Student Last Name] has arrived at school at [Time] on [Date]. - [School Name]
```

**Example**:
```
Hello John, your child Sarah Smith has arrived at school at 08:15 AM on 2024-12-03. - Green Valley School
```

**Frequency**: Real-time (immediately after card tap)

---

### 2. **Payment Transaction Notification**
**Trigger**: When student makes a purchase at canteen/merchant

**Message Template**:
```
Hello [Parent First Name], [Student First Name] made a purchase of [Amount] RWF at [Merchant Name] at [Time]. New balance: [Balance] RWF.
```

**Example**:
```
Hello John, Sarah made a purchase of 500 RWF at Canteen A at 10:30 AM. New balance: 2,000 RWF.
```

**Frequency**: Real-time (immediately after purchase)

---

### 3. **Low Balance Alert**
**Trigger**: When account balance falls below threshold (e.g., 500 RWF)

**Message Template**:
```
Hello [Parent First Name], [Student First Name]'s account balance is low: [Balance] RWF. Please top up to ensure uninterrupted service.
```

**Example**:
```
Hello John, Sarah's account balance is low: 300 RWF. Please top up to ensure uninterrupted service.
```

**Frequency**: Once per day when balance is low

---

### 4. **Top-up Confirmation**
**Trigger**: After successful top-up processing

**Message Template**:
```
Hello [Parent First Name], your top-up of [Amount] RWF for [Student First Name] was successful. New balance: [Balance] RWF.
```

**Example**:
```
Hello John, your top-up of 5,000 RWF for Sarah was successful. New balance: 5,300 RWF.
```

**Frequency**: Real-time (immediately after top-up)

---

### 5. **Top-up Failure Notification**
**Trigger**: When top-up payment fails

**Message Template**:
```
Hello [Parent First Name], your top-up of [Amount] RWF for [Student First Name] failed. Please try again or contact support at [School Phone].
```

**Example**:
```
Hello John, your top-up of 5,000 RWF for Sarah failed. Please try again or contact support at +250 788 123456.
```

**Frequency**: Real-time (immediately after failure)

---

### 6. **Card Status Alert**
**Trigger**: When card is deactivated, reactivated, or replaced

**Message Template**:
```
Hello [Parent First Name], [Student First Name]'s card has been [Action]. Please contact the school for details.
```

**Examples**:
```
Hello John, Sarah's card has been deactivated. Please contact the school for details.
Hello John, Sarah's card has been reactivated. Please contact the school for details.
Hello John, Sarah's card has been replaced. Please contact the school for details.
```

**Frequency**: Real-time (immediately after status change)

---

## ⚙️ SMS Configuration

### Parent Preferences

Each parent has SMS preferences:
- **receiveSMS**: Boolean (default: true)
- **phone**: String (required for SMS)
- **notificationTypes**: Array of enabled notification types
  - `attendance` - Attendance notifications
  - `payments` - Payment transaction notifications
  - `low_balance` - Low balance alerts
  - `topup` - Top-up confirmations
  - `card_status` - Card status alerts

### Admin Settings

Admin can configure:
- **SMS Provider**: Africa's Talking or Twilio
- **Low Balance Threshold**: Default 500 RWF
- **SMS Templates**: Customize message templates
- **Language**: English, Kinyarwanda, French
- **Daily Summary**: Optional daily summary SMS

---

## 🔧 Implementation

### Backend Integration

SMS notifications are already integrated in:
- `src/functions/attendance.ts` - Attendance SMS (currently disabled, needs re-enabling)
- `src/functions/payment.ts` - Payment SMS (to be added)
- `src/functions/topup.ts` - Top-up SMS (to be added)
- `src/functions/card.ts` - Card status SMS (to be added)

### SMS Service

Located in: `src/functions/sms.ts`

**Current Status**: 
- ✅ SMS service implemented
- ⚠️ Attendance SMS disabled (commented out)
- ❌ Payment SMS not implemented
- ❌ Top-up SMS not implemented
- ❌ Low balance alerts not implemented

---

## 📊 SMS Statistics

Admin dashboard should track:
- Total SMS sent
- SMS delivery status
- Failed SMS attempts
- SMS costs
- Parent opt-in/opt-out rates

---

## 💰 Cost Considerations

### Africa's Talking (Rwanda)
- ~10-15 RWF per SMS
- Bulk discounts available
- Reliable delivery

### Twilio
- ~$0.01-0.02 per SMS
- International support
- More expensive for local numbers

**Recommendation**: Use Africa's Talking for Rwanda-based schools

---

## 🎯 Best Practices

1. **Keep Messages Short**: SMS has 160 character limit
2. **Clear Information**: Include essential details only
3. **Actionable**: Tell parent what to do if needed
4. **Timely**: Send immediately for real-time events
5. **Respect Preferences**: Honor opt-out requests
6. **Error Handling**: Retry failed SMS, log errors
7. **Cost Management**: Monitor SMS costs, use bulk rates

---

## 📝 Message Templates (Admin Configurable)

### Template Variables
- `{parentFirstName}` - Parent's first name
- `{studentFirstName}` - Student's first name
- `{studentLastName}` - Student's last name
- `{studentFullName}` - Student's full name
- `{time}` - Time (HH:MM AM/PM)
- `{date}` - Date (YYYY-MM-DD)
- `{amount}` - Amount in RWF
- `{balance}` - Account balance in RWF
- `{merchantName}` - Merchant/canteen name
- `{schoolName}` - School name
- `{schoolPhone}` - School contact phone

### Example Templates

**Attendance**:
```
Hello {parentFirstName}, {studentFirstName} arrived at {time} on {date}. - {schoolName}
```

**Payment**:
```
{studentFirstName} purchased {amount} RWF at {merchantName}. Balance: {balance} RWF.
```

**Low Balance**:
```
Alert: {studentFirstName}'s balance is {balance} RWF. Please top up.
```

---

## 🚀 Next Steps

1. ✅ Re-enable attendance SMS (uncomment in attendance.ts)
2. ❌ Add payment SMS notifications
3. ❌ Add top-up SMS notifications
4. ❌ Add low balance alerts
5. ❌ Add card status SMS
6. ❌ Create SMS template management in admin dashboard
7. ❌ Add SMS statistics tracking

---

**Last Updated**: 2024  
**Status**: SMS system ready, needs integration with payment features

