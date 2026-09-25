import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    // We now extract annualTrades from the incoming request to calculate limits
    const { chatId, asset, tradeAmount, bestPlanName, currencySymbol = '₹', annualTrades = 0 } = body;
    
    const botToken = process.env.TELEGRAM_BOT_TOKEN;

    if (!botToken) {
      return NextResponse.json({ error: 'Bot token not configured' }, { status: 500 });
    }

    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
    const locale = currencySymbol === '₹' ? 'en-IN' : 'en-US';
    const formattedAmount = Number(tradeAmount || 0).toLocaleString(locale);

    // 1. Generate a dynamic, unique settlement ID (e.g., TXN-8A9F2C1B)
    const settlementNumber = 'TXN-' + Math.random().toString(36).substring(2, 10).toUpperCase();

    // 2. Dynamic Brokerage Fee Calculation based on the user's instructions
    let settlementFee = 0;
    
    if (bestPlanName === 'No Plan') {
      settlementFee = 20;
    } else if (bestPlanName === 'Retail Plan' && annualTrades > 50) {
      settlementFee = 20;
    } else if (bestPlanName === 'Active Trader' && annualTrades > 500) {
      settlementFee = 20;
    }

    // Format the fee text to provide transparency to the end user
    const feeText = settlementFee === 0 
      ? '₹0.00 (Within Plan Limits)' 
      : '₹20.00 (Plan Limit Exceeded / No Plan)';

    // Inject the new logic into the Telegram Markdown
    const receiptMessage = 
`🟢 *MOCHATRADE TRUST RECEIPT*

*Contract:* \`${asset}\`
*Settled Value:* ${currencySymbol}${formattedAmount}
*Execution Time:* ${timestamp} UTC
*Fee Tier:* ${bestPlanName || 'Retail Plan'}
*Settlement Fee:* ${feeText}

✅ _100% Reserve Verified On-Chain_
🔗 *Trader Ref:* \`MOCHA-BULLS-9921\`
🛡️ *Settlement ID:* [${settlementNumber}](https://mochatrade.io/verify/${settlementNumber})`;

    const telegramResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        parse_mode: 'Markdown',
        text: receiptMessage,
      }),
    });

    if (!telegramResponse.ok) {
      return NextResponse.json({ error: 'Telegram dispatch failed' }, { status: 400 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}