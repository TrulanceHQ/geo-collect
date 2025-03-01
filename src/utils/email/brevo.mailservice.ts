// import { Injectable } from '@nestjs/common';
// import axios from 'axios';

// @Injectable()
// export class MailService {
//   private readonly brevoApiUrl = 'https://api.brevo.com/v3/smtp/email';
//   private readonly apiKey = 'YOUR_BREVO_API_KEY';

//   async sendEmail(to: string, subject: string, htmlContent: string) {
//     const data = {
//       sender: { email: 'your-email@example.com' },
//       to: [{ email: to }],
//       subject: subject,
//       htmlContent: htmlContent,
//     };

//     try {
//       const response = await axios.post(this.brevoApiUrl, data, {
//         headers: {
//           'api-key': this.apiKey,
//           'Content-Type': 'application/json',
//         },
//       });
//       return response.data;
//     } catch (error) {
//       throw new Error(`Failed to send email: ${error.message}`);
//     }
//   }
// }
