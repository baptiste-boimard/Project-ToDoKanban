
const utilsModule = {

    //Remove la class 'is-active' pour hide le Modal
    hideModals: () => {
        const allModals = document.querySelectorAll('.modal');
        allModals.forEach(modal => {
            modal.classList.remove('is-active');
        });
    },
    //fonction qui gére de cacher et faire apparaitre les formulaires
    showAndHide: (parent, classToHide, classToShow) => {
        parent.querySelector(classToHide).classList.add('is-hidden');
        parent.querySelector(classToShow).classList.remove('is-hidden');
    },

    // fonction pour transformer une couleur rgb en hex
    RGBToHex :(rgb) => {
        // Choose correct separator
        let sep = rgb.indexOf(",") > -1 ? "," : " ";
        // Turn "rgb(r,g,b)" into [r,g,b]
        rgb = rgb.substr(4).split(")")[0].split(sep);
      
        let r = (+rgb[0]).toString(16),
            g = (+rgb[1]).toString(16),
            b = (+rgb[2]).toString(16);
      
        if (r.length == 1)
          r = "0" + r;
        if (g.length == 1)
          g = "0" + g;
        if (b.length == 1)
          b = "0" + b;
      
        return "#" + r + g + b;
    
    },

}

module.exports = utilsModule;