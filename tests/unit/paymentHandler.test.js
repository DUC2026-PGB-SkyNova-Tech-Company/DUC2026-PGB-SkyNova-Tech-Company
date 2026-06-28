/**
 * Unit Tests — Payment Handler
 * Tests payment parsing, method selection, confirmation and cancellation
 * All Telegram bot calls and DB operations are mocked.
 */

jest.mock('../../src/models/simpleDB');
jest.mock('../../src/utils/currencyUtils', () => ({
  formatBothCurrencies: (amount) => ({
    khr: `${amount.toLocaleString()} ៛`,
    usd: `$${(amount / 4100).toFixed(2)}`,
    khrRaw: amount,
    usdRaw: amount / 4100
  })
}));

const { User, Branch, Transaction } = require('../../src/models/simpleDB');
const {
  recordPayment,
  handlePaymentText,
  handlePaymentMethod,
  confirmPayment,
  handlePhotoUpload
} = require('../../src/handlers/paymentHandler');

// ─── Helpers ────────────────────────────────────────────────────────────────

function makeMockBot() {
  return {
    sendMessage: jest.fn().mockResolvedValue({ message_id: 1 }),
    answerCallbackQuery: jest.fn().mockResolvedValue({})
  };
}

function makeMsg(overrides = {}) {
  return {
    chat: { id: 9001 },
    from: { id: 5555, first_name: 'Narith', username: 'narith99' },
    text: '',
    ...overrides
  };
}

function makeQuery(data, overrides = {}) {
  return {
    id: 'qid123',
    data,
    message: { chat: { id: 9001 }, message_id: 10 },
    from: { id: 5555, first_name: 'Narith', username: 'narith99' },
    ...overrides
  };
}

// ─── recordPayment ───────────────────────────────────────────────────────────

describe('recordPayment()', () => {
  it('sends "please select branch" when user has no branch set', async () => {
    User.findByTelegramId.mockResolvedValue(null);
    const bot = makeMockBot();
    const msg = makeMsg();

    await recordPayment(bot, msg);

    expect(bot.sendMessage).toHaveBeenCalledWith(
      9001,
      expect.stringContaining('/branch'),
      expect.any(Object)
    );
  });

  it('sends payment recording prompt when user has a branch', async () => {
    User.findByTelegramId.mockResolvedValue({ telegramId: 5555, currentBranchId: 1 });
    const bot = makeMockBot();

    await recordPayment(bot, makeMsg());

    expect(bot.sendMessage).toHaveBeenCalledWith(
      9001,
      expect.stringContaining('AMOUNT'),
      expect.any(Object)
    );
  });
});

// ─── handlePhotoUpload ───────────────────────────────────────────────────────

describe('handlePhotoUpload()', () => {
  it('sends "please select branch" when user has no branch', async () => {
    User.findByTelegramId.mockResolvedValue(null);
    const bot = makeMockBot();
    const msg = makeMsg({
      photo: [{ file_id: 'abc', width: 100, height: 100 }]
    });

    await handlePhotoUpload(bot, msg);

    expect(bot.sendMessage).toHaveBeenCalledWith(
      9001,
      expect.stringContaining('/branch'),
      expect.any(Object)
    );
  });

  it('acknowledges photo when user has branch set', async () => {
    User.findByTelegramId.mockResolvedValue({ telegramId: 5555, currentBranchId: 1 });
    Branch.findById.mockResolvedValue({ id: 1, name: 'Central Market' });
    const bot = makeMockBot();
    const msg = makeMsg({
      photo: [{ file_id: 'img_001', width: 800, height: 600 }]
    });

    await handlePhotoUpload(bot, msg);

    // Should send processing message and then instructions
    expect(bot.sendMessage).toHaveBeenCalledTimes(2);
    const lastCall = bot.sendMessage.mock.calls[1][1];
    expect(lastCall).toContain('Central Market');
  });
});

// ─── handlePaymentText ───────────────────────────────────────────────────────

