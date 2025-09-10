#!/usr/bin/env tsx

import { execSync } from 'child_process';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

async function generateSDK() {
  console.log('🚀 Generating TypeScript SDK from OpenAPI spec...');

  try {
    // Ensure the server is running and generate the SDK
    const apiUrl = process.env.API_URL || 'http://localhost:3000';
    
    // Generate TypeScript SDK
    execSync(`npx openapi-typescript ${apiUrl}/openapi.yaml -o src/generated/api.ts`, {
      stdio: 'inherit',
    });

    // Create a client wrapper
    const clientWrapper = `
import type { paths } from './api';

// Base configuration
export interface ApiConfig {
  baseUrl: string;
  token?: string;
}

// Default configuration
const defaultConfig: ApiConfig = {
  baseUrl: '${apiUrl}/api',
};

// API Client class
export class ApiClient {
  private config: ApiConfig;

  constructor(config: Partial<ApiConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = \`\${this.config.baseUrl}\${endpoint}\`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.config.token) {
      headers.Authorization = \`Bearer \${this.config.token}\`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || \`HTTP \${response.status}\`);
    }

    return response.json();
  }

  // Auth endpoints
  async register(data: any) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(data: any) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getProfile() {
    return this.request('/auth/me');
  }

  // Session endpoints
  async createSession(data: any) {
    return this.request('/sessions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getSession(id: string) {
    return this.request(\`/sessions/\${id}\`);
  }

  // Role endpoints
  async createRole(data: any) {
    return this.request('/roles', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getSessionRoles(sessionId: string) {
    return this.request(\`/roles/sessions/\${sessionId}\`);
  }

  // Canvas endpoints
  async createNode(data: any) {
    return this.request('/canvas/nodes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async createEdge(data: any) {
    return this.request('/canvas/edges', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async expandCanvas(data: any) {
    return this.request('/canvas/expand', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getSessionCanvas(sessionId: string) {
    return this.request(\`/canvas/sessions/\${sessionId}\`);
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }
}

// Export default instance
export const apiClient = new ApiClient();

// Export types
export type { paths } from './api';
`;

    // Ensure generated directory exists
    mkdirSync(join(__dirname, '../src/generated'), { recursive: true });

    // Write client wrapper
    writeFileSync(join(__dirname, '../src/generated/client.ts'), clientWrapper);

    console.log('✅ TypeScript SDK generated successfully!');
    console.log('📁 Files created:');
    console.log('  - src/generated/api.ts (OpenAPI types)');
    console.log('  - src/generated/client.ts (API client wrapper)');
    console.log('');
    console.log('💡 Usage:');
    console.log('  import { apiClient } from "./src/generated/client";');
    console.log('  const result = await apiClient.login({ identifier: "user", password: "pass" });');

  } catch (error) {
    console.error('❌ Failed to generate SDK:', error);
    process.exit(1);
  }
}

generateSDK();
