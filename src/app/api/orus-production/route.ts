import { NextRequest, NextResponse } from 'next/server';

// ORUS Production Connector - Real endpoints
const ORUS_ENDPOINT = "http://188.245.56.151:8085";
const ANYTHINGLLM_ENDPOINT = "https://orus.teccia.com.ar";
const REALTIME_ENDPOINT = "https://realtime.teccia.com.ar";

// Container types and expected ports
const CONTAINER_TYPES = {
  VOICE: { name: "modelscope-voice", expected_ports: [8086, 8087] },
  VISION: { name: "modelscope-vision", expected_ports: [8088, 8089] },
  REASONING: { name: "modelscope-reasoning", expected_ports: [8090, 8091] }
};

export async function GET() {
  console.log('🔐 Testing ORUS Production Connection from backend...');
  
  try {
    // 1. Test ORUS main connection
    console.log('🧠 Connecting to ORUS Production...');
    const orusResponse = await fetch(`${ORUS_ENDPOINT}/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: "ORUS, sistema TECCIA-Z solicitando conexión. Estado del sistema.",
        source: "TECCIA-Z Control Panel",
        timestamp: new Date().toISOString()
      })
    });

    let orusConnected = false;
    let orusResponseData = null;

    if (orusResponse.ok) {
      orusResponseData = await orusResponse.json();
      console.log('✅ ORUS Production Connection Successful:', orusResponseData);
      orusConnected = true;
    } else {
      console.log('❌ ORUS Production Connection Failed:', orusResponse.status, orusResponse.statusText);
    }

    // 2. Discover Modelscope containers
    console.log('🔦 Discovering Modelscope Containers...');
    const discovered = [];
    
    for (const [type, config] of Object.entries(CONTAINER_TYPES)) {
      for (const port of config.expected_ports) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 3000);
          
          const containerResponse = await fetch(`http://188.245.56.151:${port}/health`, {
            method: 'GET',
            signal: controller.signal
          });
          
          clearTimeout(timeoutId);
          
          if (containerResponse.ok) {
            const containerInfo = await containerResponse.json();
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

    // 3. Test AnythingLLM connection
    console.log('📚 Testing AnythingLLM Connection...');
    let anythingllmConnected = false;
    
    try {
      const anythingllmResponse = await fetch(`${ANYTHINGLLM_ENDPOINT}/api/v1/auth`, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer HHNP18V-MRK4BT0-KS8T24F-9ZNMA2N',
          'Content-Type': 'application/json'
        }
      });

      if (anythingllmResponse.ok) {
        console.log('✅ AnythingLLM Connection Successful');
        anythingllmConnected = true;
      }
    } catch (error) {
      console.log('⚠️ AnythingLLM Connection Failed:', error);
    }

    // 4. Test Realtime connection
    console.log('🌐 Testing Socket.IO Realtime Connection...');
    let realtimeConnected = false;
    
    try {
      const realtimeResponse = await fetch(`${REALTIME_ENDPOINT}/socket.io/`, {
        method: 'GET'
      });
      
      realtimeConnected = realtimeResponse.ok;
    } catch (error) {
      console.log('⚠️ Realtime Connection Failed:', error);
    }

    return NextResponse.json({
      success: true,
      orus: {
        connected: orusConnected,
        endpoint: ORUS_ENDPOINT,
        response: orusResponseData
      },
      containers: {
        discovered: discovered,
        total: discovered.length
      },
      anythingllm: {
        connected: anythingllmConnected,
        endpoint: ANYTHINGLLM_ENDPOINT
      },
      realtime: {
        connected: realtimeConnected,
        endpoint: REALTIME_ENDPOINT
      },
      systemStatus: {
        overall: orusConnected && discovered.length > 0 ? 'OPERATIONAL' : 'PARTIAL',
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ ORUS Production Connection Error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Connection error',
      details: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();
    
    if (!query) {
      return NextResponse.json({
        success: false,
        error: 'Missing query parameter'
      }, { status: 400 });
    }

    console.log(`📤 Sending ORUS Production query: "${query}"`);

    const orusResponse = await fetch(`${ORUS_ENDPOINT}/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        text: query,
        source: "TECCIA-Z Control Panel",
        timestamp: new Date().toISOString()
      })
    });

    if (orusResponse.ok) {
      const responseData = await orusResponse.json();
      console.log('✅ ORUS Production Response:', responseData);
      
      return NextResponse.json({
        success: true,
        response: responseData
      });
    } else {
      const errorData = await orusResponse.text();
      console.log('❌ ORUS Production Query Failed:', orusResponse.status, errorData);
      
      return NextResponse.json({
        success: false,
        error: `ORUS Query failed: ${orusResponse.status}`,
        details: errorData
      });
    }
  } catch (error) {
    console.error('❌ ORUS Production Query Error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'ORUS Query error',
      details: error instanceof Error ? error.message : String(error)
    });
  }
}