describe('handlePaymentText()', () => {
  it('ignores message when user has no branch', async () => {
    User.findByTelegramId.mockResolvedValue(null);
    const bot = makeMockBot();

    await handlePaymentText(bot, makeMsg({ text: '25000 Fried Rice' }));

    expect(bot.sendMessage).not.toHaveBeenCalled();
  });

  it('ignores non-numeric first word', async () => {
    User.findByTelegramId.mockResolvedValue({ telegramId: 5555, currentBranchId: 1 });
    const bot = makeMockBot();

    await handlePaymentText(bot, makeMsg({ text: 'hello world' }));

    expect(bot.sendMessage).not.toHaveBeenCalled();
  });

  it('ignores zero or negative amounts', async () => {
    User.findByTelegramId.mockResolvedValue({ telegramId: 5555, currentBranchId: 1 });
    const bot = makeMockBot();

    await handlePaymentText(bot, makeMsg({ text: '0 test item' }));
    expect(bot.sendMessage).not.toHaveBeenCalled();
  });

  it('sends payment confirmation with QR and Cash buttons for valid input', async () => {
    User.findByTelegramId.mockResolvedValue({ telegramId: 5555, currentBranchId: 1 });
    Branch.findById.mockResolvedValue({ id: 1, name: 'Central Market' });
    const bot = makeMockBot();

    await handlePaymentText(bot, makeMsg({ text: '25000 2x Fried Rice' }));

    expect(bot.sendMessage).toHaveBeenCalledTimes(1);
    const [chatId, message, opts] = bot.sendMessage.mock.calls[0];
    expect(chatId).toBe(9001);
    expect(message).toContain('25,000');
    expect(opts.reply_markup.inline_keyboard).toBeDefined();
    // Should have QR and Cash buttons
    const buttonRow = opts.reply_markup.inline_keyboard[0];
    expect(buttonRow.some(b => b.callback_data.includes('QR'))).toBe(true);
    expect(buttonRow.some(b => b.callback_data.includes('CASH'))).toBe(true);
  });

  it('uses "Payment" as default description when none provided', async () => {
    User.findByTelegramId.mockResolvedValue({ telegramId: 5555, currentBranchId: 1 });
    Branch.findById.mockResolvedValue({ id: 1, name: 'Central Market' });
    const bot = makeMockBot();

    await handlePaymentText(bot, makeMsg({ text: '10000' }));

    const message = bot.sendMessage.mock.calls[0][1];
    expect(message).toContain('Payment');
  });
});

// ─── handlePaymentMethod ─────────────────────────────────────────────────────

describe('handlePaymentMethod()', () => {
  it('shows confirm/cancel keyboard for QR method', async () => {
    Branch.findById.mockResolvedValue({ id: 1, name: 'Central Market' });
    const bot = makeMockBot();
    const query = makeQuery('method_25000_1_2x%20Rice_QR');

    await handlePaymentMethod(bot, query);

    expect(bot.sendMessage).toHaveBeenCalled();
    const opts = bot.sendMessage.mock.calls[0][2];
    const buttons = opts.reply_markup.inline_keyboard.flat();
    expect(buttons.some(b => b.text.includes('Confirm'))).toBe(true);
    expect(buttons.some(b => b.text.includes('Cancel'))).toBe(true);
  });

  it('shows confirm/cancel keyboard for CASH method', async () => {
    Branch.findById.mockResolvedValue({ id: 1, name: 'Central Market' });
    const bot = makeMockBot();
    const query = makeQuery('method_15000_1_Noodle%20Soup_CASH');

    await handlePaymentMethod(bot, query);

    expect(bot.sendMessage).toHaveBeenCalled();
    const message = bot.sendMessage.mock.calls[0][1];
    expect(message).toContain('Cash Payment');
  });
});

// ─── confirmPayment ──────────────────────────────────────────────────────────

describe('confirmPayment()', () => {
  it('cancels without saving when data is confirm_cancel', async () => {
    const bot = makeMockBot();
    const query = makeQuery('confirm_cancel');

    await confirmPayment(bot, query);

    expect(Transaction.create).not.toHaveBeenCalled();
    expect(bot.sendMessage).toHaveBeenCalledWith(9001, expect.stringContaining('cancel'));
  });

  it('saves transaction and sends receipt on confirm', async () => {
    Branch.findById.mockResolvedValue({ id: 1, name: 'Central Market' });
    Transaction.create.mockResolvedValue({ id: 42, amount: 25000, paymentMethod: 'QR' });
    const bot = makeMockBot();
    const query = makeQuery('confirm_25000_1_2x%20Rice_QR');

    await confirmPayment(bot, query);

    expect(Transaction.create).toHaveBeenCalledWith(
      expect.objectContaining({
        amount: 25000,
        branchId: 1,
        paymentMethod: 'QR'
      })
    );
    const receipt = bot.sendMessage.mock.calls[0][1];
    expect(receipt).toContain('#42');
    expect(receipt).toContain('PAID');
  });

  it('notifies user on error and does not crash', async () => {
    Transaction.create.mockRejectedValue(new Error('DB error'));
    const bot = makeMockBot();
    const query = makeQuery('confirm_25000_1_test_CASH');

    await confirmPayment(bot, query);

    expect(bot.sendMessage).toHaveBeenCalledWith(9001, expect.stringContaining('Error'));
  });
});
