<script>
(function (global) {

  const state = {
    locked: true,
    root: false,

    // DEFAULT BASE USED FOR GIS
    base: "https://raw.githubusercontent.com/WFIS01/gis/refs/heads/main/"
  };

  const gis = {};

  gis.root = () => {
    state.root = true;
    console.warn("[GIS] root enabled");
  };

  gis.unlock = () => {
    if (!state.root) {
      throw new Error("GIS: call gis.root() first");
    }
    state.locked = false;
    console.warn("[GIS] UNLOCKED — external GIS allowed");
  };

  gis.setBase = (url) => {
    if (state.locked) {
      throw new Error("GIS is locked");
    }
    if (!url.endsWith("/")) url += "/";
    state.base = url;
    console.warn("[GIS] Base GIS source set to:", url);
  };

  gis.run = async (code, input = {}) => {
    if (!/^[0-9]+$/.test(String(code))) {
      throw new Error("GIS: invalid code");
    }

    const url = state.base + code + ".gis";

    const res = await fetch(url);
    if (!res.ok) {
      throw new Error("GIS: failed to fetch " + url);
    }

    const src = await res.text();

    const fn = new Function(
      "input",
      `"use strict";\n${src}\nreturn run(input);`
    );

    return await fn(input);
  };

  global.gis = gis;

})(window);
</script>
