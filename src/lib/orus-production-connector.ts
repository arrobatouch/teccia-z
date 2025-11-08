// ORUS Production Connector - Using real credentials from PDF
// PRIVATE: For production use only

interface ORUSProductionResponse {
  text?: string;
  audio?: string;
  status?: string;
  containers?: string[];
  capabilities?: string[];
  success?: boolean;
  error?: string;
}

class ORUSProductionConnector {
  private readonly ORUS_ENDPOINT = "http://188.245.56.151:8085";
  private readonly ANYTHINGLLM_ENDPOINT = "https://orus.teccia.com.ar";
  private readonly REALTIME_ENDPOINT = "https://orus.teccia.com.ar";
  
  // From PDF: Socket.IO namespaces
  private readonly NAMESPACES = {
    PANEL: "/panel",
    PORTERO: "/portero", 
    SISTEMA: "/sistema"
  };

  // From PDF: Container types and expected ports
  private readonly CONTAINER_TYPES = {
    VOICE: { name: "modelscope-voice", expected_ports: [8086, 8087] },
    VISION: { name: "modelscope-vision", expected_ports: [8088, 8089] },
    REASONING: { name: "modelscope-reasoning", expected_ports: [8090, 8091] }
  };

  private connectionStatus: 'disconnected' | 'connecting' | 'connected' = 'disconnected';
  private discoveredContainers: any[] = [];

  /**
   * Connect to ORUS production system
   */
  async connectToORUS(): Promise<boolean> {
    console.log('🔐 Connecting to ORUS Production System...');
    this.connectionStatus = 'connecting';
    
    try {
      // 1. Test main ORUS endpoint with timeout and retry
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
      
      const response = await fetch(`${this.ORUS_ENDPOINT}/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer orus_admin_2025`,
          'X-ORUS-Token': 'orus_admin_2025',
          'User-Agent': 'TECCIA-Z-Panel/1.3.0'
        },
        body: JSON.stringify({
          text: "ORUS, sistema TECCIA-Z solicitando conexión. Estado del sistema.",
          source: "TECCIA-Z Control Panel",
          timestamp: new Date().toISOString(),
          session_id: "teccia-z-session-" + Date.now()
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const result = await response.json();
        console.log('✅ ORUS Production Connection Successful:', result);
        this.connectionStatus = 'connected';
        
        // 2. Test Socket.IO connection
        await this.connectSocketIO();
        
        return true;
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('❌ ORUS Production Connection Failed:', error);
      this.connectionStatus = 'disconnected';
      return false;
    }
  }

  /**
   * Discover Modelscope containers based on PDF architecture
   */
  async discoverModelscopeContainers(): Promise<any[]> {
    console.log('🔦 Discovering Modelscope Containers...');
    
    const discovered = [];
    
    // Scan for each container type from PDF
    for (const [type, config] of Object.entries(this.CONTAINER_TYPES)) {
      for (const port of config.expected_ports) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 3000);
          
          const response = await fetch(`http://188.245.56.151:${port}/health`, {
            method: 'GET',
            signal: controller.signal
          });
          
          clearTimeout(timeoutId);
          
          if (response.ok) {
            const containerInfo = await response.json();
            discovered.push({
              name: config.name,
              port: port,
              type: type.toLowerCase(),
              status: 'active',
              info: containerInfo
            });
            
            console.log(`✅ Found ${config.name} at port ${port}`);
          }
        } catch (error) {
          // Port not responding, continue
        }
      }
    }
    
    this.discoveredContainers = discovered;
    return discovered;
  }

  /**
   * Connect to AnythingLLM workspace
   */
  async connectToAnythingLLM(): Promise<boolean> {
    console.log('📚 Connecting to AnythingLLM...');
    
    try {
      const response = await fetch(`${this.ANYTHINGLLM_ENDPOINT}/api/v1/workspace/default/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: "TECCIA-Z system connection test",
          sessionId: "teccia-z-" + Date.now()
        })
      });

      if (response.ok) {
        console.log('✅ AnythingLLM Connection Successful');
        return true;
      }
    } catch (error) {
      console.log('⚠️ AnythingLLM Connection Failed:', error);
    }
    
    return false;
  }

  /**
   * Test Socket.IO connection to Realtime server
   */
  async testRealtimeConnection(): Promise<boolean> {
    console.log('🌐 Testing Socket.IO Realtime Connection...');
    
    try {
      // Test basic connection to realtime server
      const response = await fetch(`${this.REALTIME_ENDPOINT}/socket.io/`, {
        method: 'GET'
      });
      
      if (response.ok) {
        console.log('✅ Socket.IO server reachable');
        return true;
      } else {
        console.log('❌ Socket.IO server not reachable');
        return false;
      }
    } catch (error) {
      console.log('⚠️ Realtime Connection Failed:', error);
      return false;
    }
  }

  /**
   * Connect to Socket.IO for real-time communication
   */
  async connectSocketIO(): Promise<boolean> {
    console.log('🔌 Connecting to ORUS Socket.IO...');
    
    try {
      // This would be implemented in the frontend
      // For now, just test the endpoint
      return await this.testRealtimeConnection();
    } catch (error) {
      console.error('❌ Socket.IO Connection Failed:', error);
      return false;
    }
  }

  /**
   * Send production query to ORUS
   */
  async queryORUS(text: string): Promise<ORUSProductionResponse> {
    if (this.connectionStatus === 'disconnected') {
      await this.connectToORUS();
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout
      
      const response = await fetch(`${this.ORUS_ENDPOINT}/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer orus_admin_2025`,
          'X-ORUS-Token': 'orus_admin_2025',
          'User-Agent': 'TECCIA-Z-Panel/1.3.0'
        },
        body: JSON.stringify({ 
          text: text,
          source: "TECCIA-Z Control Panel",
          timestamp: new Date().toISOString()
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const result = await response.json();
        console.log('✅ ORUS Response:', result);
        return result;
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('❌ ORUS Query Failed:', error);
      return {
        success: false,
        error: error.message,
        text: "Error connecting to ORUS production system"
      };
    }
  }

  /**
   * Get complete system status
   */
  async getSystemStatus() {
    return {
      connectionStatus: this.connectionStatus,
      discoveredContainers: this.discoveredContainers,
      endpoints: {
        orus: this.ORUS_ENDPOINT,
        anythingllm: this.ANYTHINGLLM_ENDPOINT,
        realtime: this.REALTIME_ENDPOINT
      },
      namespaces: this.NAMESPACES,
      containerTypes: this.CONTAINER_TYPES
    };
  }

  /**
   * Execute OIKO system commands
   */
  async executeOikoCommand(command: string, target?: string): Promise<ORUSProductionResponse> {
    const oikoCommands = [
      "ORUS, muestra estado de los porteros",
      "ORUS, lista contenedores activos", 
      "ORUS, sincronizar llaves del sistema",
      "ORUS, estado del ecosistema OIKO",
      "ORUS, monitorear tenants activos"
    ];

    const query = oikoCommands.includes(command) ? command : `ORUS, ${command}`;
    
    if (target) {
      return await this.queryORUS(`${query} para ${target}`);
    }
    
    return await this.queryORUS(query);
  }
}

// Export production-ready instance
export const orusProductionConnector = new ORUSProductionConnector();
export default orusProductionConnector;