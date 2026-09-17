import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const awb = searchParams.get('awb') || 'DEL-9281734910';
  const orderNumber = searchParams.get('order') || 'SE-100234';

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Shipping Label - ${orderNumber} - ${awb}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      margin: 0;
      padding: 24px;
      background: #f5f5f5;
    }
    .label-box {
      max-width: 480px;
      margin: 0 auto;
      background: #ffffff;
      border: 2px solid #000000;
      padding: 20px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }
    .header {
      display: flex;
      justify-content: space-between;
      border-bottom: 2px solid #000;
      padding-bottom: 12px;
      margin-bottom: 14px;
    }
    .brand-title {
      font-size: 18px;
      font-weight: 800;
      letter-spacing: 1px;
    }
    .badge {
      font-size: 11px;
      font-weight: 700;
      padding: 3px 8px;
      background: #000;
      color: #fff;
      border-radius: 3px;
    }
    .barcode-container {
      text-align: center;
      border-bottom: 2px dashed #666;
      padding: 14px 0;
      margin-bottom: 14px;
    }
    .barcode-mock {
      font-family: monospace;
      font-size: 32px;
      letter-spacing: 8px;
      background: repeating-linear-gradient(90deg, #000, #000 3px, #fff 3px, #fff 6px);
      color: transparent;
      height: 48px;
      margin-bottom: 6px;
    }
    .awb-text {
      font-weight: 800;
      font-size: 16px;
      letter-spacing: 1.5px;
    }
    .address-section {
      font-size: 13px;
      line-height: 1.5;
      margin-bottom: 14px;
      border-bottom: 1px solid #ccc;
      padding-bottom: 12px;
    }
    .label-title {
      font-size: 10px;
      text-transform: uppercase;
      font-weight: 800;
      color: #666;
      margin-bottom: 4px;
    }
    .sender-box {
      font-size: 11px;
      color: #444;
      line-height: 1.4;
    }
    .footer-row {
      display: flex;
      justify-content: space-between;
      margin-top: 15px;
      font-size: 11px;
      font-weight: 700;
    }
    @media print {
      body { background: #fff; padding: 0; }
      .label-box { border: 2px solid #000; box-shadow: none; max-width: 100%; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div style="text-align: center; margin-bottom: 16px;" class="no-print">
    <button onclick="window.print()" style="padding: 10px 20px; font-weight: bold; background: #B88626; color: #fff; border: none; border-radius: 4px; cursor: pointer;">
      🖨️ Print Dispatch Label
    </button>
  </div>

  <div class="label-box">
    <div class="header">
      <div>
        <div class="brand-title">SIVANSH ENTERPRISE</div>
        <div style="font-size: 11px; color: #555;">Keshod Logistics Hub • Gujarat</div>
      </div>
      <div>
        <span class="badge">PREPAID AIR / SURFACE</span>
      </div>
    </div>

    <div class="barcode-container">
      <div class="barcode-mock">||||||||||||||||||||||||||</div>
      <div class="awb-text">AWB: ${awb}</div>
      <div style="font-size: 12px; color: #555;">Order ID: ${orderNumber}</div>
    </div>

    <div class="address-section">
      <div class="label-title">SHIP TO (CUSTOMER DELIVERY ADDRESS):</div>
      <div style="font-weight: 700; font-size: 14px;">Consignee Registered Order</div>
      <div>Order #${orderNumber}</div>
      <div>Full Verified Delivery Pincode</div>
      <div>Contact Verified via WhatsApp & Direct Phone</div>
    </div>

    <div class="sender-box">
      <div class="label-title">SHIPPED FROM (RETURN ADDRESS):</div>
      <strong>Sivansh Enterprise Central Logistics</strong><br>
      Station Road / Main Highway Circle, Keshod - 362220<br>
      Junagadh District, Gujarat, India<br>
      Phone: +91 75338 38538 | contact@sivanshenterprise.com
    </div>

    <div class="footer-row">
      <span>Routing: Shiprocket Multi-Carrier Hub</span>
      <span>Authentic Hardware • BIS Certified</span>
    </div>
  </div>
</body>
</html>
  `;

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
