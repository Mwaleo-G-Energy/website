import { describe, expect, it } from "vitest";
import { maintenanceResponse } from "./maintenance";

describe("maintenance response", () => {
  it("serves a branded, temporary response with caching disabled", async () => {
    const res = maintenanceResponse("/shop", "GET");
    expect(res.status).toBe(503);
    expect(res.headers.get("content-type")).toBe("text/html; charset=utf-8");
    expect(res.headers.get("cache-control")).toBe("no-store");
    expect(res.headers.get("retry-after")).toBe("1800");
    expect(await res.text()).toContain("We’re improving our storefront.");
  });

  it("serves JSON for API requests", async () => {
    const res = maintenanceResponse("/api/search", "GET");
    expect(res.status).toBe(503);
    expect(res.headers.get("content-type")).toBe("application/json; charset=utf-8");
    expect(await res.json()).toEqual({ error: "Storefront temporarily unavailable for maintenance." });
  });

  it("omits the response body for HEAD", async () => {
    const res = maintenanceResponse("/", "HEAD");
    expect(res.status).toBe(503);
    expect(await res.text()).toBe("");
  });
});
