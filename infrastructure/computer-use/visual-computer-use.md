# Visual computer use

Visual computer use operates from rendered pixels or screenshots. The model interprets visible controls and produces actions such as coordinates, clicks, drags, or text entry.

It can work across applications without bespoke integrations, but layout changes, overlays, animation, display scaling, and ambiguous controls can make execution brittle.

Coordinates belong to an observation's coordinate system. If an executor resizes a screenshot before sending it to the model, it must map returned positions back to desktop coordinates. A click at `(300, 200)` in a half-size screenshot corresponds to `(600, 400)` on the original display without a crop or offset. Cropping and multiple displays require additional transformations.

Observe again after an action that may change layout, open a window, or scroll the page. Reusing coordinates from an earlier screen can activate a different control. Waiting for a stable visual state and inspecting the outcome are more reliable than assuming a fixed delay always suffices.

A useful task trace includes the screenshot identity, its dimensions, the requested action, the executor result, and the next observation. This separates incorrect visual interpretation from incorrect coordinate conversion or an application failure. Use smaller verified action groups near consequential transitions, and stop when the visible target is ambiguous. Screenshot access can expose sensitive information even when the agent has no direct file-reading tool.
