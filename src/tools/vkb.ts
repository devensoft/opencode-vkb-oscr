export class FollowUpSender {
  private readonly sessionId: string;
  private readonly vkbBaseUrl: string;
  private readonly prompt: string;
  private readonly executorId: string;

  constructor(
    sessionId: string,
    vkbBaseUrl: string,
    prompt: string,
    executorId: string
  ) {
    this.sessionId = sessionId;
    this.vkbBaseUrl = vkbBaseUrl;
    this.prompt = prompt;
    this.executorId = executorId;
  }

  async execute(): Promise<string> {
    const response = await this.sendFollowUp();
    return this.formatResponse(response);
  }

  private async sendFollowUp(): Promise<Response> {
    const url = `${this.vkbBaseUrl}/api/sessions/${this.sessionId}/follow-up`;
    const body = this.buildRequestBody();
    return fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  }

  private buildRequestBody(): Record<string, unknown> {
    return {
      prompt: this.prompt,
      executor_profile_id: {
        executor: this.executorId,
      },
    };
  }

  private async formatResponse(response: Response): Promise<string> {
    const statusCode = response.status;
    const responseText = await this.safeReadBody(response);
    return `Follow-up sent to session ${this.sessionId}: status=${statusCode} body=${responseText}`;
  }

  private async safeReadBody(response: Response): Promise<string> {
    try {
      return await response.text();
    } catch {
      return "(unable to read response body)";
    }
  }
}

export function createFollowUpSender(
  sessionId: string,
  vkbBaseUrl: string,
  prompt: string,
  executorId: string
): FollowUpSender {
  return new FollowUpSender(sessionId, vkbBaseUrl, prompt, executorId);
}
