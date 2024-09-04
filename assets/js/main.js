var html = document.documentElement;
var body = document.body;
var timeout;
var st = 0;

cover();
featured();
pagination(false);

window.addEventListener("scroll", function () {
  "use strict";
  if (
    body.classList.contains("home-template") &&
    body.classList.contains("with-full-cover") &&
    !document.querySelector(".cover").classList.contains("half")
  ) {
    if (timeout) {
      window.cancelAnimationFrame(timeout);
    }
    timeout = window.requestAnimationFrame(portalButton);
  }
});

if (
  document.querySelector(".cover") &&
  document.querySelector(".cover").classList.contains("half")
) {
  body.classList.add("portal-visible");
}

function portalButton() {
  "use strict";
  st = window.scrollY;

  if (st > 300) {
    body.classList.add("portal-visible");
  } else {
    body.classList.remove("portal-visible");
  }
}

function cover() {
  "use strict";
  var cover = document.querySelector(".cover");
  if (!cover) return;

  imagesLoaded(cover, function () {
    cover.classList.remove("image-loading");
  });

  document.querySelector(".cover-arrow").addEventListener("click", function () {
    var element = cover.nextElementSibling;
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

function featured() {
  "use strict";
  var feed = document.querySelector(".featured-feed");
  if (!feed) return;

  tns({
    container: feed,
    controlsText: [
      '<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M20.547 22.107L14.44 16l6.107-6.12L18.667 8l-8 8 8 8 1.88-1.893z"></path></svg>',
      '<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M11.453 22.107L17.56 16l-6.107-6.12L13.333 8l8 8-8 8-1.88-1.893z"></path></svg>',
    ],
    gutter: 30,
    loop: false,
    nav: false,
    responsive: {
      0: {
        items: 1,
      },
      768: {
        items: 2,
      },
      992: {
        items: 3,
      },
    },
  });
}

window.addEventListener("DOMContentLoaded", function () {
  console.log("hey");
  let map;

  const protocol = new pmtiles.Protocol();
  maplibregl.addProtocol("pmtiles", protocol.tile);

  const PMTILES_URL = "/assets/downtown.pmtiles";

  const p = new pmtiles.PMTiles(PMTILES_URL);

  p.getHeader().then((h) => {
    map = new maplibregl.Map({
      interactive: false,
      container: "map",
      zoom: h.maxZoom + 1,
      center: [h.centerLon, h.centerLat],
      style: {
        version: 8,
        sources: {
          example_source: {
            type: "vector",
            url: `pmtiles://${PMTILES_URL}`,
            attribution:
              '<a href="https://openstreetmap.org">OpenStreetMap</a>',
          },
        },
        layers: [
          {
            id: "roads",
            source: "example_source",
            "source-layer": "transportation",
            type: "line",
            paint: {
              "line-color": "black",
            },
          },
          {
            id: "park",
            type: "fill",
            source: "example_source",
            "source-layer": "park",
            paint: {
              "fill-color": "#d8e8c8",
              "fill-opacity": 0.7,
              "fill-outline-color": "rgba(95, 208, 100, 1)",
            },
          },
          {
            id: "park_outline",
            type: "line",
            source: "example_source",
            "source-layer": "park",
            paint: {
              "line-dasharray": [1, 1.5],
              "line-color": "rgba(228, 241, 215, 1)",
            },
          },
          {
            id: "buildings",
            source: "example_source",
            "source-layer": "building",
            type: "line",
            paint: {
              "line-color": "black",
            },
          },
          {
            id: "mask",
            source: "example_source",
            "source-layer": "mask",
            type: "fill",
            paint: {
              "fill-color": "white",
            },
          },
        ],
      },
    });

    map.on("load", function () {
      fetch("/assets/reroot.geojson")
        .then((response) => response.json())
        .then((data) => {
          map.addSource("reroot", {
            type: "geojson",
            data: data,
          });

          map.addLayer({
            id: "reroot-layer",
            type: "line",
            source: "reroot",
            layout: {
              "line-join": "round",
              "line-cap": "round",
            },
            paint: {
              "line-color": "#E26994",
              "line-width": 6,
            },
          });
        });
    });
  });

  protocol.add(p);
});
