import type { AuthState, LoginRequest, TokenPair } from "./auth.models";

import { BehaviorSubject } from "rxjs";

import { login as loginApi, refresh as refreshApi } from "./auth.service";
import { clearTokens, loadTokens, saveTokens } from "./auth.storage";

function isValid(expiresAt: number, skewMs: number = 15_000): boolean {
  return Date.now() + skewMs < expiresAt;
}

export class AuthFacade {
  private readonly subject = new BehaviorSubject<AuthState>({ status: "anonymous" });
  readonly state$ = this.subject.asObservable();

  constructor() {
    const stored = loadTokens();
    if (stored) this.subject.next({ status: "authenticated", tokens: stored });
  }

  getSnapshot(): AuthState {
    return this.subject.getValue();
  }

  isAuthenticated(): boolean {
    const s = this.subject.getValue();
    return s.status === "authenticated" && !!s.tokens;
  }

  getAccessToken(): string | undefined {
    return this.subject.getValue().tokens?.accessToken;
  }

  getRefreshToken(): string | undefined {
    return this.subject.getValue().tokens?.refreshToken;
  }

  async login(req: LoginRequest): Promise<void> {
    const tokens = await loginApi(req);
    this.setTokens(tokens);
  }

  logout(): void {
    clearTokens();
    this.subject.next({ status: "anonymous" });
  }

  private setTokens(tokens: TokenPair): void {
    saveTokens(tokens);
    this.subject.next({ status: "authenticated", tokens });
  }

  async ensureFreshAccessToken(): Promise<string> {
    const tokens = this.subject.getValue().tokens;
    if (!tokens) throw new Error("Usuário não autenticado.");

    if (!isValid(tokens.refreshExpiresAt, 0)) {
      this.logout();
      throw new Error("Sessão expirada.");
    }

    if (isValid(tokens.accessExpiresAt)) return tokens.accessToken;

    const newTokens = await refreshApi(tokens.refreshToken);
    this.setTokens(newTokens);
    return newTokens.accessToken;
  }
}
