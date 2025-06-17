let map;
let drawingManager;
let currentPolygon = null;
let polygons = [];

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 35.6996, lng: 139.7652 },
    zoom: 14,
  });

  drawingManager = new google.maps.drawing.DrawingManager({
    drawingMode: google.maps.drawing.OverlayType.POLYGON,
    drawingControl: true,
    drawingControlOptions: {
      position: google.maps.ControlPosition.TOP_LEFT,
      drawingModes: ["polygon"],
    },
    polygonOptions: {
      editable: true,
      draggable: false,
    },
  });

  drawingManager.setMap(map);

  google.maps.event.addListener(drawingManager, "overlaycomplete", function (event) {
    if (event.type === "polygon") {
      currentPolygon = event.overlay;
      drawingManager.setDrawingMode(null);
      showForm(currentPolygon);
    }
  });
}

function showForm(polygon) {
  document.getElementById("info-form").classList.remove("hidden");

  polygon.addListener("click", () => showForm(polygon));

  polygon.addListener("rightclick", () => {
    polygon.setMap(null);
    polygons = polygons.filter(p => p !== polygon);
  });

  currentPolygon = polygon;
}

function savePolygonData() {
  const date = document.getElementById("date").value;
  const name = document.getElementById("name").value;

  if (!date) {
    alert("実施日は必須です");
    return;
  }

  currentPolygon.metadata = { date, name };

  const info = new google.maps.InfoWindow({
    content: `<div><strong>実施日:</strong> ${date}<br><strong>名前:</strong> ${name || "なし"}</div>`,
  });

  google.maps.event.addListener(currentPolygon, "click", function (e) {
    info.setPosition(e.latLng);
    info.open(map);
  });

  polygons.push(currentPolygon);
  currentPolygon = null;
  hideForm();
}

function cancelEdit() {
  if (currentPolygon) {
    currentPolygon.setMap(null);
    currentPolygon = null;
  }
  hideForm();
}

function hideForm() {
  document.getElementById("info-form").classList.add("hidden");
  document.getElementById("date").value = "";
  document.getElementById("name").value = "";
}
