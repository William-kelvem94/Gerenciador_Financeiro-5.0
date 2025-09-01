import { describe, it, expect, vi } from 'vitest';

describe('Basic Setup', () => {
  it('should load configuration', () => {
    expect(true).toBe(true);
  });

  it('should have vitest working', () => {
    expect(vi).toBeDefined();
  });

  it('should have access to globals', () => {
    expect(typeof window).toBe('object');
    expect(typeof document).toBe('object');
  });
});
