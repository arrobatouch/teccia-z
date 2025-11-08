// AnythingLLM Real Connection Test
// API Key: HHNP18V-MRK4BT0-KS8T24F-9ZNMA2N

const ANYTHINGLLM_API_KEY = "HHNP18V-MRK4BT0-KS8T24F-9ZNMA2N";
const ANYTHINGLLM_BASE_URL = "https://orus.teccia.com.ar";

class AnythingLLMRealConnector {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string, baseUrl: string) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  /**
   * Test authentication with AnythingLLM
   */
  async testAuthentication(): Promise<boolean> {
    console.log('🔐 Testing AnythingLLM Authentication...');
<<<<<<< HEAD
    console.log('🔗 Base URL:', this.baseUrl);
    console.log('🔑 API Key:', this.apiKey ? `${this.apiKey.substring(0, 8)}...` : 'UNDEFINED');
    
    // Validate inputs
    if (!this.apiKey || !this.baseUrl) {
      console.error('❌ Missing API key or base URL');
      return false;
    }
=======
>>>>>>> a4b59d2c91f1579da11ec6e9c7fd5ff0af91d4a1
    
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/auth`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('📊 Auth Response Status:', response.status);
<<<<<<< HEAD
      console.log('📊 Auth Response Headers:', Object.fromEntries(response.headers.entries()));
=======
>>>>>>> a4b59d2c91f1579da11ec6e9c7fd5ff0af91d4a1
      
      if (response.ok) {
        const authData = await response.json();
        console.log('✅ Authentication successful:', authData);
        return true;
      } else {
        const errorData = await response.text();
        console.log('❌ Authentication failed:', response.status, errorData);
<<<<<<< HEAD
        console.log('❌ Response URL:', response.url);
=======
>>>>>>> a4b59d2c91f1579da11ec6e9c7fd5ff0af91d4a1
        return false;
      }
    } catch (error) {
      console.error('❌ Authentication error:', error);
<<<<<<< HEAD
      console.error('❌ Error details:', {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        name: error instanceof Error ? error.name : undefined
      });
=======
>>>>>>> a4b59d2c91f1579da11ec6e9c7fd5ff0af91d4a1
      return false;
    }
  }

  /**
   * Get available workspaces
   */
  async getWorkspaces(): Promise<any[]> {
    console.log('📚 Getting available workspaces...');
    
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/workspaces`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
<<<<<<< HEAD
        const workspaces = await response.json();
        console.log('✅ Workspaces found:', workspaces);
=======
        const data = await response.json();
        const workspaces = data.workspaces || data; // Handle both response formats
        console.log('✅ Workspaces found:', workspaces.length, 'workspaces');
        console.log('📋 Workspace list:', workspaces.map(w => `${w.name} (${w.slug})`));
>>>>>>> a4b59d2c91f1579da11ec6e9c7fd5ff0af91d4a1
        return workspaces;
      } else {
        console.log('❌ Failed to get workspaces:', response.status);
        return [];
      }
    } catch (error) {
      console.error('❌ Error getting workspaces:', error);
      return [];
    }
  }

  /**
   * Get workspace details
   */
  async getWorkspaceDetails(workspaceSlug: string): Promise<any> {
    console.log(`🔍 Getting details for workspace: ${workspaceSlug}`);
    
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/workspace/${workspaceSlug}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const details = await response.json();
        console.log('✅ Workspace details:', details);
        return details;
      } else {
        console.log('❌ Failed to get workspace details:', response.status);
        return null;
      }
    } catch (error) {
      console.error('❌ Error getting workspace details:', error);
      return null;
    }
  }

  /**
   * Send chat message to workspace
   */
  async sendChatMessage(workspaceSlug: string, message: string): Promise<any> {
    console.log(`💬 Sending message to workspace ${workspaceSlug}: "${message}"`);
    
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/workspace/${workspaceSlug}/chat`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: message,
          sessionId: `teccia-z-${Date.now()}`,
          mode: 'chat'
        })
      });

      if (response.ok) {
        const chatResponse = await response.json();
        console.log('✅ Chat response:', chatResponse);
        return chatResponse;
      } else {
        const errorData = await response.text();
        console.log('❌ Chat failed:', response.status, errorData);
        return { error: true, status: response.status, message: errorData };
      }
    } catch (error) {
      console.error('❌ Error sending chat message:', error);
      return { error: true, message: error.message };
    }
  }

  /**
   * Stream chat message (real-time)
   */
  async streamChatMessage(workspaceSlug: string, message: string): Promise<any> {
    console.log(`🌊 Streaming message to workspace ${workspaceSlug}: "${message}"`);
    
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/workspace/${workspaceSlug}/stream-chat`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: message,
          sessionId: `teccia-z-${Date.now()}`,
          mode: 'chat'
        })
      });

      if (response.ok) {
        console.log('✅ Stream initiated successfully');
        return response;
      } else {
        const errorData = await response.text();
        console.log('❌ Stream failed:', response.status, errorData);
        return { error: true, status: response.status, message: errorData };
      }
    } catch (error) {
      console.error('❌ Error streaming chat message:', error);
      return { error: true, message: error.message };
    }
  }

  /**
   * Get system information
   */
  async getSystemInfo(): Promise<any> {
    console.log('🖥️ Getting system information...');
    
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/system`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const systemInfo = await response.json();
        console.log('✅ System info:', systemInfo);
        return systemInfo;
      } else {
        console.log('❌ Failed to get system info:', response.status);
        return null;
      }
    } catch (error) {
      console.error('❌ Error getting system info:', error);
      return null;
    }
  }
}

<<<<<<< HEAD
// Export the real connector
=======
// Export real connector
>>>>>>> a4b59d2c91f1579da11ec6e9c7fd5ff0af91d4a1
export const anythingLLMRealConnector = new AnythingLLMRealConnector(
  ANYTHINGLLM_API_KEY,
  ANYTHINGLLM_BASE_URL
);

export default anythingLLMRealConnector;