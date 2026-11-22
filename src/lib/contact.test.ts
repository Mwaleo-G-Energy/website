import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("Mwaleo WhatsApp configuration", () => {
  it("omits the link if no international number is configured", async () => {
    vi.stubEnv("NEXT_PUBLIC_MWALEO_WHATSAPP_NUMBER", undefined);
    expect((await import("./contact")).WHATSAPP_URL).toBeUndefined();
  });

  it("builds the link from an international number", async () => {
    vi.stubEnv("NEXT_PUBLIC_MWALEO_WHATSAPP_NUMBER", " 254700000000 ");
    expect((await import("./contact")).WHATSAPP_URL).toBe("https://wa.me/254700000000");
  });

  it("rejects a value that is not an international number", async () => {
    vi.stubEnv("NEXT_PUBLIC_MWALEO_WHATSAPP_NUMBER", "0700 000 000");
    expect((await import("./contact")).WHATSAPP_URL).toBeUndefined();
  });
});
