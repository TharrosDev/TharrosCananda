// Coastlines and graticule live in public/atlantic-map.svg (Natural Earth 50m land, public domain,
// orthographic projection centred on 30°N 35°W) so they are cached apart from the page. Route is the
// great-circle path Ottawa → Brussels. Paths are static; regenerate only if the frame changes.
export const ROUTE =
  "M67.1 235.5L75.5 233L84 230.5L92.6 228.1L101.2 225.8L109.9 223.5L118.6 221.2L127.4 219.1L136.2 216.9L145.1 214.8L154.1 212.8L163.1 210.8L172.1 208.9L181.1 207L190.2 205.2L199.4 203.4L208.6 201.7L217.8 200.1L227 198.5L236.3 197L245.6 195.5L254.9 194.1L264.3 192.7L273.6 191.4L283 190.2L292.4 189L301.9 187.9L311.3 186.9L320.7 185.9L330.2 184.9L339.6 184L349.1 183.2L358.6 182.5L368 181.8L377.5 181.1L387 180.6L396.4 180.1L405.9 179.6L415.3 179.2L424.7 178.9L434.1 178.6L443.5 178.4L452.9 178.3L462.3 178.2L471.6 178.2L480.9 178.3L490.2 178.4L499.4 178.6L508.7 178.8L517.9 179.1L527 179.4L536.1 179.9L545.2 180.3L554.2 180.9L563.2 181.5L572.2 182.2L581.1 182.9L589.9 183.7L598.8 184.5L607.5 185.4L616.2 186.4";

export function AtlanticMap() {
  return (
    <figure className="atlantic-map">
      <div className="atlantic-map-plate">
        <svg
          viewBox="0 0 720 420"
          role="img"
          aria-labelledby="atlantic-map-title atlantic-map-desc"
        >
          <title id="atlantic-map-title">The North Atlantic between Canada and Europe</title>
          <desc id="atlantic-map-desc">
            Coastlines of eastern Canada and western Europe with the 5,674 km great-circle route
            from Ottawa to Brussels.
          </desc>
          <image href="/atlantic-map.svg" width="720" height="420" />
          <path className="atlantic-map-route" d={ROUTE} pathLength={1} />
          <circle className="atlantic-map-node" cx="67.1" cy="235.5" r="5" />
          <circle className="atlantic-map-node" cx="616.2" cy="186.4" r="5" />
        </svg>
        <p className="atlantic-map-label" style={{ left: "9.3%", top: "56.1%" }}>
          <strong>Ottawa</strong> <span>45.42°N 75.70°W</span>
        </p>
        <p className="atlantic-map-label is-end" style={{ left: "85.6%", top: "44.4%" }}>
          <strong>Brussels</strong> <span>50.85°N 4.35°E</span>
        </p>
        <p
          className="atlantic-map-distance"
          aria-hidden="true"
          style={{ left: "47.2%", top: "43.8%" }}
        >
          5,674 km
        </p>
      </div>
      <figcaption>
        <span>Great-circle route, Ottawa to Brussels</span>
        <span>Coastlines: Natural Earth</span>
      </figcaption>
    </figure>
  );
}
