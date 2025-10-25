/**
 * Test file for sobriety utilities
 * This is a simple test to verify the confirmation flow works correctly
 */

import { confirmRelapseReset, resetSobrietyTimer, handleRelapseDetection } from '../sobrietyUtils';

// Mock window.confirm for testing
const mockConfirm = jest.fn();
const mockAlert = jest.fn();

// Mock window methods
Object.defineProperty(window, 'confirm', {
  value: mockConfirm,
  writable: true
});

Object.defineProperty(window, 'alert', {
  value: mockAlert,
  writable: true
});

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn()
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true
});

describe('Sobriety Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue('1234567890');
  });

  describe('confirmRelapseReset', () => {
    it('should return true when user confirms', async () => {
      mockConfirm.mockReturnValue(true);
      
      const result = await confirmRelapseReset();
      
      expect(result).toBe(true);
      expect(mockConfirm).toHaveBeenCalledWith(
        expect.stringContaining("It looks like you may have experienced a relapse")
      );
    });

    it('should return false when user cancels', async () => {
      mockConfirm.mockReturnValue(false);
      
      const result = await confirmRelapseReset();
      
      expect(result).toBe(false);
    });
  });

  describe('resetSobrietyTimer', () => {
    it('should update localStorage and dispatch event', () => {
      const mockDispatchEvent = jest.fn();
      window.dispatchEvent = mockDispatchEvent;
      
      resetSobrietyTimer();
      
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('sobrietyStartTime', expect.any(String));
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('lastCheckIn');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('lastCheckInWindow');
      expect(mockDispatchEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'sobrietyTimerReset',
          detail: expect.objectContaining({
            newStartTime: expect.any(Number)
          })
        })
      );
    });
  });

  describe('handleRelapseDetection', () => {
    it('should reset timer when user confirms', async () => {
      mockConfirm.mockReturnValue(true);
      const mockDispatchEvent = jest.fn();
      window.dispatchEvent = mockDispatchEvent;
      
      await handleRelapseDetection();
      
      expect(mockLocalStorage.setItem).toHaveBeenCalled();
      expect(mockAlert).toHaveBeenCalledWith(
        expect.stringContaining("Your journey has been reset")
      );
    });

    it('should not reset timer when user cancels', async () => {
      mockConfirm.mockReturnValue(false);
      
      await handleRelapseDetection();
      
      expect(mockLocalStorage.setItem).not.toHaveBeenCalled();
      expect(mockAlert).not.toHaveBeenCalled();
    });
  });
});
