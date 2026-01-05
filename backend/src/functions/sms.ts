import axios from 'axios';

// Simple function to send SMS using Africa's Talking API
// You can easily switch to Twilio by changing this function
// export async function sendSMS(phoneNumber: string, message: string) {
//   try {
//     // Africa's Talking configuration
//     const apiKey = process.env.AFRICAS_TALKING_API_KEY;
//     const username = process.env.AFRICAS_TALKING_USERNAME;
    
//     if (!apiKey || !username) {
//       console.error('SMS credentials not configured');
//       return { success: false, error: 'SMS credentials not configured' };
//     }

//     // Send SMS via Africa's Talking
//     const response = await axios.post(
//       'https://api.africastalking.com/version1/messaging',
//       {
//         username: username,
//         to: phoneNumber,
//         message: message
//       },
//       {
//         headers: {
//           'apiKey': apiKey,
//           'Content-Type': 'application/x-www-form-urlencoded'
//         }
//       }
//     );

//     console.log('SMS sent successfully:', response.data);
//     return { success: true, data: response.data };
    
//   } catch (error: any) {
//     console.error('Error sending SMS:', error.message);
//     return { success: false, error: error.message };
//   }
// }

// Alternative: Simple function to send SMS using Twilio
// Uncomment this if you prefer Twilio

export async function sendSMS(phoneNumber: string, message: string) {
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_PHONE_NUMBER;
    
    if (!accountSid || !authToken || !fromNumber) {
      console.error('Twilio credentials not configured');
      return { success: false, error: 'Twilio credentials not configured' };
    }

    const response = await axios.post(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      new URLSearchParams({
        To: phoneNumber,
        From: fromNumber,
        Body: message
      }),
      {
        auth: {
          username: accountSid,
          password: authToken
        }
      }
    );

    console.log('SMS sent successfully:', response.data);
    return { success: true, data: response.data };
    
  } catch (error: any) {
    console.error('Error sending SMS:', error.message);
    const errorDetails = error.response?.data || error.message;
    console.error('SMS error details:', errorDetails);
    return { success: false, error: errorDetails };
  }
}

