import { NextRequest, NextResponse } from 'next/server';

// AnythingLLM Real Connection Test
const ANYTHINGLLM_API_KEY = "HHNP18V-MRK4BT0-KS8T24F-9ZNMA2N";
const ANYTHINGLLM_BASE_URL = "https://orus.teccia.com.ar";

export async function GET() {
  console.log('🔐 Testing AnythingLLM Connection from backend...');
  
  try {
    // Test authentication
    const authResponse = await fetch(`${ANYTHINGLLM_BASE_URL}/api/v1/auth`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${ANYTHINGLLM_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('📊 Auth Response Status:', authResponse.status);

    if (authResponse.ok) {
      const authData = await authResponse.json();
      console.log('✅ Authentication successful:', authData);

      // Test workspaces
      const workspacesResponse = await fetch(`${ANYTHINGLLM_BASE_URL}/api/v1/workspaces`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${ANYTHINGLLM_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      if (workspacesResponse.ok) {
        const workspaces = await workspacesResponse.json();
        console.log('✅ Workspaces found:', workspaces);

        return NextResponse.json({
          success: true,
          auth: true,
          workspaces: workspaces,
          baseUrl: ANYTHINGLLM_BASE_URL,
          apiKeyPrefix: ANYTHINGLLM_API_KEY.substring(0, 8) + '...'
        });
      } else {
        const workspaceError = await workspacesResponse.text();
        console.log('❌ Failed to get workspaces:', workspacesResponse.status, workspaceError);
        
        return NextResponse.json({
          success: false,
          auth: true,
          workspaces: [],
          error: `Failed to get workspaces: ${workspacesResponse.status}`,
          details: workspaceError
        });
      }
    } else {
      const errorData = await authResponse.text();
      console.log('❌ Authentication failed:', authResponse.status, errorData);
      
      return NextResponse.json({
        success: false,
        auth: false,
        error: `Authentication failed: ${authResponse.status}`,
        details: errorData,
        baseUrl: ANYTHINGLLM_BASE_URL,
        apiKeyPrefix: ANYTHINGLLM_API_KEY.substring(0, 8) + '...'
      });
    }
  } catch (error) {
    console.error('❌ Connection error:', error);
    
    return NextResponse.json({
      success: false,
      auth: false,
      error: 'Connection error',
      details: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { workspaceSlug, message } = await request.json();
    
    if (!workspaceSlug || !message) {
      return NextResponse.json({
        success: false,
        error: 'Missing workspaceSlug or message'
      }, { status: 400 });
    }

    console.log(`💬 Sending message to workspace ${workspaceSlug}: "${message}"`);

    const chatResponse = await fetch(`${ANYTHINGLLM_BASE_URL}/api/v1/workspace/${workspaceSlug}/chat`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ANYTHINGLLM_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: message,
        sessionId: `teccia-z-${Date.now()}`,
        mode: 'chat'
      })
    });

    if (chatResponse.ok) {
      const responseData = await chatResponse.json();
      console.log('✅ Chat response:', responseData);
      
      return NextResponse.json({
        success: true,
        response: responseData
      });
    } else {
      const errorData = await chatResponse.text();
      console.log('❌ Chat failed:', chatResponse.status, errorData);
      
      return NextResponse.json({
        success: false,
        error: `Chat failed: ${chatResponse.status}`,
        details: errorData
      });
    }
  } catch (error) {
    console.error('❌ Chat error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Chat error',
      details: error instanceof Error ? error.message : String(error)
    });
  }
}