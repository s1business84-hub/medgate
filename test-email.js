const nodemailer = require('nodemailer');
require('dotenv').config({ path: '.env.local' });

async function testEmail() {
  console.log('SMTP Configuration:');
  console.log('Host:', process.env.SMTP_HOST);
  console.log('Port:', process.env.SMTP_PORT);
  console.log('User:', process.env.SMTP_USER);
  console.log('Pass:', process.env.SMTP_PASS ? '***' + process.env.SMTP_PASS.slice(-4) : 'NOT SET');
  console.log('Secure:', process.env.SMTP_SECURE);

  if (!process.env.SMTP_HOST || !process.env.SMTP_PORT || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.error('ERROR: Missing SMTP configuration!');
    process.exit(1);
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true' || Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  console.log('\nVerifying SMTP connection...');
  
  try {
    await transporter.verify();
    console.log('✓ SMTP connection verified successfully!');
    
    console.log('\nSending test email...');
    const info = await transporter.sendMail({
      from: 'helloelectivio@gmail.com',
      to: process.env.SMTP_USER, // Send to self for testing
      subject: 'Electivio Test Email',
      text: 'This is a test email from Electivio.',
      html: '<p>This is a test email from <strong>Electivio</strong>.</p>',
    });
    
    console.log('✓ Email sent successfully!');
    console.log('Message ID:', info.messageId);
  } catch (error) {
    console.error('✗ Error:', error.message);
    console.error('Full error:', error);
  }
}

testEmail();
