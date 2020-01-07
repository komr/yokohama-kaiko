(function() {
    let anchors = document.querySelectorAll('.leaflet-control-attribution > a');
    for(let a of anchors) {
        a.setAttribute('target', '_blank');
        a.setAttribute('rel', 'noopener noreferrer');
    }
})();
