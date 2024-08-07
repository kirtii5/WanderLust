let center = [listing.geometry.longitude, listing.geometry.latitude];
var map = tt.map({
  key: mapToken,
  container: "map",
  center: center,
  zoom: 9,
});
map.addControl(new tt.FullscreenControl());
map.addControl(new tt.NavigationControl());
map.on("load", () => {

  let popup = new tt.Popup()
  .setHTML(`<h6>${listing.location}</h6><p>Exact location will be provided after booking</p>`);

  let marker = new tt.Marker({ color: "Red" })
  .setLngLat(center)
  .setPopup(popup)
  .addTo(map);

});
