/**
 * ERP Integration Adapter
 *
 * The website is a lead-generation surface. The ERP will be the operational
 * system of record once connected. Until API credentials and contracts are
 * provided, synchronization is marked NOT_CONNECTED.
 */

export type ErpCustomerPayload = {
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  country: string;
};

export type ErpLeadPayload = {
  reference: string;
  inquiryType: string;
  industry: string;
  productCategory: string;
  description: string;
  customer: ErpCustomerPayload;
};

export type ErpSyncResult = {
  connected: boolean;
  success: boolean;
  externalId?: string;
  status: "NOT_CONNECTED" | "SYNCED" | "FAILED";
  message: string;
};

export interface ErpAdapter {
  readonly name: string;
  isConnected(): boolean;
  createCustomer(payload: ErpCustomerPayload): Promise<ErpSyncResult>;
  createLead(payload: ErpLeadPayload): Promise<ErpSyncResult>;
  syncInquiry(payload: ErpLeadPayload): Promise<ErpSyncResult>;
  updateStatus(externalId: string, status: string): Promise<ErpSyncResult>;
  attachQuotationRef(
    externalId: string,
    quotationRef: string,
  ): Promise<ErpSyncResult>;
}

const notConnected = (action: string): ErpSyncResult => ({
  connected: false,
  success: false,
  status: "NOT_CONNECTED",
  message: `ERP ${action} skipped — integration not connected. See docs/ERP_INTEGRATION.md.`,
});

/** Default adapter used when ERP_API_URL / ERP_API_KEY are absent. */
export class NotConnectedErpAdapter implements ErpAdapter {
  readonly name = "NotConnectedErpAdapter";

  isConnected(): boolean {
    return false;
  }

  async createCustomer(_payload: ErpCustomerPayload): Promise<ErpSyncResult> {
    return notConnected("createCustomer");
  }

  async createLead(_payload: ErpLeadPayload): Promise<ErpSyncResult> {
    return notConnected("createLead");
  }

  async syncInquiry(_payload: ErpLeadPayload): Promise<ErpSyncResult> {
    return notConnected("syncInquiry");
  }

  async updateStatus(_externalId: string, _status: string): Promise<ErpSyncResult> {
    return notConnected("updateStatus");
  }

  async attachQuotationRef(
    _externalId: string,
    _quotationRef: string,
  ): Promise<ErpSyncResult> {
    return notConnected("attachQuotationRef");
  }
}

/**
 * HTTP adapter for a future authorized ERP API.
 * Activated only when ERP_API_URL and ERP_API_KEY are set.
 */
export class HttpErpAdapter implements ErpAdapter {
  readonly name = "HttpErpAdapter";
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor(baseUrl: string, apiKey: string) {
    this.baseUrl = baseUrl.replace(/\/$/, "");
    this.apiKey = apiKey;
  }

  isConnected(): boolean {
    return Boolean(this.baseUrl && this.apiKey);
  }

  private async request(
    path: string,
    body: unknown,
    action: string,
  ): Promise<ErpSyncResult> {
    try {
      const res = await fetch(`${this.baseUrl}${path}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        return {
          connected: true,
          success: false,
          status: "FAILED",
          message: `ERP ${action} failed (${res.status}): ${text.slice(0, 200)}`,
        };
      }

      const data = (await res.json().catch(() => ({}))) as { id?: string };
      return {
        connected: true,
        success: true,
        externalId: data.id,
        status: "SYNCED",
        message: `ERP ${action} succeeded`,
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown ERP error";
      console.error(`[erp] ${action} failed:`, message);
      return {
        connected: true,
        success: false,
        status: "FAILED",
        message: `ERP ${action} error: ${message}`,
      };
    }
  }

  createCustomer(payload: ErpCustomerPayload) {
    return this.request("/customers", payload, "createCustomer");
  }

  createLead(payload: ErpLeadPayload) {
    return this.request("/leads", payload, "createLead");
  }

  syncInquiry(payload: ErpLeadPayload) {
    return this.request("/inquiries/sync", payload, "syncInquiry");
  }

  updateStatus(externalId: string, status: string) {
    return this.request(
      `/inquiries/${encodeURIComponent(externalId)}/status`,
      { status },
      "updateStatus",
    );
  }

  attachQuotationRef(externalId: string, quotationRef: string) {
    return this.request(
      `/inquiries/${encodeURIComponent(externalId)}/quotation`,
      { quotationRef },
      "attachQuotationRef",
    );
  }
}

export function getErpAdapter(): ErpAdapter {
  const url = process.env.ERP_API_URL?.trim();
  const key = process.env.ERP_API_KEY?.trim();
  if (url && key) {
    return new HttpErpAdapter(url, key);
  }
  return new NotConnectedErpAdapter();
}
