// ORUS Connector - Primera conexión con el ecosistema ORUS
// Basado en la arquitectura de las 3 partes proporcionadas

interface ORUSResponse {
  text?: string;
  audio?: string;
  status?: string;
  containers?: string[];
  capabilities?: string[];
}

interface ORUSContainer {
  name: string;
  port: number;
  type: 'voice' | 'vision' | 'reasoning' | 'test';
  status: 'active' | 'inactive';
}

class ORUSConnector {
  private readonly ORUS_MAIN_ENDPOINT = 'http://188.245.56.151:8085';
  private readonly ANYTHINGLLM_ENDPOINT = 'https://orus.teccia.com.ar';
  
  private discoveredContainers: ORUSContainer[] = [];
  private connectionStatus: 'disconnected' | 'connecting' | 'connected' = 'disconnected';

  /**
   * Fase 1: Descubrimiento del ecosistema ORUS
   */
  async discoverEcosystem(): Promise<void> {
    console.log('🔍 Iniciando descubrimiento del ecosistema ORUS...');
    
    try {
      // 1. Conectar con ORUS principal
      await this.connectToMainORUS();
      
      // 2. Escanear contenedores Modelscope
      await this.scanModelscopeContainers();
      
      // 3. Verificar AnythingLLM
      await this.checkAnythingLLM();
      
      console.log('✅ Descubrimiento completado');
    } catch (error) {
      console.error('❌ Error en descubrimiento:', error);
      throw error;
    }
  }

  /**
   * Conexión principal con ORUS
   */
  private async connectToMainORUS(): Promise<void> {
    console.log('🔌 Conectando con ORUS principal...');
    
    const diagnosticQuery = {
      text: "ORUS, soy un nuevo asistente de IA. Necesito entender tu arquitectura actual. ¿Qué contenedores Modelscope tienes activos? ¿En qué puertos corren tus servicios? ¿Qué capacidades tienes disponibles?"
    };

    try {
      const response = await fetch(`${this.ORUS_MAIN_ENDPOINT}/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(diagnosticQuery)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result: ORUSResponse = await response.json();
      console.log('✅ Conexión exitosa con ORUS:', result);
      
      this.connectionStatus = 'connected';
      return result;
    } catch (error) {
      console.error('❌ Error conectando con ORUS principal:', error);
      throw error;
    }
  }

  /**
   * Escanear contenedores Modelscope en puertos consecutivos
   */
  private async scanModelscopeContainers(): Promise<void> {
    console.log('🔦 Escaneando contenedores Modelscope...');
    
    const possiblePorts = [8086, 8087, 8088, 8089, 8090]; // Puertos probables
    
    for (const port of possiblePorts) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const response = await fetch(`http://188.245.56.151:${port}/health`, {
          method: 'GET',
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          const containerInfo = await response.json();
          this.discoveredContainers.push({
            name: containerInfo.name || `container-${port}`,
            port: port,
            type: this.inferContainerType(containerInfo.name || ''),
            status: 'active'
          });
          
          console.log(`✅ Contenedor encontrado en puerto ${port}:`, containerInfo);
        }
      } catch (error) {
        // Puerto no responde, continuamos
        console.log(`⚪ Puerto ${port} sin respuesta`);
      }
    }
  }

  /**
   * Verificar conexión con AnythingLLM
   */
  private async checkAnythingLLM(): Promise<void> {
    console.log('📚 Verificando AnythingLLM...');
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(`${this.ANYTHINGLLM_ENDPOINT}/api/v1/info`, {
        method: 'GET',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        console.log('✅ AnythingLLM accesible');
      } else {
        console.log('⚠️ AnythingLLM no responde como se esperaba');
      }
    } catch (error) {
      console.log('⚠️ No se puede conectar con AnythingLLM:', error);
    }
  }

  /**
   * Inferir tipo de contenedor basado en su nombre
   */
  private inferContainerType(name: string): 'voice' | 'vision' | 'reasoning' | 'test' {
    const lowerName = name.toLowerCase();
    
    if (lowerName.includes('voice') || lowerName.includes('speech') || lowerName.includes('tts')) {
      return 'voice';
    } else if (lowerName.includes('vision') || lowerName.includes('image') || lowerName.includes('video')) {
      return 'vision';
    } else if (lowerName.includes('reasoning') || lowerName.includes('logic') || lowerName.includes('agent')) {
      return 'reasoning';
    } else {
      return 'test';
    }
  }

  /**
   * Enviar consulta a ORUS
   */
  async queryORUS(text: string): Promise<ORUSResponse> {
    if (this.connectionStatus === 'disconnected') {
      throw new Error('ORUS no está conectado. Ejecuta discoverEcosystem() primero.');
    }

    try {
      const response = await fetch(`${this.ORUS_MAIN_ENDPOINT}/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('❌ Error en consulta a ORUS:', error);
      throw error;
    }
  }

  /**
   * Obtener estado del sistema
   */
  getSystemStatus() {
    return {
      connectionStatus: this.connectionStatus,
      discoveredContainers: this.discoveredContainers,
      mainEndpoint: this.ORUS_MAIN_ENDPOINT,
      anythingLLMEndpoint: this.ANYTHINGLLM_ENDPOINT
    };
  }

  /**
   * Probar conexión con un contenedor específico
   */
  async testContainer(container: ORUSContainer): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      const response = await fetch(`http://188.245.56.151:${container.port}/health`, {
        method: 'GET',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      return response.ok;
    } catch (error) {
      return false;
    }
  }
}

// Exportar instancia única
export const orusConnector = new ORUSConnector();
export default orusConnector;