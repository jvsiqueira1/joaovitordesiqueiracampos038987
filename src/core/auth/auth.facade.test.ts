import { AuthFacade } from "./auth.facade";
import { refresh } from "./auth.service";
import { clearTokens } from "./auth.storage";

vi.mock("./auth.service", () => ({
    login: vi.fn(),
    refresh: vi.fn(),
}));


describe("AuthFacade", () => {
    beforeEach(() => {
        clearTokens();
        vi.clearAllMocks();
    });

    it("refreshs token when access is expired", async () => {
        const now = Date.now();

        localStorage.setItem("access_token", "old_access");
        localStorage.setItem("refresh_token", "old_refresh");
        localStorage.setItem("access_expires_at", String(now - 1000));
        localStorage.setItem("refresh_expires_at", String(now + 60_000));

        (refresh as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
            accessToken: "new_access",
            refreshToken: "new_refresh",
            accessExpiresAt: now + 60_000,
            refreshExpiresAt: now + 120_000,
        });

        const auth = new AuthFacade();
        const token = await auth.ensureFreshAccessToken();

        expect(token).toBe("new_access");
        expect(refresh).toHaveBeenCalledTimes(1);
    });
});