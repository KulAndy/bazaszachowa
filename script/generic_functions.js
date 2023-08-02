export default {
  replaceNationalCharacters(text) {
    let toReplace = text;
    toReplace = toReplace.replace(/ą/g, "a");
    toReplace = toReplace.replace(/Ą/g, "A");
    toReplace = toReplace.replace(/ć/g, "c");
    toReplace = toReplace.replace(/Ć/g, "C");
    toReplace = toReplace.replace(/ę/g, "e");
    toReplace = toReplace.replace(/Ę/g, "E");
    toReplace = toReplace.replace(/ł/g, "l");
    toReplace = toReplace.replace(/Ł/g, "L");
    toReplace = toReplace.replace(/ń/g, "n");
    toReplace = toReplace.replace(/Ń/g, "n");
    toReplace = toReplace.replace(/ó/g, "o");
    toReplace = toReplace.replace(/Ó/g, "o");
    toReplace = toReplace.replace(/ś/g, "s");
    toReplace = toReplace.replace(/Ś/g, "s");
    toReplace = toReplace.replace(/ź/g, "z");
    toReplace = toReplace.replace(/Ź/g, "Z");
    toReplace = toReplace.replace(/ż/g, "z");
    toReplace = toReplace.replace(/Ż/g, "Z");
    return toReplace;
  },
  categoryToRanking(category) {
    switch (category.toUpperCase()) {
      case "GM":
        return 2600;
      case "IM":
        return 2450;
      case "WGM":
        return 2400;
      case "M":
        return 2400;
      case "FM":
        return 2300;
      case "K++":
        return 2300;
      case "K+":
        return 2275;
      case "WIM":
        return 2250;
      case "CM":
        return 2200;
      case "K":
        return 2200;
      case "WFM":
        return 2100;
      case "I++":
        return 2100;
      case "I+":
        return 2075;
      case "WCM":
        return 2050;
      case "I":
        return 2000;
      case "II+":
        return 1900;
      case "II":
        return 1800;
      case "III":
        return 1600;
      case "IV":
        return 1250;
      case "V":
        return 1200;
      default:
        return 1000;
    }
  },
};
