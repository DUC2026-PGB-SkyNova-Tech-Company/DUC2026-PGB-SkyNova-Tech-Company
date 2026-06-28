/**
 * Unit Tests — Auth Utilities
 * Tests admin ID checking and access control
 */

const { isAdmin, requireAdmin } = require('../../src/utils/authUtils');

describe('authUtils', () => {

  // Save original env and restore after each test
  const originalEnv = process.env.ADMIN_USER_IDS;

  afterEach(() => {
    if (originalEnv === undefined) {
      delete process.env.ADMIN_USER_IDS;
    } else {
      process.env.ADMIN_USER_IDS = originalEnv;
    }
  });

  // ─── isAdmin ────────────────────────────────────────────────────────────────

  describe('isAdmin()', () => {
    it('returns true when userId is in the admin list', () => {
      process.env.ADMIN_USER_IDS = '123,456,789';
      expect(isAdmin(123)).toBe(true);
      expect(isAdmin(456)).toBe(true);
      expect(isAdmin(789)).toBe(true);
    });

    it('returns false when userId is not in the admin list', () => {
      process.env.ADMIN_USER_IDS = '123,456';
      expect(isAdmin(999)).toBe(false);
    });

    it('returns false when ADMIN_USER_IDS is an empty string', () => {
      process.env.ADMIN_USER_IDS = '';
      expect(isAdmin(123)).toBe(false);
    });

    it('returns false when ADMIN_USER_IDS is undefined', () => {
      delete process.env.ADMIN_USER_IDS;
      expect(isAdmin(123)).toBe(false);
    });

    it('handles spaces around IDs correctly', () => {
      process.env.ADMIN_USER_IDS = ' 123 , 456 ';
      expect(isAdmin(123)).toBe(true);
      expect(isAdmin(456)).toBe(true);
    });

    it('handles single admin ID', () => {
      process.env.ADMIN_USER_IDS = '777';
      expect(isAdmin(777)).toBe(true);
      expect(isAdmin(778)).toBe(false);
    });
  });

  // ─── requireAdmin ───────────────────────────────────────────────────────────

  describe('requireAdmin()', () => {
    let mockBot;
    let mockNext;

    beforeEach(() => {
      mockBot = {
        sendMessage: jest.fn().mockResolvedValue({})
      };
      mockNext = jest.fn();
    });

    it('calls next() when user is an admin', async () => {
      process.env.ADMIN_USER_IDS = '111';
      const msg = { from: { id: 111 }, chat: { id: 100 } };

      await requireAdmin(mockBot, msg, mockNext);

      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(mockBot.sendMessage).not.toHaveBeenCalled();
    });

    it('sends access denied message and does not call next() for non-admin', async () => {
      process.env.ADMIN_USER_IDS = '111';
      const msg = { from: { id: 999 }, chat: { id: 100 } };

      await requireAdmin(mockBot, msg, mockNext);

      expect(mockNext).not.toHaveBeenCalled();
      expect(mockBot.sendMessage).toHaveBeenCalledWith(
        100,
        expect.stringContaining('🔒')
      );
    });

    it('sends access denied when no admins configured', async () => {
      delete process.env.ADMIN_USER_IDS;
      const msg = { from: { id: 123 }, chat: { id: 100 } };

      await requireAdmin(mockBot, msg, mockNext);

      expect(mockNext).not.toHaveBeenCalled();
      expect(mockBot.sendMessage).toHaveBeenCalled();
    });
  });
});
