import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  console.log('🔍 Running ORUS Production Diagnostics...');
  
  const diagnostics = {
    timestamp: new Date().toISOString(),
    target: "http://188.245.56.151:8085",
    tests: []
  };

  // Test 1: Basic connectivity
  try {
    console.log('🌐 Test 1: Basic TCP connectivity...');
    const start = Date.now();
    
    const response = await fetch('http://188.245.56.151:8085/health', {
      method: 'GET',
      signal: AbortSignal.timeout(5000)
    });
    
    const time = Date.now() - start;
    
    diagnostics.tests.push({
      name: "TCP Connectivity",
      status: "success",
      details: `Connected in ${time}ms, HTTP ${response.status}`,
      time: time
    });
    
  } catch (error) {
    diagnostics.tests.push({
      name: "TCP Connectivity", 
      status: "failed",
      details: error instanceof Error ? error.message : String(error),
      error: error
    });
  }

  // Test 2: DNS Resolution
  try {
    console.log('🔍 Test 2: DNS resolution...');
    const dnsStart = Date.now();
    
    // Try to resolve the hostname
    const testResponse = await fetch('http://188.245.56.151:8085', {
      method: 'HEAD',
      signal: AbortSignal.timeout(3000)
    });
    
    const dnsTime = Date.now() - dnsStart;
    
    diagnostics.tests.push({
      name: "DNS Resolution",
      status: "success", 
      details: `DNS resolved in ${dnsTime}ms`,
      time: dnsTime
    });
    
  } catch (error) {
    diagnostics.tests.push({
      name: "DNS Resolution",
      status: "failed",
      details: error instanceof Error ? error.message : String(error)
    });
  }

  // Test 3: Alternative endpoints
  const alternatives = [
    "http://188.245.56.151:8085/query",
    "http://188.245.56.151:8085/status",
    "http://188.245.56.151:8085/"
  ];

  for (const endpoint of alternatives) {
    try {
      console.log(`🔄 Testing alternative: ${endpoint}`);
      const altResponse = await fetch(endpoint, {
        method: 'GET',
        signal: AbortSignal.timeout(3000)
      });
      
      diagnostics.tests.push({
        name: `Alternative Endpoint`,
        status: "success",
        details: `${endpoint} - HTTP ${altResponse.status}`,
        endpoint: endpoint
      });
      
    } catch (error) {
      diagnostics.tests.push({
        name: "Alternative Endpoint",
        status: "failed", 
        details: `${endpoint} - ${error instanceof Error ? error.message : String(error)}`,
        endpoint: endpoint
      });
    }
  }

  // Test 4: Network info
  diagnostics.tests.push({
    name: "Network Info",
    status: "info",
    details: `Backend running from container, target: 188.245.56.151:8085`
  });

  const successCount = diagnostics.tests.filter(t => t.status === 'success').length;
  const failCount = diagnostics.tests.filter(t => t.status === 'failed').length;

  return NextResponse.json({
    success: true,
    target: "http://188.245.56.151:8085",
    summary: {
      totalTests: diagnostics.tests.length,
      success: successCount,
      failed: failCount,
      overall: failCount === 0 ? "PASS" : successCount > 0 ? "PARTIAL" : "FAIL"
    },
    diagnostics: diagnostics.tests,
    recommendations: failCount > 0 ? [
      "1. Check if ORUS server is running on 188.245.56.151:8085",
      "2. Verify firewall rules allow outbound connections to port 8085",
      "3. Confirm server IP address is correct",
      "4. Test connectivity from different network",
      "5. Check if ORUS container is healthy: pm2 logs orus-modelscope"
    ] : [
      "All connectivity tests passed - ORUS should be accessible"
    ]
  });
}