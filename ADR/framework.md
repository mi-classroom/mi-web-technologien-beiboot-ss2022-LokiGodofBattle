# Framework

## Status

Accepted

## Context

Da es sich bei diesem Projekt um eine Webanwendung handelt muss ein Framework genutzt werden, dass sich für diesen Anwendungsfall eignet.
Auf Grund dessen, das ich schon Erfahrung mit p5.js hatte war dieses Framwork am naheliegensten.

## Decision

p5.js wird genutzt, auf Grund der simplen API und des starken Focus auf Visualisierung.
Außerdem hatte ich bisher noch keine schlechten Erfahrung mit p5.js gemacht.

## Consequences

So kann eine statische Webseite entwickelt werden welche die vorhandenen Daten visualisiert.
P5.js unterstützt keine Onclick Methode, auf Grund der verwendeten relationalen Positionierung der visuellen Objekte.
Auf Grund dessen müssen die Positionen der einzelnen Elemente seperat eigenständig nachverfolgt werden.
Mit diesen Werten muss anschließend eigenständig unter Verwendung von Vector Mathematik der Schnittpunkt des View Vectors mit den Bildern berechnet werden um diese anklickbar zu machen.