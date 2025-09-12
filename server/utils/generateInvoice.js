import formatDate from "./formatDate.js";
const SERVER_URL = "https://yourdomain.com";

const adcLogo = `${SERVER_URL}/images/ADC_Logo.jpg`;
const accidentDirectClaimsLogo = `${SERVER_URL}/images/Accident_Direct_Claims_Logo.jpg`;

export default function generateInvoiceHtml(data) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice #${data.payment_id}</title>
</head>
<body style="margin: 0; font-family: Arial, sans-serif; background-color: #f9f9f9;">
    <table cellpadding="0" cellspacing="0" border="0" style="max-width: 800px; margin: 0 auto; background-color: white; border: 2px solid #000000; width: 100%;">
        <tr>
            <td style="padding: 30px;">
                <!-- Header -->
                <table cellpadding="0" cellspacing="0" border="0" style="width: 100%; border-bottom: 1px solid #000000; margin-bottom: 20px;">
                    <tr>
                        <td style="vertical-align: middle;">
                            <h1 style="font-size: 48px; font-weight: bold; margin: 0; color: #366091; font-family: Arial, sans-serif;">${data.company}</h1>
                        </td>
                        <td style="text-align: right; vertical-align: middle; width: 100px;">
                            <img src="${data.company == "ADC" ? adcLogo : accidentDirectClaimsLogo}" alt="Company Logo" style="width: 100px; height: 100px; border: 0; display: block;">
                        </td>
                    </tr>
                </table>

                <!-- Details Section -->
                <table cellpadding="0" cellspacing="0" border="1" style="width: 100%; border: 1px solid #000000; margin-bottom: 20px; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 16px; vertical-align: top; border: 0;">
                            <div style="margin-bottom: 16px;">
                                <strong style="font-size: 14px;">BILL TO:</strong>
                            </div>
                            <div style="font-size: 18px; font-weight: bold; line-height: 1.4;">
                                ${data.first_name.toUpperCase()} ${data.last_name.toUpperCase()}<br>
                                ${data.street_name}<br>
                                ${data.city}<br>
                                ${data.postcode}
                            </div>
                        </td>
                        <td style="padding: 16px; vertical-align: top; text-align: right; border: 0;">
                            <div style="margin-bottom: 12px;">
                                <strong style="display: block; margin-bottom: 4px;">INVOICE #</strong>
                                <span>${data.payment_id}</span>
                            </div>
                            <div style="margin-bottom: 12px;">
                                <strong style="display: block; margin-bottom: 4px;">DATE</strong>
                                <span>${formatDate(data.start_date)}</span>
                            </div>
                            <div>
                                <strong style="display: block; margin-bottom: 4px;">INVOICE DUE DATE</strong>
                                <span>${formatDate(data.due_date)}</span>
                            </div>
                        </td>
                    </tr>
                </table>

                <!-- Invoice Table -->
                <table cellpadding="0" cellspacing="0" border="0" style="width: 100%; border: 2px solid #333; border-collapse: collapse; margin-bottom: 20px;">
                    <thead>
                        <tr style="background-color: #f5f5f5;">
                            <th style="border: 1px solid #333; padding: 12px; text-align: left; font-weight: bold;">REG NO</th>
                            <th style="border: 1px solid #333; padding: 12px; text-align: left; font-weight: bold;">DESCRIPTION</th>
                            <th style="border: 1px solid #333; padding: 12px; text-align: left; font-weight: bold;">QTY</th>
                            <th style="border: 1px solid #333; padding: 12px; text-align: left; font-weight: bold;">PRICE</th>
                            <th style="border: 1px solid #333; padding: 12px; text-align: left; font-weight: bold;">VAT</th>
                            <th style="border: 1px solid #333; padding: 12px; text-align: right; font-weight: bold;">AMOUNT</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="border: 1px solid #333; padding: 12px;">${data.vrm}</td>
                            <td style="border: 1px solid #333; padding: 12px;">${data.week_no == 0 ? "DEPOSIT" : "WEEK RENT"} ${formatDate(data.start_date)} to ${formatDate(data.end_date)}</td>
                            <td style="border: 1px solid #333; padding: 12px;">1</td>
                            <td style="border: 1px solid #333; padding: 12px;">£${(data.amount_due / 1.2).toFixed(2)}</td>
                            <td style="border: 1px solid #333; padding: 12px;">20%</td>
                            <td style="border: 1px solid #333; padding: 12px; text-align: right;">£${data.amount_due}</td>
                        </tr>
                    </tbody>
                </table>

                <!-- Total Section -->
                <div style="text-align: right; margin-bottom: 20px; font-size: 18px; font-weight: bold;">
                    Total: £${data.amount_due}
                </div>

                <!-- Due Notice -->
                <div style="margin-top: 20px; padding: 15px; background-color: #f8f8f8; border: 1px solid #ddd;">
                    <strong>Payment Due:</strong> This invoice is due immediately (${formatDate(data.due_date)}). Please ensure payment is made by the due date to avoid any late fees.
                </div>
            </td>
        </tr>
    </table>
</body>
</html>
`;
}
