# Vertex AI Agent Engine and Agent Platform Runtime

Official documentation: [Managed runtime overview](https://docs.cloud.google.com/gemini-enterprise-agent-platform/scale), [Environment setup](https://docs.cloud.google.com/gemini-enterprise-agent-platform/build/runtime/setup), [Use an ADK agent](https://docs.cloud.google.com/gemini-enterprise-agent-platform/scale/runtime/use-an-adk-agent).

Vertex AI Agent Engine's documentation now leads to Gemini Enterprise Agent Platform and its managed Agent Runtime. The runtime deploys and operates agent applications with managed sessions and integrations. Google ADK is one supported framework; Gemini model inference is another, separate service boundary.

The setup requires a Google Cloud project, an eligible region, enabled services, application credentials, and suitable IAM roles. Build and validate the agent locally, package its dependencies, and deploy it using the official runtime guide. A model API key alone does not deploy an agent service.

For an existing ADK deployment, the REST API avoids coupling this example to an SDK generation. Install `google-auth` and `requests`, configure application credentials, and set `GOOGLE_CLOUD_LOCATION`, `AGENT_RESOURCE` (the full deployed resource name), and `APPLICATION_USER_ID`:

```python
import os
import google.auth
from google.auth.transport.requests import Request
import requests

credentials, _ = google.auth.default(
    scopes=["https://www.googleapis.com/auth/cloud-platform"]
)
credentials.refresh(Request())
location = os.environ["GOOGLE_CLOUD_LOCATION"]
resource = os.environ["AGENT_RESOURCE"]
url = f"https://{location}-aiplatform.googleapis.com/v1/{resource}:streamQuery"
with requests.post(
    url, params={"alt": "sse"}, stream=True, timeout=(10, 120),
    headers={"Authorization": f"Bearer {credentials.token}"},
    json={"class_method": "async_stream_query", "input": {
        "user_id": os.environ["APPLICATION_USER_ID"],
        "message": "Report the capabilities of this agent.",
    }},
) as response:
    response.raise_for_status()
    for line in response.iter_lines(decode_unicode=True):
        if line:
            print(line)
```

The ADK deployment supports session creation, listing, retrieval, deletion, and streamed queries. Omitting a session ID creates a session for the query; a continuing product conversation should map to the correct existing session.

Derive `APPLICATION_USER_ID` from authenticated application identity in production. IAM governs access to cloud resources but does not automatically implement workspace membership in your product. Keep application operations authorized at their business-service boundary. Match SDK examples to their installation guide: the current documentation contains both `agentplatform` runtime examples and `vertexai` setup examples. Verify the installed client surface before combining them.
