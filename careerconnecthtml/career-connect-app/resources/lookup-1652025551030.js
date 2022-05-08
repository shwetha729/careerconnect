(function(window, undefined) {
  var dictionary = {
    "a977d5e3-69c5-49bb-8ccd-e00e958e6155": "Forum",
    "567eeee5-f0cc-48b1-a6ca-8ca6198ae1a7": "Login",
    "ea45652a-3c8f-472a-8f8f-c5fbd5af4ac1": "Niche",
    "f51e7d48-87a4-42b0-9574-8ae9ac5f2a7a": "Open to  Many",
    "dba89c72-9724-4747-84f6-d5e9dc1c9fee": "Events",
    "3b816b34-2fc8-4f55-9ab0-289c22e4d6b9": "Confirm",
    "f39803f7-df02-4169-93eb-7547fb8c961a": "Template 1",
    "bb8abf58-f55e-472d-af05-a7d1bb0cc014": "default"
  };

  var uriRE = /^(\/#)?(screens|templates|masters|scenarios)\/(.*)(\.html)?/;
  window.lookUpURL = function(fragment) {
    var matches = uriRE.exec(fragment || "") || [],
        folder = matches[2] || "",
        canvas = matches[3] || "",
        name, url;
    if(dictionary.hasOwnProperty(canvas)) { /* search by name */
      url = folder + "/" + canvas;
    }
    return url;
  };

  window.lookUpName = function(fragment) {
    var matches = uriRE.exec(fragment || "") || [],
        folder = matches[2] || "",
        canvas = matches[3] || "",
        name, canvasName;
    if(dictionary.hasOwnProperty(canvas)) { /* search by name */
      canvasName = dictionary[canvas];
    }
    return canvasName;
  };
})(window);