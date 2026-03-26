import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock fetch globally
const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

// Must import AFTER stubbing
import { scheduleOnboardingSequence } from './onboarding-sequence';

describe('scheduleOnboardingSequence', () => {
  beforeEach(() => {
    vi.stubEnv('BREVO_API_KEY', 'test-key-123');
    mockFetch.mockReset();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('sends 5 emails (D+0 immediate, D+1/D+3/D+5/D+7 scheduled)', async () => {
    // First call: check contact attributes (GET)
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ attributes: {} }),
    });
    // Second call: update ONBOARDING_SENT attribute (PUT)
    mockFetch.mockResolvedValueOnce({ ok: true, status: 204, text: async () => '' });
    // 5 email sends
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ messageId: 'msg-123' }),
    });

    await scheduleOnboardingSequence('test@example.com', 'Alex');

    // 1 GET contact + 1 PUT attribute + 5 POST emails = 7 calls
    expect(mockFetch).toHaveBeenCalledTimes(7);

    // Verify D+0 has no scheduledAt (immediate)
    const firstEmailCall = mockFetch.mock.calls[2];
    const firstEmailBody = JSON.parse(firstEmailCall[1].body);
    expect(firstEmailBody.scheduledAt).toBeUndefined();

    // Verify D+1 has scheduledAt
    const secondEmailCall = mockFetch.mock.calls[3];
    const secondEmailBody = JSON.parse(secondEmailCall[1].body);
    expect(secondEmailBody.scheduledAt).toBeDefined();
  });

  it('skips if ONBOARDING_SENT is already true', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ attributes: { ONBOARDING_SENT: 'true' } }),
    });

    await scheduleOnboardingSequence('test@example.com');

    // Only 1 call: the GET contact check
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('does nothing without BREVO_API_KEY', async () => {
    vi.stubEnv('BREVO_API_KEY', '');

    await scheduleOnboardingSequence('test@example.com');

    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('handles contact not found (new contact) gracefully', async () => {
    // GET contact returns 404
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      text: async () => 'Contact not found',
    });
    // PUT attribute
    mockFetch.mockResolvedValueOnce({ ok: true, status: 204, text: async () => '' });
    // 4 email sends
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ messageId: 'msg-456' }),
    });

    await scheduleOnboardingSequence('new@example.com');

    // 1 GET + 1 PUT + 5 emails = 7
    expect(mockFetch).toHaveBeenCalledTimes(7);
  });
});
