# Ollama

Official documentation: [Quickstart](https://docs.ollama.com/quickstart), [API introduction](https://docs.ollama.com/api/introduction), [Chat API](https://docs.ollama.com/api/chat). Source: [ollama/ollama](https://github.com/ollama/ollama).

Ollama packages model download, management, and serving behind a local service and API. It is useful for experimenting with supported local models or supplying inference to an application without embedding the model runtime in the application process.

Install Ollama for the operating system and choose a local model that fits the available hardware. Set `OLLAMA_MODEL` to its catalog identifier, then download it:

```bash
ollama pull "$OLLAMA_MODEL"
ollama run "$OLLAMA_MODEL"
```

The desktop application usually manages the server; on Linux, `ollama serve` starts it when needed. To call the local chat API from Python without another package:

```python
import json
import os
from urllib.request import Request, urlopen

payload = {"model": os.environ["OLLAMA_MODEL"], "stream": False,
           "messages": [{"role": "user", "content": "Explain a cache briefly."}]}
request = Request("http://localhost:11434/api/chat",
                  data=json.dumps(payload).encode(),
                  headers={"Content-Type": "application/json"})
with urlopen(request, timeout=120) as response:
    print(json.load(response)["message"]["content"])
```

The native API streams by default; `stream: false` requests one response object. Cloud models accessed through Ollama execute remotely, so record the actual model destination instead of inferring locality from the client URL.

Check memory use, context size, and throughput with concurrent conversations. Tool calling requires model support and correct application handling. Keep the server restricted to trusted access and treat model installation separately from business authorization or workflow durability.
