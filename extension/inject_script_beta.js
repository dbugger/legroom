(function() {

function observeDom() {
  new MutationObserver(function(mutations, o) {
    mutations.forEach(function(m) {
      if (m.type != 'childList' || m.addedNodes.length <= 0) {
        return;
      }
      try {
        for (var i = 0; i < m.addedNodes.length; i++) {
          handleAddedNode(m.addedNodes.item(i));
        }
      } catch(e) {
        console.log(e);
      }
    });
  }).observe(document.body, { childList: true, subtree: true });

  function handleAddedNode(node) {
    if (node.classList &&
        //node.classList.contains('Vhw2sf')) {
        //node.classList.contains('yCTReb')) {
        node.classList.contains('EJKJ7')) {
        //node.classList.contains('tEXind')) {
        //node.classList.contains('gws-flights-results__heading-disclaimer')) {
      handleHeader(node);
      return;
    }
    if (node.tagName = 'DIV' &&
        //node.getAttribute && node.getAttribute('role') == 'listitem' &&
        node.classList &&
        node.classList.contains('gQ6yfe') &&
        node.hasAttribute && 
        node.hasAttribute('data-ved') &&
        node.hasAttribute('data-id')) {
      handleExpandableCard(node);
      return;
    }
    if (node.childNodes) {
      for (var i = 0; i < node.childNodes.length; i++) {
        handleAddedNode(node.childNodes.item(i));
      }
    }
  }
}

let elementReattacher = new MutationObserver(function(mutations, o) {
  mutations.forEach(function(m) {
    if (m.type = 'childList' && m.removedNodes.length > 0) {
      for (let i = 0; i < m.removedNodes.length; i++) {
        let removedNode = m.removedNodes.item(i);
        if (removedNode.classList && (
            removedNode.classList.contains('legroom-header') ||
            removedNode.classList.contains('legroom-row-extend') 
          )) {
          // Let's reattach this.
          let parent = m.target;
          parent.appendChild(removedNode);
          //window.setTimeout(() => { parent.appendChild(removedNode); }, 0);
        }
      }
    }
  });
});

function handleHeader(header) {
  if (document.querySelector('.legroom-header')) {
    // Already added. Skip.
    return;
  }
  header = header || document.querySelector('.EJKJ7');
  if (!header) {
    return;  // No need to do anything.
  }
  // Append spacer.
  let div = document.createElement('div');
  div.classList.add('legroom-header');
  div.innerText = 'Enhanced by Legroom for Google Flights.';
  header.appendChild(div);

  elementReattacher.observe(header, { childList: true });
}

function handleExpandableCard(node) {
  let itineraryId = node.getAttribute('data-id');
  let row = node.querySelector('div.OgQvJf .KhL0De');
  if(!row) {
    return;  // Not a flight list item.
  }
  
  extendRow(row, itineraryId);
  return;
}

function findCssClass(elem, regex) {
  for (let i = 0; i < elem.classList.length; i++) {
    let cssClass = elem.classList.item(i);
    if (cssClass.match(regex)) {
      return cssClass;
    }
  }
  return null;
}

function extractAmenities(item) {
  if (!item.classList) {
    return;
  }
  let resultCssClass = findCssClass(item, /gws-flights-results__.*/);
  if (!resultCssClass || item.style.display == 'none') {
    // ignore display:none items.
    return;
  }
  let name = resultCssClass.match(/__(.*)$/)[1];
  if (name.match(/seat-.*/)) {
    let m = item.innerText.match(/\(([^\)]*)\)/) ||
        item.innerText.match(/(.*) seat/);
    return {
      name: 'seat',
      cssClass: resultCssClass,
      text: m && m[1] || item.innerText
    };
  }
  if (name.match(/on-demand-video|live-tv|streaming-video/)) {
    return {
      name: 'video',
      cssClass: resultCssClass,
      alt: item.innerText
    };
  }
  // known names: wifi, power.
  return { name: name, cssClass: resultCssClass, alt: item.innerText };
}

let settings = {
  legroom: true,
  aircraft: true,
  carryon: true,
  wifi: true,
  power: true,
  video: true,
  inch: false
};

function extendRow(rowElem, itineraryId) {
  // Do not repeat.
  let wrap = rowElem.querySelector('.legroom-row-extend');
  if (!wrap) {
    wrap = document.createElement('div');
    wrap.classList.add('legroom-row-extend');
    wrap.setAttribute('itin-id', itineraryId);
    rowElem.appendChild(wrap);

    elementReattacher.observe(rowElem, { childList: true });
  }

  try {
    let data = window.taco5.flightdata.get(itineraryId);
    if (data) {
      updateRow(wrap, data);
    }
  } catch(e) {
    console.error(e);
    throw e;
  }
}

function updateRow(rowExtend, value) {
  // Clearup existing children.
  rowExtend.replaceChildren();
  let legs = value.flights;
  if (settings.aircraft) {
    rowExtend.appendChild(buildAmenitiesIcon(legs, 'wifi'));
  }
  if (settings.aircraft) {
    rowExtend.appendChild(buildAmenitiesIcon(legs, 'power'));
  }
  if (settings.aircraft) {
    rowExtend.appendChild(buildAmenitiesIcon(legs, 'video'));
  }
  if (settings.aircraft) {
    rowExtend.appendChild(buildAmenitiesText(legs, 'aircraft'));
  }
  if (settings.legroom) {
    rowExtend.appendChild(buildAmenitiesLegroom(legs));
  }
}

if (!Object.clone) {
  Object.clone = function(that) {
    if (!that) return that;
    let o = {};
    Object.keys(that).forEach(key => o[key] = that[key]);
    return o;
  }
}

function buildAmenitiesElement(legs, amenityName, builder) {
  let elem = document.createElement('div')
  elem.classList.add(amenityName);
  legs.slice(0, 2).forEach((leg, i) => {
    let amenity = leg[amenityName];
    elem.appendChild(builder(amenity, i));
  });
  return elem;
}

function buildAmenitiesText(legs, amenityName, cssClass) {
  function legElemBuilder(amenity) {
    let leg = document.createElement('div');
    leg.classList.add('leg');
    if (amenity) {
      leg.innerText = amenity;
      leg.title = amenity;
      if (amenity.cssClass) {
        leg.classList.add(amenity.cssClass);
      }
    }
    return leg;
  }

  return buildAmenitiesElement(legs, amenityName, legElemBuilder);
}

function buildAmenitiesIcon(legs, amenityName) {
  function legElemBuilder(amenity) {
    let leg = document.createElement('div');
    leg.classList.add('leg');
    if (isBoolean(amenity)) {
      if (!amenity) {
        leg.classList.add('none');
      }
    } else { // Not boolean. Add the value into classname instead.
      leg.classList.add(amenity);
    }
    return leg;
  }

  return buildAmenitiesElement(legs, amenityName, legElemBuilder);
}

function buildAmenitiesLegroom(legs) {
  function legElemBuilder(amenity, i) {
    let leg = document.createElement('div');
    leg.classList.add('leg');
    // Check if legroom length exists.
    // If no, just use info.
    // If yes, use it and use info for css class.
    if (legs[i].legroomLength) {
      leg.innerText = legs[i].legroomLength;
      leg.title = legs[i].legroomLength;
      leg.classList.add(legs[i].legroomInfo.toLowerCase());
    } else if (legs[i].legroomInfo) {
      leg.classList.add('icon');
      leg.classList.add(legs[i].legroomInfo.toLowerCase().replace(' ', '-'));
      leg.title = legs[i].legroomInfo;
    }
    return leg;
  }

  return buildAmenitiesElement(legs, 'legroomLength', legElemBuilder);
}

function isBoolean(value) {
  if (value == 'true' || value == 'false' || value === true || value === false) {
    return true;
  }
  return false;
}

// Look for expandable list items and augment them all.
function queryAndExtend() {
  let nodes = document.querySelectorAll('div[data-ved][data-id]');
  if (nodes.length > 0) {
    nodes.forEach(handleExpandableCard);
    handleHeader();
  }
  observeDom();
}

console.log('Legroom extension for Google Flights v1.9.6.');
// Do it at least once.
queryAndExtend();

window.taco5.flightdata.addListener(function(id, data) {
  let extensionElem =
      document.querySelector('div.legroom-row-extend[itin-id="' + id + '"]');
  if (extensionElem) {
    updateRow(extensionElem, data);
  }
});

function queryAndParseInlinedData() {
  let scriptData = [];
  document.querySelectorAll('script[nonce]').forEach(s=>scriptData.push(s.textContent));
  scriptData = scriptData
      .filter(sd=>sd.startsWith('AF_initDataCallback'))
      .map(sd=>sd.slice(50,-20));
  scriptData.forEach(sd=> {
    try {
      let flightData = JSON.parse(sd);
      if(flightData.length && flightData.length == 27) {
        // This is likely the right flight data.
        window.taco5.flightdata.processSearchResult(flightData);
      }
    } catch (e) {
      console.log('Fail to JSON parse inlined data.');
      console.log(e);
    }
  });
}

queryAndParseInlinedData();

})(); // Close closure wrap.
