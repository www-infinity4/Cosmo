# Cosmo

Cosmo is the shared, repo-driven companion for Infinity TV channels. Each channel loads the same lightweight client and supplies the currently playing program, playback time, timestamped content index, and a response provider. Cosmo contains no show-specific dialogue.

## Responsibilities

- Retrieve the scene surrounding the viewer's current playback time.
- Build context from transcript words, visible objects, characters, relationships, themes, and connected concepts.
- Keep memory isolated by opaque user ID and program ID.
- Ask or answer grounded questions during a watch without talking over the program.
- Offer governed product discovery only when it is genuinely relevant and sourced live.
- Build a unique front/back card from an authorized frame or still, with program/time provenance.

## Channel hookup

```html
<link rel="stylesheet" href="https://www-infinity4.github.io/Cosmo/cosmo.css">
<div id="cosmo"></div>
<script src="https://www-infinity4.github.io/Cosmo/cosmo.js"></script>
<script>
Cosmo.mount({
  root: document.querySelector("#cosmo"),
  user: { id: signedInUserId || "guest" },
  program: () => ({ id: currentSlot.id, title: currentSlot.title, channel: "FOX" }),
  playback: () => ({ seconds: playerTime(), playing: true }),
  index: () => fetch(currentSlot.cosmoIndexUrl).then(r => r.json()),
  respond: payload => fetch("/api/cosmo/respond", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload)
  }).then(r => r.json()),
  discover: governedProductSearch,
  frame: authorizedFrameProvider
});
</script>
```

Pin a release URL when rolling Cosmo across every channel so one update can be tested before a network-wide promotion.

## Indexed-content contract

See `examples/program-index.json`. Each timestamped moment can contain transcript text, entities, visible objects, setting, actions, themes, relationships, related concepts, and source/provenance. The response provider must distinguish characters from real people and observations from inferences.

A noun such as a character name is not a hard-coded trigger. The index supplies the entity and its typed connections; retrieval supplies the current moment; the response provider uses those building blocks to make a scene-appropriate conversation.

## Product governance

Product suggestions must be optional, plainly labeled, scene-relevant, and passed through the channel's governance callback. Cosmo must not invent prices, stock, scarcity, vintage status, seller reputation, or product identity. Suggestions include a source URL and retrieval time. Sensitive-trait targeting and covert advertising are excluded.

## Cards and screen captures

Direct browser capture works only for same-origin or CORS-authorized video. YouTube and many third-party players block canvas capture. In those cases Cosmo requests an authorized still or user-approved screenshot and never claims a blocked frame was captured. A card is previewed before it is saved or minted.

## Fork roles

- [Artemis](https://github.com/www-infinity4/artemis): Android device automation and regression testing for the channel/Cosmo experience. It requires Python 3.12+, ADB, a connected device or emulator, and a configured model provider; it is not suitable for loading inside each static channel page.
- [God's Eye View](https://github.com/www-infinity4/gods-eye-view): a separate Cesium/Vite geospatial intelligence console. Its live-context and voice patterns are useful references, while its 3D globe and data-provider stack should remain optional rather than being bundled into TV channels.
