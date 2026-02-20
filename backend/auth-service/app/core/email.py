
import aiosmtplib
from email.message import EmailMessage
from app.core.config import settings
from typing import Optional, List
import logging

logger = logging.getLogger(__name__)

async def send_email(
    subject: str,
    body: str,
    to_email: str,
    html_content: Optional[str] = None
):
    if not settings.EMAIL_ENABLED:
        logger.info(f"Email disabled. Would have sent: {subject} to {to_email}")
        return

    if not settings.SMTP_USER or not settings.SMTP_PASSWORD:
        logger.warning(f"SMTP credentials missing. Cannot send: {subject} to {to_email}")
        return

    message = EmailMessage()
    # Use SMTP_USER for from_addr if it's Gmail, as Gmail often rejects other from addresses
    from_addr = settings.SMTP_FROM
    if "gmail.com" in settings.SMTP_HOST.lower() and settings.SMTP_USER:
        from_addr = settings.SMTP_USER
        
    message["From"] = from_addr
    message["To"] = to_email
    message["Subject"] = subject
    message.set_content(body)

    if html_content:
        message.add_alternative(html_content, subtype="html")

    try:
        await aiosmtplib.send(
            message,
            hostname=settings.SMTP_HOST,
            port=settings.SMTP_PORT,
            username=settings.SMTP_USER,
            password=settings.SMTP_PASSWORD,
            use_tls=settings.SMTP_PORT == 465,
            start_tls=settings.SMTP_PORT == 587,
        )
        logger.info(f"Email sent successfully to {to_email}")
    except Exception as e:
        logger.error(f"Failed to send email to {to_email}: {e}")

async def send_otp_email(email: str, otp: str, first_name: str = "User"):
    subject = "Verify Your Transaction - SentinelX"
    body = f"Hello {first_name},\n\nYour OTP for transaction verification is: {otp}\n\nThis code will expire in 5 minutes. If you did not request this, please contact support immediately.\n\nBest regards,\nSentinelX Security Team"
    
    html = f"""
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #f8fafc;">
        <h2 style="color: #4f46e5; text-align: center;">SentinelX Security Verification</h2>
        <p>Hello <strong>{first_name}</strong>,</p>
        <p>A transaction verification was requested. Your One-Time Password (OTP) is:</p>
        <div style="background-color: #e2e8f0; padding: 15px; text-align: center; border-radius: 8px; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #1e293b; margin: 20px 0;">
            {otp}
        </div>
        <p style="font-size: 14px; color: #64748b;">This code will expire in 5 minutes. If you did not request this verification, please secure your account and contact us immediately.</p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0;">
        <p style="font-size: 12px; color: #94a3b8; text-align: center;">© 2026 SentinelX Banking. All rights reserved.</p>
    </div>
    """
    await send_email(subject, body, email, html_content=html)

async def send_welcome_email(email: str, first_name: str):
    subject = "Welcome to SentinelX Banking"
    body = f"Hello {first_name},\n\nWelcome to SentinelX! Your account has been successfully registered.\n\nYou can now log in and manage your finances securely.\n\nBest regards,\nSentinelX Team"
    
    html = f"""
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #f8fafc;">
        <h2 style="color: #4f46e5; text-align: center;">Welcome to SentinelX!</h2>
        <p>Hello <strong>{first_name}</strong>,</p>
        <p>We are excited to have you with us. Your registration is complete, and your digital banking account is now active.</p>
        <div style="text-align: center; margin: 30px 0;">
            <a href="http://localhost:5173/login" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Login to Your Dashboard</a>
        </div>
        <p>Manage your transactions, apply for loans, and monitor your savings with premium security.</p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0;">
        <p style="font-size: 12px; color: #94a3b8; text-align: center;">© 2026 SentinelX Banking. All rights reserved.</p>
    </div>
    """
    await send_email(subject, body, email, html_content=html)

async def send_status_update_email(email: str, first_name: str, item_type: str, status: str):
    subject = f"Update on your {item_type} - SentinelX"
    color = "#10b981" if status.lower() == "authorized" else "#f59e0b"
    
    body = f"Hello {first_name},\n\nYour {item_type} has been updated to: {status}.\n\nLog in to your dashboard to see more details.\n\nBest regards,\nSentinelX Team"
    
    html = f"""
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #f8fafc;">
        <h2 style="color: #4f46e5; text-align: center;">SentinelX Notification</h2>
        <p>Hello <strong>{first_name}</strong>,</p>
        <p>There is an update regarding your recent <strong>{item_type}</strong>.</p>
        <div style="padding: 10px 20px; text-align: center; border-radius: 8px; font-size: 18px; font-weight: bold; background-color: {color}20; color: {color}; margin: 20px 0;">
            Status: {status.upper()}
        </div>
        <p>Log in to your account for further steps or detailed information.</p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0;">
        <p style="font-size: 12px; color: #94a3b8; text-align: center;">© 2026 SentinelX Banking. All rights reserved.</p>
    </div>
    """
    await send_email(subject, body, email, html_content=html)

async def send_transaction_email(email: str, first_name: str, amount: float, recipient: str, tx_id: str, is_credit: bool = False):
    direction = "received" if is_credit else "sent"
    subject = f"Transaction Alert: {direction.capitalize()} ₹{amount:,.2f} - SentinelX"
    color = "#10b981" if is_credit else "#6366f1"
    
    body = f"Hello {first_name},\n\nYou have {direction} ₹{amount:,.2f} {'from' if is_credit else 'to'} {recipient}.\n\nTransaction ID: {tx_id}\n\nBest regards,\nSentinelX Team"
    
    html = f"""
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #f8fafc;">
        <h2 style="color: {color}; text-align: center;">Transaction {direction.capitalize()}</h2>
        <p>Hello <strong>{first_name}</strong>,</p>
        <p>This is a formal notification for your recent transaction.</p>
        <div style="background-color: {color}10; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; border: 1px solid {color}20;">
            <span style="font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: bold;">Amount</span><br>
            <span style="font-size: 32px; font-weight: bold; color: {color};">{'+' if is_credit else '-'} ₹{amount:,.2f}</span>
        </div>
        <div style="margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e2e8f0;">
                <span style="color: #64748b;">{'Sender' if is_credit else 'Recipient'}</span>
                <span style="font-weight: bold; color: #1e293b;">{recipient}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e2e8f0;">
                <span style="color: #64748b;">Transaction ID</span>
                <span style="font-weight: bold; font-family: monospace; color: #1e293b;">{tx_id}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 10px 0;">
                <span style="color: #64748b;">Date</span>
                <span style="font-weight: bold; color: #1e293b;">{datetime.now().strftime('%d %b %Y, %H:%M:%S')}</span>
            </div>
        </div>
        <p style="font-size: 14px; color: #64748b;">If you did not authorize this transaction, please lock your account immediately via the mobile app or web portal.</p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0;">
        <p style="font-size: 12px; color: #94a3b8; text-align: center;">© 2026 SentinelX Banking. All rights reserved.</p>
    </div>
    """
    await send_email(subject, body, email, html_content=html)

