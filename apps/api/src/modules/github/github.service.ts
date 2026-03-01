import crypto from "node:crypto";

type OAuthStatePayload = {
    redirectUrl: string;
    projectId: string;
    userId: string;
};

export default class GithubService {
    private static readonly ALLOWED_REDIRECT_ORIGINS = new Set([
        "http://localhost:5173",
        "https://p005.netlify.app",
    ]);

    public resolveClientRedirectUrl(redirectUrl?: string) {
        const fallbackUrl =
            process.env.NODE_ENV === "prod"
                ? "https://p005.netlify.app/onboarding"
                : "http://localhost:5173/onboarding";

        if (!redirectUrl) {
            return fallbackUrl;
        }

        const parsedUrl = new URL(redirectUrl);

        if (!GithubService.ALLOWED_REDIRECT_ORIGINS.has(parsedUrl.origin)) {
            throw new Error("Invalid redirect URL origin");
        }

        return parsedUrl.toString();
    }

    public buildOAuthState(payload: OAuthStatePayload) {
        const nonce = crypto.randomBytes(16).toString("hex");
        const payloadEncoded = Buffer.from(
            JSON.stringify(payload),
            "utf-8",
        ).toString("base64url");
        return `${nonce}.${payloadEncoded}`;
    }

    public parseOAuthState(state: string): OAuthStatePayload {
        const encodedPayload = state.split(".").at(1);

        if (!encodedPayload) {
            throw new Error("Invalid OAuth state");
        }

        const parsedPayload = JSON.parse(
            Buffer.from(encodedPayload, "base64url").toString("utf-8"),
        ) as OAuthStatePayload;

        return {
            redirectUrl: this.resolveClientRedirectUrl(
                parsedPayload.redirectUrl,
            ),
            projectId: parsedPayload.projectId,
            userId: parsedPayload.userId,
        };
    }

    public getGithubInstallUrl(state: string) {
        const appName = process.env.GITHUB_APP_NAME;

        if (!appName) {
            throw new Error("GITHUB_APP_NAME is not configured");
        }

        const url = new URL(
            `https://github.com/apps/${appName}/installations/new`,
        );
        url.searchParams.set("state", state);
        return url.toString();
    }

    public verifyWebhookSignature(
        payload: string,
        signatureHeader?: string,
    ): boolean {
        const secret = process.env.GITHUB_WEBHOOK_SECRET;

        if (!secret || !signatureHeader) {
            return false;
        }

        const expected = `sha256=${crypto
            .createHmac("sha256", secret)
            .update(payload)
            .digest("hex")}`;

        const expectedBuffer = Buffer.from(expected, "utf-8");
        const receivedBuffer = Buffer.from(signatureHeader, "utf-8");

        if (expectedBuffer.length !== receivedBuffer.length) {
            return false;
        }

        return crypto.timingSafeEqual(expectedBuffer, receivedBuffer);
    }
}
